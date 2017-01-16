const fs = require('fs');
const path = require('path');
const http = require('http');

function download(lib, cb) {
  const url = `http://package.elm-lang.org/packages/${lib.author}/${lib.name}/${lib.version}/documentation.json`;

  http.get(url, (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    if (statusCode !== 200) {
      res.resume();
      cb(false, `ERROR - Response had an unexpected status code: ${statusCode}`);
      return;
    } else if (!/^application\/json/.test(contentType)) {
      res.resume();
      cb(false, `ERROR - Response had an invalid content-type: Was expecting "application/json" but received ${contentType}`);
      return;
    }

    res.setEncoding('utf8');

    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });

    res.on('end', () => {
      let moduleArray;
      try {
        moduleArray = JSON.parse(rawData);
      } catch (e) {
        cb(false, `ERROR - Failed to parse the received JSON file: ${e.message}`);
      }

      const data = {
        name: lib.name,
        author: lib.author,
        version: lib.version,
        modules: moduleArray,
      };

      const file = path.join(lib.dir, 'documentation.json');

      fs.writeFile(file, JSON.stringify(data), (e) => {
        if (e) {
          cb(false, `ERROR - Failed to write documentation.json: ${e.message}`);
          return;
        }

        cb(true);
      });
    });
  }).on('error', (e) => {
    cb(false, `ERROR - Reguest failed with the following error: ${e.message}`);
  });
}

module.exports = download;
