const path = require('path');

const fs = require('fs');
const glob = require('glob');

function scraper(cwd) {
  // We first find elm-stuff/packages in the current working directory
  const packages = path.join(cwd, 'elm-stuff', 'packages');
  let dirs = [];

  if (fs.existsSync(packages)) {
    // Then we find all packages inside of it which contain an elm-package.json
    dirs = glob.sync(`${packages}/*/*/*/elm-package.json`);
  } else {
    // Finish with an error if no elm-stuff is found.
    throw new Error('ERROR - Couldn\'t find elm-stuff in the specified directory');
  }

  // We don't really care about elm-package.json just now
  const list = {};
  const reg = new RegExp('^(.*)elm-package.json$');

  dirs.forEach((unnormalizedPath) => {
    const elmPackage = path.normalize(unnormalizedPath);
    const dir = elmPackage.replace(reg, '$1');

    // We do care about the author, package name and version
    const data = path.relative(packages, dir).split(path.sep);
    // For simplicity's sake we use author/package to identify packages
    const index = `${data[0]}/${data[1]}`;

    // We then add the package to the returned list
    list[index] = list[index] || {};
    list[index][data[2]] = {
      name: data[1],
      author: data[0],
      version: data[2],
      dir,
    };
  });

  return list;
}

module.exports = scraper;
