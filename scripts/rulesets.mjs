#!/usr/bin/env node
// The same two rulesets on every repository of the organization: `main` (pull request, required checks, no deletion
// nor force-push) and `v*` tags (created by an admin only, never deleted nor moved). A free organization has no
// organization rulesets, so this applies them repository by repository.
//
//   node scripts/rulesets.mjs --check     reports each repository: ok, missing or different
//   node scripts/rulesets.mjs --apply     creates or updates them (by name); "checks": "keep" keeps a repository's
//                                         current required checks (the engine's list is long and lives in its CI)
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const MAIN = 'main: the gates required';
const TAGS = 'tags v*: created by the maintainer, never deleted nor moved';
const ADMIN = { actor_id: 5, actor_type: 'RepositoryRole', bypass_mode: 'always' };

const gh = (args, input) => {
  try {
    return JSON.parse(execFileSync('gh', ['api', ...args], { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }) || 'null');
  } catch (e) {
    if (/HTTP 404/.test(String(e.stderr))) return undefined;
    throw new Error(`gh api ${args.join(' ')}: ${e.stderr || e.message}`);
  }
};

const mainRuleset = (checks) => ({
  name: MAIN,
  target: 'branch',
  enforcement: 'active',
  bypass_actors: [],
  conditions: { ref_name: { include: ['refs/heads/main'], exclude: [] } },
  rules: [
    { type: 'deletion' },
    { type: 'non_fast_forward' },
    {
      type: 'pull_request',
      parameters: {
        allowed_merge_methods: ['merge'],
        dismiss_stale_reviews_on_push: false,
        require_code_owner_review: false,
        require_last_push_approval: false,
        required_approving_review_count: 0,
        required_review_thread_resolution: false,
      },
    },
    ...(checks.length
      ? [
          {
            type: 'required_status_checks',
            parameters: {
              strict_required_status_checks_policy: false,
              required_status_checks: checks.map((context) => ({ context })),
            },
          },
        ]
      : []),
  ],
});

const tagRuleset = () => ({
  name: TAGS,
  target: 'tag',
  enforcement: 'active',
  bypass_actors: [ADMIN],
  conditions: { ref_name: { include: ['refs/tags/v*'], exclude: [] } },
  rules: [{ type: 'creation' }, { type: 'deletion' }, { type: 'non_fast_forward' }],
});

const checksOf = (rs) =>
  (rs?.rules ?? []).find((r) => r.type === 'required_status_checks')?.parameters.required_status_checks.map((c) => c.context) ?? [];
const ruleTypes = (rs) => (rs?.rules ?? []).map((r) => r.type).sort().join(',');

const mode = process.argv.includes('--apply') ? 'apply' : 'check';
const { repos } = JSON.parse(readFileSync(new URL('./rulesets.json', import.meta.url), 'utf8'));
let bad = 0;
for (const [repo, conf] of Object.entries(repos)) {
  const list = gh([`repos/${repo}/rulesets`]);
  if (list === undefined) {
    console.log(`${repo}: no such repository (yet)`);
    continue;
  }
  const byName = Object.fromEntries(list.map((r) => [r.name, gh([`repos/${repo}/rulesets/${r.id}`])]));
  const checks = conf.checks === 'keep' ? checksOf(byName[MAIN]) : conf.checks;
  for (const want of [mainRuleset(checks), tagRuleset()]) {
    const have = byName[want.name];
    const same =
      have &&
      have.enforcement === 'active' &&
      ruleTypes(have) === ruleTypes(want) &&
      checksOf(have).sort().join() === checksOf(want).sort().join();
    if (same) {
      console.log(`${repo}: ${want.name}: ok`);
      continue;
    }
    if (mode === 'check') {
      bad++;
      console.log(`${repo}: ${want.name}: ${have ? 'different' : 'missing'}`);
      continue;
    }
    const body = JSON.stringify(want);
    if (have) gh(['-X', 'PUT', `repos/${repo}/rulesets/${have.id}`, '--input', '-'], body);
    else gh(['-X', 'POST', `repos/${repo}/rulesets`, '--input', '-'], body);
    console.log(`${repo}: ${want.name}: ${have ? 'updated' : 'created'}`);
  }
}
process.exit(bad ? 1 : 0);
