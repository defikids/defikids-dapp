# Contributing to DefiKids on GitHub

Thank you for taking the time to contribute to [DefiKids](https://github.com/defikids/defikids-dapp).

We want you to have a great experience making your first contribution.

This contribution could be anything from a small fix to a typo in our
documentation or a full feature.

Tell us what you enjoy working on and we would love to help!

If you would like to contribute, but don't know where to start, check the
issues that are labeled
`good first issue`
or
`help wanted`.

You can contribute to our documentation and code in TypeScript, Solidity, and Rust (Forge)

If you have any other questions about contributing, please don't hesitate to ask

## Code Style

Please follow the [node style guide](https://github.com/felixge/node-style-guide).

## Code of Conduct

We strive to keep the DefiKids community an open and welcoming environment.
Please read and follow our Community Code of Conduct.

## Get help

If you have any questions, or feedback or need help integrating DefiKids into your family
please ask in our [Discord Community](https://github.com/build-trust/ockam/discussions)
or send us an email at [support@defikids.io](mailto:support@defikids.io). To leave feedback please email us
at [hello@defikids.io](mailto:hello@defikids.io)


## Report a bug

If you find a bug in the source code, you can help us by
[submitting an issue](https://github.com/defikids/defikids-dapp/issues)
or, even better, a [pull request](#send_a_pull_request) with a fix.

Before you submit a new issue please
[search the archive](https://github.com/defikids/defikids-dapp/issues)
to see if your issue has already been reported. Avoiding duplicate issues helps
us focus our time on fixing issues and adding new features.

## Request a new feature

If you think of a new feature that would make DefiKids better for everyone, please
[start a discussion in our #feature-request](https://discord.gg/bDGMYNa8Ng) community channel to propose the idea.

## Pull Requests

Pull Requests descriptions must start with 1 of 4 emojis listed here (⭐ | 🌟 | ✨ | 🤩) 
You choose because we think contributing to open source is fun :)

### Commits

* All authors of all commits in a Pull Request must abide by the DefiKids Community [Code of Conduct](CODE_OF_CONDUCT.md).
* We follow a linear commit history in our git repositories, a pull request cannot contain merge commits. To apply upstream changes to a branch, please rebase it to the base branch.

### Commit Messages

Each commit message consists of a header which includes a type, a scope, and a subject:

```
   <type>(<scope>): <subject>
  
```

* `<type>(<scope>): <subject>` must not be longer that 100 characters.
* type is required, must be in lower case and have one of the below values.
  - build: changes that affect our build system or external dependencies
  - ci: changes to our continuous integration configuration files
  - feat: a new feature
    - Please add an implementation scope to a feature commit `feat(typescript):`
    - If a commit affects multiple implementations, please break it into two commits.
  - fix: a fix to a bug in an existing feature
    - Please add an implementation scope to a bug fix commit `fix(type):`
    - If a commit affects multiple implementations, please break it into two commits.
  - refactor: code change that neither fixes a bug nor adds a feature
    - Please add an implementation scope to a refactor commit `refactor(typescript):`
    - If a commit affects multiple implementations, please break it into two commits.
  - style: changes that do not affect the meaning of the code (white space, formatting, etc.)
  - test: add missing tests or correct existing tests
  - docs: a documentation only change
  - chore: some minor change that doesn't fall into any of the other types

## Helpful References

* [Making your first contribution to open source](https://dev.to/nathan_tarbert/navigating-the-open-source-landscape-finding-your-first-contribution-3fap)
* [How to contribute to open source](https://opensource.guide/how-to-contribute/)
