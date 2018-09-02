
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

// =============================================
// solution 1: collecting results in an external array
/* Multiple promises:
would this work?
*/

let peoples = [1,2,3];
let results = [];

peoples.forEach(p => {
  fetchData2(p).then(result => {
      results.push(result);
    });
});

console.log("Your data is here: ", results);
// --> []
// why?

// =============================================
// solution 1: map() and Promise.all

const promises = peoples.map(p => {
    return new Promise((resolve, reject) => {
      fetchData2(p).then(result => {
        resolve(result);
      });
    })
});

Promise.all(promises).then(results => {
  console.log(results);
});
