// Callbakcks
// -> promise nesting

function searchInFile(file, pattern) {
    // console.log("file, pattern: ", file, pattern);
    return new Promise((resolve, reject) => {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(file),
        });

        var matches = [];

        lineReader
            .on('line', function(line) {
                // lines.push(line);
                // console.log("line: ", line);
                var _matches = line.match(pattern);
                if (_matches && _matches.length) {
                    // console.log(_matches, "_", line);
                    // resolve({ class_name: _matches[0], line: line });
                    // resolve(_matches);
                    matches.push(_matches);
                }
            })
            .on('close', function(line) {
                // resolve(null);
                resolve(matches);
            })
            .on('error', reject);
    });
}

var numCssClassesPattern = new RegExp(/(?<=in_reply).*/gm);

//---> WORKS!
// searchInFile('./some_file', numCssClassesPattern).then(result => {
//   console.log(result);
// });

// ---> WORKS 3 sets, given the number of items passed
function some(_files) {
  return new Promise((resolve, reject) => {
        var promises = _files.map(_file => {
            return new Promise((resolve, reject) => {
                searchInFile('./some_file', numCssClassesPattern).then(result => {
                    resolve(result);
                });
            });
        });

        Promise.all(promises).then(classes_files_array => {
            resolve(classes_files_array);
        });
  });
}


some([1,2,3]).then(r => {
  console.log(r);
});
