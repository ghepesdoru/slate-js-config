const Concat = require('concat-with-sourcemaps');
const glob = require('glob');
const fs = require('fs');

var concat = new Concat(true, 'slate.js', '\n');
var files = glob.sync('dist/src/**.*').sort();

concat.add(null, `
var exports = {};

var require = function (name) { return exports[name] || exports; }

var l = slate.log;
slate.log = function () {
  var all = [];

  for (var i = 0; i < arguments.length; i++) {
    all.push(JSON.stringify(arguments[i], null, 2));
  }

  l(all.join('\\n'));
}`);

files.forEach((f, all, i) => {
  if (f.indexOf('.js') > -1 && f.indexOf('.js.map') === -1) {
    if (files[i + 1] && files[i + 1].indexOf('.js.map') > -1) {
      concat.add(f, fs.readFileSync(f), fs.readFileSync(files[i + 1]));
    } else {
      concat.add(f, fs.readFileSync(f));
    }
  }
});

concat.add(null, 'require(\'slate\');');

fs.writeFileSync('dist/slate.js', concat.content);
fs.writeFileSync('dist/slate.js.map', concat.sourceMap);
