# Elm Documentation Downloader
Simple command line tool that downloads `documentation.json` for all installed dependencies in your project `elm-stuff` folder from [package.elm-lang.org](package.elm-lang.org).

## Install
It can be found in NPM as [`elm-docs-download`](https://www.npmjs.com/package/elm-docs-download) so install it with:
```bash
npm install elm-docs-download --global
```

## Usage
You can simply call it in your project folder:
```bash
elm-docs-download
```

Alternatively you can provide a path to use as project folder (if you are not running the command from said directory)
```bash
elm-docs-download /usr/loca/my-project
```

For more info you can always use the `--help` command
```bash
elm-docs-download --help
```

## Info
`elm-docs-download` searches your project trying to find the `elm-stuff` folder. Then it searches for all modules with an `elm-package.json` file and inside of their folder looks up a `documentation.json` file.

If this file is found it checks it's content to see if they match the author, name and version of the module.
If they match, then it won't download anything, but if they don't then `documentation.json` is downloaded from [package.elm-lang.org](package.elm-lang.org).

It should be noted that `elm-docs-download` performs some modifications in this file.
The returned JSON from [package.elm-lang.org](package.elm-lang.org) is a list with all the modules provided in the library.
`elm-docs-download` generates a JSON file with an object instead, this object has 4 keys:
 - `name`: The package name
 - `author`: The package author
 - `version`: The version of the package
 - `modules`: The list of modules from the original `dependencies.json` from [package.elm-lang.org](package.elm-lang.org)
This modification is in order to fix the [issue 149 from elm-make](https://github.com/elm-lang/elm-make/issues/149)

In the future if [issue 28 from elm-make](https://github.com/elm-lang/elm-make/issues/28) and/or [issue 240 from elm-package](https://github.com/elm-lang/elm-package/issues/240) is solved there won't be any meaning in this package so this is a temporary solution

## License
This project is licensed under **MIT License** with the following copyright:
**Copyright (c) 2017 - [Pablo A. Mayobre (Positive07)](https://github.com/Positive07)**
