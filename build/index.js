"use strict";

require("regenerator-runtime/runtime");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _axios = _interopRequireDefault(require("axios"));

var _auth = require("./utility/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var init = function init() {
  var image_path = "./src/temp_image";

  if (!_fs["default"].existsSync(image_path)) {
    _fs["default"].mkdirSync(image_path);

    _fs["default"].writeFileSync("".concat(image_path, "/info.json"), "{}", function (err) {
      if (err) throw err;
    });

    _fs["default"].writeFileSync("".concat(image_path, "/a.jpg"), null, function (err) {
      if (err) throw err;
    });
  }
};

var save_image = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, post_id) {
    var response, image_path, writer;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios["default"].get(url, {
              responseType: "stream"
            });

          case 2:
            response = _context.sent;
            image_path = "./src/temp_image/".concat(post_id, ".jpg");
            writer = _fs["default"].createWriteStream(image_path);
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
    }, _callee);
  }));

  return function save_image(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var delete_image = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(file_path) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(_path["default"].extname(file_path) == ".jpg")) {
              _context2.next = 3;
              break;
            }

            _context2.next = 3;
            return _fs["default"].unlinkSync(file_path, function (err) {
              if (err) throw err;
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function delete_image(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var write_info = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(incoming_file) {
    var info_path;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            info_path = "./src/temp_image/info.json";
            _context3.next = 3;
            return _fs["default"].writeFileSync(info_path, JSON.stringify(incoming_file), function (err) {
              if (err) throw err;
            });

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function write_info(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var post_to_twitter = function post_to_twitter(tweet_info) {
  var b64content = _fs["default"].readFileSync(tweet_info.image_path, {
    encoding: "base64"
  });

  _auth.TwitterClient.post('media/upload', {
    media_data: b64content
  }, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string;
    var altText = "animal crossing meme from reddit";
    var meta_params = {
      media_id: mediaIdStr,
      alt_text: {
        text: altText
      }
    };

    _auth.TwitterClient.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = {
          status: "".concat(tweet_info.title, "\n\n\n#AnimalCrossing\n#ACNH\n#NintendoSwitch"),
          media_ids: [mediaIdStr]
        };

        _auth.TwitterClient.post('statuses/update', params, function (err, data, response) {});
      }
    });
  });
};

var fetch_image = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var incoming_posts, image_path, full_path, files, _iterator, _step, dir_file, filename, i, file;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _auth.RedditClient.getSubreddit('animalcrossingmeme').getNew({
              time: "day"
            });

          case 3:
            incoming_posts = _context4.sent;
            image_path = "./src/temp_image/";
            files = _fs["default"].readdirSync(image_path);
            _iterator = _createForOfIteratorHelper(files);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                dir_file = _step.value;

                if (_path["default"].extname(dir_file) == ".jpg") {
                  full_path = "".concat(image_path).concat(dir_file);
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            filename = _path["default"].basename(full_path, _path["default"].extname(full_path));
            i = 0;

          case 10:
            if (!(i < incoming_posts.length - 1)) {
              _context4.next = 22;
              break;
            }

            file = incoming_posts[i];

            if (!(file.id !== filename && file.is_video == false)) {
              _context4.next = 18;
              break;
            }

            delete_image(full_path);
            write_info(file);
            _context4.next = 17;
            return save_image(file.url, file.id);

          case 17:
            return _context4.abrupt("break", 22);

          case 18:
            return _context4.abrupt("continue", 19);

          case 19:
            i++;
            _context4.next = 10;
            break;

          case 22:
            _context4.next = 27;
            break;

          case 24:
            _context4.prev = 24;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);

          case 27:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 24]]);
  }));

  return function fetch_image() {
    return _ref4.apply(this, arguments);
  };
}();

var get_file = function get_file() {
  var info_path = "./src/temp_image/info.json";
  var temp_image_data = JSON.parse(_fs["default"].readFileSync(info_path, "utf8"));
  var info = {
    title: null,
    image_path: null
  };
  var path_name = "./src/temp_image";
  info.title = temp_image_data.title;

  _fs["default"].readdirSync(path_name).forEach(function (file) {
    if (_path["default"].extname(file) == ".jpg") {
      info.image_path = "".concat(path_name, "/").concat(file);
    }
  });

  return info;
};

var main = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var info;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            init();
            console.log("before: ", get_file());
            _context5.next = 5;
            return fetch_image();

          case 5:
            console.log("after: ", get_file());
            info = get_file(); // post_to_twitter(info)

            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 9]]);
  }));

  return function main() {
    return _ref5.apply(this, arguments);
  };
}();

main();
//# sourceMappingURL=index.js.map