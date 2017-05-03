const request = require("request");
const url = require("url");

let nextURI = undefined;
let json;

/**
 * scroll use the scrolling features of API istex
 * data: url
 */
exports.scroll = function(data, feed) {
  //console.time("scroll");

  const output = this.getParam("output", "language,doi,id");
  json = this.getParam("json", true);
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
    json
  };

  request(options, (error, reponse, body) => {
    if (!error) {
      if (body.hits.length) {
        let out = JSON.stringify(body);

        feed.write(body);
      }

      if (!body.noMoreScrollResults) {
        nextURI = body.nextScrollURI;

        scrollRecursive(feed);
      }
    } else {
      console.error("options:", options);
      console.error("error", error);
      console.error("response",
        reponse.statusCode,
        reponse.statusMessage,
        reponse.headers
      );
    }
  });
};

/**
 * Get the nextURI in the API and call himself until body have noMoreScrollResults : true
 * 
 */
function scrollRecursive(feed) {
  const options = {
    uri: nextURI,
    method: "GET",
    json
  };

  request(options, (error, reponse, body) => {
    if (!error) {
      let out = JSON.stringify(body);
      if (!body.noMoreScrollResults) {
        scrollRecursive(feed);
        return feed.write(body);
      }
    } else {
      console.error("options:", options);
      console.error("error", error);
      console.error(
        "response",
        reponse.statusCode,
        reponse.statusMessage,
        reponse.headers
      );
    }
  });
}
