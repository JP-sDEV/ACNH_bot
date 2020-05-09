"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedditClient = exports.TwitterClient = undefined;

var _twit = require("twit");

var _twit2 = _interopRequireDefault(_twit);

var _snoowrap = require("snoowrap");

var _snoowrap2 = _interopRequireDefault(_snoowrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();
var PE = process.env;
var TwitterClient = new _twit2.default({
  // subdomain: "api", // "api" is the default (change for other subdomains)
  // version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: PE.TWITTER_CONSUMER_KEY, // from Twitter.
  consumer_secret: PE.TWITTER_CONSUMER_SECRET, // from Twitter.
  access_token: PE.TWITTER_ACCESS_TOKEN, // from your User (oauth_token)
  access_token_secret: PE.TWITTER_ACCESS_TOKEN_SECRET // from your User (oauth_token_secret)
});

var RedditClient = new _snoowrap2.default({
  userAgent: PE.REDDIT_USER_AGENT,
  clientId: PE.REDDIT_CLIENT_ID,
  clientSecret: PE.REDDIT_CLIENT_SECRET,
  username: PE.REDDIT_USERNAME,
  password: PE.REDDIT_PASSWORD
});

exports.TwitterClient = TwitterClient;
exports.RedditClient = RedditClient;