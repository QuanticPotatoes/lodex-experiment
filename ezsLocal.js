const request = require("request");
const url = require("url");
const async = require("async");
const maxParallel = 10;

let nextURI = undefined;

let _feed;
let done;

/**
 * scroll use the scrolling features of API istex
 * data: url
 */
exports.scroll = function(data, feed) {
  console.time("scroll");

  const output = this.getParam("output", "doi,id");
  const query = url.parse(data);

  const urlObj = {
    protocol: "https:",
    hostname: "api-v5.istex.fr",
    pathname: "document",
    search: `${query.search}&scroll=30s&output=${output}`
  };

  const options = {
    uri: url.format(urlObj),
    method: "GET",
    json: true
  };

  request(options, (error, reponse, body) => {
    if (!error) {
      if (body.hits.length) {
        const out = JSON.stringify(body.hits);
        feed.write(out);
      }

      if (!body.noMoreScrollResults) {
        nextURI = body.nextScrollURI;

        _feed = feed;

        let parallelArray = [];
        for (let i = 0; i < maxParallel; i++) {
          parallelArray.push(scrollRecursive);
        }
        async.parallel(parallelArray);
      }
    }
  });
};

function scrollRecursive() {
  const options = {
    uri: nextURI,
    method: "GET",
    json: true
  };

  request(options, (error, reponse, body) => {
    if (!error) {
      if (body.hits.length) {
        const out = JSON.stringify(body.hits);
        _feed.write(out);
      }

      if (!body.noMoreScrollResults && !done) {
        return scrollRecursive();
      } else {

        /**
         * Show the time one time
         */
        if (!done) {
          console.timeEnd("scroll");
          done = true;
        }
      }
    }
  });
}
