# Tips for dealing with dependencies

## Updating dependencies

To check if a project's dependencies are up-to-date, the npm package manager has a built-in command `npm outdated`. Its output might look something like this:

```sh
Package             Current   Wanted   Latest  Location
autoprefixer         10.2.6   10.3.1   10.3.1  global
esbuild              0.12.9  0.12.15  0.12.15  global
eslint               7.29.0   7.31.0   7.31.0  global
gulp-esbuild          0.8.2    0.8.3    0.8.3  global
lint-staged          11.0.0   11.0.1   11.0.1  global
markdown-it          12.0.6   12.1.0   12.1.0  global
markdown-it-anchor    8.0.3    8.1.0    8.1.0  global
simple-git-hooks      2.4.1    2.5.1    2.5.1  global
```

The table shows that some dependencies have updated minor or patch versions. In this case, it is safe (from a semantic versioning perspective) to run the command `npm update` or `npm update <package-name>`.

Some dependencies have an updated major version. Before installing it, it's useful to know what changes have occurred in the package. These could be significant changes to the external API or the library core. Changes are typically stored in the CHANGELOG , CHANGELOG.md , or NEWS files in the root of the project repository. You can access the repository with the command npm repo <package-name>.

If everything is OK, you can update the major version of the package: `npm i <package-name>@latest.` After updating, be sure to check that the command executes correctly `npm run build`and its results.

There is a way to bulk update all dependencies to new major versions using a third-party package `npm-check-updates:`

```
npx npm-check-updates -u
npm install
```

## Resolving conflicts in the package-lock.json file

Merge conflicts may occasionally occur in Git for package-lock.json . Manually editing this file should only be done in exceptional situations.

To resolve conflicts in this file, you can use the following algorithm:

fix conflicts (if any) in the package.json file ;
we accept changes to package-lock.json from the branch that we are merging into ours;
Update the package-lock.json file by running the command `npm install`.
