require('dotenv').config()

var Twit = require('twit')

const timeout_ms = 60*1000  // optional HTTP request timeout to apply to all requests.

console.log(process.env.consumer_key);

var T = new Twit({
  consumer_key:         process.env.consumer_key,
  consumer_secret:      process.env.consumer_secret,
  access_token:         process.env.access_token,
  access_token_secret:  process.env.access_token_secret,
  timeout_ms:           timeout_ms
})

// sample of public statuses
// var stream = T.stream('statuses/sample')
//
// stream.on('tweet', function(tweet) {
//   console.log(tweet)
// })


// var stream = T.stream('statuses/filter', { track: 'starbucks' })
//
// stream.on('tweet', function(tweet) {
//   console.log("==================================")
//   console.log(tweet.user.name, " : ", tweet.text, " [at] ", tweet.created_at)
//   console.log("==================================")
// })
//
// stream.on('error', function(error) {
//   throw error;
// });

var tweet = {
  status: "Well hey there!"
};


function tweetFunction(err, data, response) {
  if (err) {
    console.log('wrong!', err);
  } else {
    console.log("workd!");
  }
}

T.post('statuses/update', tweet, tweetFunction);




/*
//
// filter the public stream by the latitude/longitude bounded box of San Francisco
//
var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]

var stream = T.stream('statuses/filter', { locations: sanFrancisco })

stream.on('tweet', function (tweet) {
  console.log(tweet)
})

//
// filter the public stream by english tweets containing `#apple`
//
var stream = T.stream('statuses/filter', { track: '#apple', language: 'en' })

stream.on('tweet', function (tweet) {
  console.log(tweet)
})

*/

// source: https://usamaejaz.com/twitter-streaming-api-nodejs/
// https://www.nodejsera.com/get_tweets_using_nodejs.html
