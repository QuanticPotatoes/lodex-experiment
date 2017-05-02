const request = require("request");
const url = require("url");

let nextURI = undefined;

/**
 * scroll use the scrolling features of API istex
 * data: url
 */
exports.scroll = function(data, feed) {
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
        scrollRecursive(feed);
      }
    }
  });
};

function scrollRecursive(feed) {
  const options = {
    uri: nextURI,
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
        return scrollRecursive(feed);
      }
    }
  });
}
