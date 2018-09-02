// Callbakcks
// -> promise nesting 2

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

function getAllFiles() {
  return new Promise((resolve, reject) => {
    resolve([1,2,3]);
  });
}

function classesToFilesMap() {
  return new Promise((resolve, reject) => {
      getAllFiles().then(_files => {
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
  });
}

//---> WORKS! -> returns 1 set
searchInFile('./some_file', numCssClassesPattern).then(result => {
  console.log(result);
});

// COMPLEXer!
// ---> WORKS 3 sets, given the number of items passed

// WORKS! -> returns 3 sets(based on the arr length returned by getAllFiles() Promise )
classesToFilesMap().then(r => {
  console.log(r);
});
