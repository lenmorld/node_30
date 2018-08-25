// sample of public statuses
var stream = T.stream('statuses/sample')

stream.on('tweet', function(tweet) {
  console.log(tweet)
})

var stream = T.stream('statuses/filter', { track: 'starbucks' })

stream.on('tweet', function(tweet) {
  console.log("==================================")
  console.log(tweet.user.name, " : ", tweet.text, " [at] ", tweet.created_at)
  console.log("==================================")
})

stream.on('error', function(error) {
  throw error;
});

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
