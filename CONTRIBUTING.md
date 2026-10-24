# Contributing to quest'n'click

*[Version française plus bas](#contribuer-à-questnclick)*

Thank you for coming. This page is the same for every repository of the organization; each repository's own
`CONTRIBUTING.md` adds how to run and test it.

## Pick where you contribute

| Area | Repository | You will touch |
|---|---|---|
| Engine and player | `quest-n-click` | `src/engine`, the DSL, the solver and validator |
| Local Studio (the editor) | `quest-n-click` | `src/studio`, `tools/studio` |
| Hosted Studio | `studio-server` *(today: `quest-n-click/studio-server/`)* | the server, the worker, migrations, deployment |
| Sample games | `games` *(today: `quest-n-click/games/`)* | a game's data, art, sound and texts |
| Minigames | `minigames` *(today: `quest-n-click/src/engine/minigames/`)* | one minigame, its tests and sandbox |
| Documentation | `quest-n-click` | `wiki/en` and `wiki/fr`, always both |

Labels `area:engine`, `area:studio`, `area:games`, `area:docs` say which one an issue belongs to.

## A first contribution

1. Take an issue labelled `good first issue`. It states the expected result and the file to open first.
   Say in a comment that you take it, so two people do not do the same work.
2. Follow the repository's quickstart in its README, then its `CONTRIBUTING.md`.
3. Open a pull request early, as a draft if you like. Its template lists what the review checks.

## Review

- Every pull request is reviewed by a member of the team that owns the files (`CODEOWNERS`), and merged only when
  its checks are green.
- A review says what blocks the merge and what is only a suggestion. Suggestions do not block.
- Releases are cut and signed by the maintainer.

## AI assistants are optional

You can contribute with or without an AI assistant. Pull requests are reviewed the same way however they were
written, and you answer for what you submit: read and run it before asking for a review.

## Conduct and security

Everyone follows the [Code of Conduct](CODE_OF_CONDUCT.md). A vulnerability is reported privately: see
[SECURITY](SECURITY.md).

---

## Contribuer à quest'n'click

Merci d'être là. Cette page vaut pour tous les dépôts de l'organisation ; le `CONTRIBUTING.md` de chaque dépôt dit
comment le lancer et le tester.

**Choisir où contribuer.** Le moteur, le Studio local et la documentation sont dans `quest-n-click`. Le Studio hébergé,
les jeux exemples et les mini-jeux auront chacun leur dépôt (`studio-server`, `games`, `minigames`) ; en attendant,
leur code est dans `quest-n-click`. Les libellés `area:*` rangent les issues.

**Une première contribution.** Prenez une issue `good first issue` : elle dit le résultat attendu et le fichier à
ouvrir d'abord. Annoncez-le en commentaire, suivez le démarrage rapide du dépôt, puis ouvrez une PR, en brouillon si
vous voulez.

**Relecture.** Chaque PR est relue par l'équipe propriétaire des fichiers (`CODEOWNERS`) et fusionnée quand ses
vérifications sont vertes. La relecture distingue ce qui bloque de ce qui n'est qu'une suggestion. Les releases sont
faites et signées par le mainteneur.

**L'IA est facultative.** On peut contribuer avec ou sans assistant ; la relecture est la même, et chacun répond de ce
qu'il propose.
