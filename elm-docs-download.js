#!/usr/bin/env node

const commander = require('commander');

const scraper = require('./scraper.js');
const json = require('./json.js');
const download = require('./download.js');
const Pool = require('./pool.js');

let cwd;

commander
  .description('Downloads documentation.json for all your installed dependencies')
  .version('0.1.0')
  .arguments('[dir]')
  .description('  [dir] optional search directory (default is current directory)')
  .action((argument) => {
    cwd = argument;
  });


commander.parse(process.argv);

const pool = new Pool('MAIN', () => {
  console.log('-----FINISHED-----');
});

function waitFor(list) {
  let wait = 0;

  const packs = Object.keys(list);
  packs.forEach((pack) => {
    const versions = Object.keys(list[pack]);
    versions.forEach(() => { wait += 1; });
  });

  return wait;
}

function forVersions(list, cb) {
  const packs = Object.keys(list);
  packs.forEach((pack) => {
    const versions = Object.keys(list[pack]);
    versions.forEach((version) => {
      cb(pack, version);
    });
  });
}

cwd = cwd || process.cwd();

let list;
let ignore = false;
try {
  list = scraper(cwd);
} catch (e) {
  console.error(e.message);
  ignore = true;
}

if (!ignore && list.length === 0) {
  console.error('ERROR - No packages found');
} else if (!ignore) {
  pool.wait(waitFor(list));

  forVersions(list, (pack, version) => {
    const lib = list[pack][version];
    const str = `${pack}/${version}`;

    pool.add(str);

    json(lib, (found) => {
      if (!found) {
        download(lib, (result, error) => {
          const success = result ? 'Success' : 'Failed';

          console.log(`Downloaded: ${pack}@${version} - ${success}`);
          if (!result && error) console.error(`${error}\n`);

          pool.remove(str);
        });
      } else {
        console.log(`Found: ${pack}@${version}`);
        pool.remove(str);
      }
    });
  });
}
