"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _auth = require("./utility/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var init = function init() {
  var image_path = "./src/temp_image";

  if (!_fs2.default.existsSync(image_path)) {
    _fs2.default.mkdirSync(image_path);
    _fs2.default.writeFileSync(image_path + "/info.json", "{}", function (err) {
      if (err) throw err;
    });
    _fs2.default.writeFileSync(image_path + "/a.jpg", null, function (err) {
      if (err) throw err;
    });
  }
};

var save_image = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, post_id) {
    var response, image_path, writer;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios2.default.get(url, { responseType: "stream" });

          case 2:
            response = _context.sent;
            image_path = "./src/temp_image/" + post_id + ".jpg";
            writer = _fs2.default.createWriteStream(image_path);

            response.data.pipe(writer);

            return _context.abrupt("return", new Promise(function (resolve, reject) {
              writer.on('finish', resolve);
              writer.on('error', reject);
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function save_image(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var delete_image = function delete_image(file_path) {
  if (_path2.default.extname(file_path) == ".jpg") {
    _fs2.default.unlink(file_path, function (err) {
      if (err) throw err;
    });
  }
};

var write_info = function write_info(incoming_file) {
  var info_path = "./src/temp_image/info.json";
  _fs2.default.writeFileSync(info_path, JSON.stringify(incoming_file), function (err) {
    if (err) throw err;
  });
};

var post_to_twitter = function post_to_twitter(tweet_info) {
  var b64content = _fs2.default.readFileSync(tweet_info.image_path, { encoding: "base64" });
  _auth.TwitterClient.post('media/upload', { media_data: b64content }, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string;
    var altText = "animal crossing meme from reddit";
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

    _auth.TwitterClient.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: tweet_info.title + "\n\n\n#AnimalCrossing\n#ACNH\n#NintendoSwitch", media_ids: [mediaIdStr] };

        _auth.TwitterClient.post('statuses/update', params, function (err, data, response) {});
      }
    });
  });
};

var fetch_image = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var incoming_posts, image_path, full_path, files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, dir_file, filename, i, file;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _auth.RedditClient.getSubreddit('animalcrossingmeme').getNew({ time: "day" });

          case 3:
            incoming_posts = _context2.sent;
            image_path = "./src/temp_image/";
            files = _fs2.default.readdirSync(image_path);
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 9;

            for (_iterator = files[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              dir_file = _step.value;

              if (_path2.default.extname(dir_file) == ".jpg") {
                full_path = "" + image_path + dir_file;
              }
            }
            _context2.next = 17;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](9);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 17:
            _context2.prev = 17;
            _context2.prev = 18;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 20:
            _context2.prev = 20;

            if (!_didIteratorError) {
              _context2.next = 23;
              break;
            }

            throw _iteratorError;

          case 23:
            return _context2.finish(20);

          case 24:
            return _context2.finish(17);

          case 25:
            filename = _path2.default.basename(full_path, _path2.default.extname(full_path));
            i = 0;

          case 27:
            if (!(i < incoming_posts.length - 1)) {
              _context2.next = 39;
              break;
            }

            file = incoming_posts[i];

            if (!(file.id !== filename && file.is_video == false)) {
              _context2.next = 35;
              break;
            }

            delete_image(full_path);
            write_info(file);
            _context2.next = 34;
            return save_image(file.url, file.id);

          case 34:
            return _context2.abrupt("break", 39);

          case 35:
            return _context2.abrupt("continue", 36);

          case 36:
            i++;
            _context2.next = 27;
            break;

          case 39:
            _context2.next = 44;
            break;

          case 41:
            _context2.prev = 41;
            _context2.t1 = _context2["catch"](0);

            console.log(_context2.t1);

          case 44:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 41], [9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function fetch_image() {
    return _ref2.apply(this, arguments);
  };
}();

var get_file = function get_file() {
  var info_path = "./src/temp_image/info.json";
  var temp_image_data = JSON.parse(_fs2.default.readFileSync(info_path, "utf8"));
  var info = {
    title: null,
    image_path: null
  };
  var path_name = "./src/temp_image";
  info.title = temp_image_data.title;
  _fs2.default.readdirSync(path_name).forEach(function (file) {
    if (_path2.default.extname(file) == ".jpg") {
      info.image_path = path_name + "/" + file;
    }
  });
  return info;
};

var main = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var info;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            init();
            console.log("before: ", get_file());
            _context3.next = 5;
            return fetch_image();

          case 5:
            console.log("after: ", get_file());
            info = get_file();

            post_to_twitter(info);
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);

            console.log(_context3.t0);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 10]]);
  }));

  return function main() {
    return _ref3.apply(this, arguments);
  };
}();
main();
//# sourceMappingURL=index.js.map