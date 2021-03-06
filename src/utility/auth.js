import Twitter from "twit"
import snoowrap from "snoowrap"
const AWS = require("aws-sdk")
require("dotenv").config()
const PE = process.env
const TwitterClient = new Twitter({
    // subdomain: "api", // "api" is the default (change for other subdomains)
    // version: "1.1", // version "1.1" is the default (change for other subdomains)
    consumer_key: PE.TWITTER_CONSUMER_KEY, // from Twitter.
    consumer_secret: PE.TWITTER_CONSUMER_SECRET, // from Twitter.
    access_token: PE.TWITTER_ACCESS_TOKEN, // from your User (oauth_token)
    access_token_secret: PE.TWITTER_ACCESS_TOKEN_SECRET // from your User (oauth_token_secret)
  });

  const RedditClient = new snoowrap({
    userAgent: PE.REDDIT_USER_AGENT,
    clientId: PE.REDDIT_CLIENT_ID,
    clientSecret: PE.REDDIT_CLIENT_SECRET,
    username: PE.REDDIT_USERNAME,
    password:PE.REDDIT_PASSWORD 
  });


  const S3Client = new AWS.S3({
    accessKeyId: PE.AWS_ACCESS_KEY_ID,
    secretAccessKey: PE.AWS_SECRET_ACCESS_KEY,
    Bucket: "acnh-bot"
  });

  export {TwitterClient, RedditClient, S3Client}