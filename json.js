const fs = require('fs');
const path = require('path');

function json(lib, cb) {
  const file = path.join(lib.dir, 'documentation.json');

  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        cb(false);
        return;
      }

      let object;
      try {
        object = JSON.parse(data);
      } catch (e) {
        cb(false);
        return;
      }

      if (lib.author !== object.author) {
        console.log(`INFO - Documentation for ${lib.author}/${lib.name}@${lib.version} is from a wrong author`);
        console.log(`Searching for "${lib.author}" but found "${object.author}"\n`);
        cb(false);
      } else if (lib.name !== object.name) {
        console.log(`INFO - Documentation for ${lib.author}/${lib.name}@${lib.version} points to wrong module`);
        console.log(`Searching for "${lib.name}" but found "${object.name}"\n`);
        cb(false);
      } else if (lib.version !== object.version) {
        console.log(`INFO - Documentation for ${lib.author}/${lib.name}@${lib.version} is for a wrong version`);
        console.log(`Searching for "${lib.version}" but found "${object.version}"\n`);
        cb(false);
      } else {
        cb(true);
      }
    });
  } else {
    cb(false);
  }
}

module.exports = json;
