
// sample delay - or can use setTimeout
const sleep = (milliseconds) => {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

const fetchData2 = (id) => {
  const person = {
    id: id,
    name: "Person" + id,
  };

  // simulate 2seconds delay on a network with setTimeout
  return new Promise((resolve, reject) => {
    // simulate 2seconds delay on a network
    console.log("Fetching...");
    sleep(2000);
    resolve(person);    // return response with resolve
    // reject if there is any error
  });
}

let peoples = [1,2,3];
let results = [];

// =============================================
// solution 1: map() and Promise.all

// const promises = peoples.map(p => {
//     return new Promise((resolve, reject) => {
//       fetchData2(p).then(result => {
//         resolve(result);
//       });
//     })
// });
//
// Promise.all(promises).then(results => {
//   console.log(results);
// });

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


// const promises = peoples.map(p => {
//     return new Promise((resolve, reject) => {
//       fetchData2(p).then(result => {
//         resolve(result);
//       });
//     })
// });
//
// Promise.all(promises).then(results => {
//   console.log(results);
// });

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
