require('dotenv').config()

// https://github.com/ttezel/twit
var Twit = require('twit')
var config = require('./config.js')

var T = new Twit(config)

var preview_keyword_limit = 255

// stream something
var keywords = ['React.js', 'reactjs', 'react.js']
var stream = T.stream('statuses/filter', { track: keywords })

stream.on('tweet', function(tweet) {
  console.log("==================================")
  console.log(tweet.user.name, " : ", tweet.text, " [at] ", tweet.created_at)
  console.log("==================================")

  // tweet back to say thank you =)
  var tweet_screen_name = tweet.user.screen_name;
  var tweet_text = tweet.text;

  // don't respond to your own response (Inception!)
  if (process.env.current_user_name !== tweet_screen_name) {
    var tweet = {
      status: ["[node-bot]: Thanks for choosing #reactjs, @", tweet_screen_name,
                " <- in response to -> ", tweet.user.name, " : ",  tweet.text.substr(0, preview_keyword_limit), "..."].join("")
    };
    T.post('statuses/update', tweet, tweetFunction);
  }
})

function tweetFunction(err, data, response) {
  if (err) {
    console.log('wrong!', err);
  } else {
    console.log("worked!");
  }
}

// // a user stream
// var stream = T.stream('user')
// stream.on('follow', followed)
//

// tweet something
/*
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
*/
