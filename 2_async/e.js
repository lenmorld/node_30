// callbacks
// Promise-chaining

// sample delay - or can use setTimeout
const sleep = (milliseconds) => {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// ################################################################
/* solution 2 */
// Promises
// no more callback, the async function returns a Promise

const fetchData2 = () => {
  const person = {
    id: 20,
    name: "Lenny",
  };

  // simulate 2seconds delay on a network with setTimeout
  return new Promise((resolve, reject) => {
    // simulate 2seconds delay on a network
    console.log("Fetching...");
    sleep(3000);
    resolve(person);    // return response with resolve
    // reject if there is any error
  });
}

const fetchData3 = (param) => {
  return new Promise((resolve, reject) => {
    sleep(2000);
    resolve("[3]" + param);
  });
};

// SCENARIO 1 ============================

// chaining then()s after a Promise
// straightforward since its kind of sync() after 1 async Promise

// fetchData2().then(results => {
//   console.log("Your data is here: ", results);
//   return results;
// }).then(results=> {
//   console.log("Your data is here again: ", results);
//   return results;
// }).then(results=> {
//   console.log("Your data is here again 3rd time: ", results);
// });
// ...

// SCENARIO 2 ============================
// chaining then()s with Promises
/*
  normally, like the previous one,
  a value returned by .then() is passed to the enxt handler
  But if the value retuned is a Promise, the further execution
  is suspended until it settles
  After that (e.g. API call, setTimout, sleep), the result
  of the promise is given to the next .then() handler
*/

fetchData2().then(results => {
  console.log("Your data is here: ", results);
  console.log("Promisify-ing it...");
  // return results;

  return new Promise((resolve, reject) => {
    // a  Promise that resolves right away, just for example
    // could put a sleep() or setTimeout here
    resolve(results);
  });
}).then(results=> {
  console.log("Your data is here again: ", results);
  return results;
}).then(results=> {
  console.log("Your data is here again 3rd time: ", results);
});
// ...
