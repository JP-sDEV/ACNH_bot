"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedditClient = exports.TwitterClient = void 0;

var _twit = _interopRequireDefault(require("twit"));

var _snoowrap = _interopRequireDefault(require("snoowrap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("dotenv").config();

var PE = process.env;
var TwitterClient = new _twit["default"]({
  // subdomain: "api", // "api" is the default (change for other subdomains)
  // version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: PE.TWITTER_CONSUMER_KEY,
  // from Twitter.
  consumer_secret: PE.TWITTER_CONSUMER_SECRET,
  // from Twitter.
  access_token: PE.TWITTER_ACCESS_TOKEN,
  // from your User (oauth_token)
  access_token_secret: PE.TWITTER_ACCESS_TOKEN_SECRET // from your User (oauth_token_secret)

});
exports.TwitterClient = TwitterClient;
var RedditClient = new _snoowrap["default"]({
  userAgent: PE.REDDIT_USER_AGENT,
  clientId: PE.REDDIT_CLIENT_ID,
  clientSecret: PE.REDDIT_CLIENT_SECRET,
  username: PE.REDDIT_USERNAME,
  password: PE.REDDIT_PASSWORD
});
exports.RedditClient = RedditClient;