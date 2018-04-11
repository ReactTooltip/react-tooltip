# Contributing

This doc needs help! Please submit your PR...

## Pull request testing

Some notes on testing and releasing.
* For a PR, follow Github's command-line instructions for retrieving the branch with the changes.
* `make dev` starts a development server, open `http://localhost:8888` to see the example website.
* Provide feedback on the PR about your results.

## Doing a release

We really want to use semantic-release instead of this:

* `make deploy` updates the files in the `standalone` directory
* update the version number in `package.json`
    - Fixes update the patch number, features update the minor number.
    - Major version update is reserved for API breaking changes, not just additions. 
* `npm run github-changes -- -n 3.X.Y` to update the changelog
* `git add`, `git commit` and `git push` to get the version to master.
* `git tag -a 3.X.Y -m 3.X.Y` `git push --tags`
* `npm publish`
* add a version on the github release page, based on the tag
