const request = require("request");
const url = require("url");
const jsonld = require("jsonld");
const debug = require("debug")("ezsLocal");

let nextURI = undefined;
let json;
let v = 0;

exports.request = request;

exports.convertIstexQuery = function(data, feed) {
  if (this.isLast) {
    feed.end();
  }

  const graph = this.getParam("graph", "http://json-ld.org/playground/graph");
  let hits = data.hits;

  const context = {
    doi: "http://purl.org/ontology/bibo/doi"
    //"language":"http://purl.org/dc/elements/1.1/langue",
  };

  /**
   * Transform "id" to "@id"
   */
  hits.map(e => {
    e.doi = e.doi[0];
    e.id = "https://api-v5.fr/document/" + e.id;
  });

  let hitsString = JSON.stringify(hits).replace(/\"id\":/g, "\"@id\":");

  //console.log(data.hits);
  const doc = {
    "@context": {
      doi: "http://purl.org/ontology/bibo/doi",
      //language: "http://purl.org/ontology/dc/language",
      schema: "http://schema.org/"
    },
    "@id": graph,
    "@graph":  JSON.parse(hitsString)
  };

  jsonld.toRDF(doc, { format: "application/nquads" }, (err, nquads) => {
    if (err) {
      feed.end();
      console.error("toRDF: ", err);
    }
    console.log(nquads);
    feed.write(nquads);
  });
};

/**
 * scroll use the scrolling features of API istex
 * data: url
 */
exports.scroll = function(data, feed) {

  if(this.isLast()) {
    return feed.close();
  }

  const output = this.getParam("output", "doi");
  const sid = this.getParam("sid", "lodex");
  json = this.getParam("json", true);
  const query = url.parse(data);

  const urlObj = {
    protocol: "https:",
    /** Remove when api turn to v5 */
    hostname: "api-v5.istex.fr",
    pathname: "document",
    search: `${query.search}&scroll=30s&output=${output}&size=100&sid=${sid}`
  };

  const options = {
    uri: url.format(urlObj),
    json
  };

  request.get(options, (error, reponse, body) => {
    if (!error) {
      feed.write(body);

      if (!body.noMoreScrollResults) {
        nextURI = body.nextScrollURI;

        scrollRecursive(feed);
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
};

/**
 * Get the nextURI in the API and call himself until body have noMoreScrollResults : true
 *
 */
// function scrollRecursive(feed) {
//   const options = {
//     uri: nextURI,
//     json
//   };

//   request.get(options, (error, reponse, body) => {
//     if (!error) {
//       let out = JSON.stringify(body);
//       if (!body.noMoreScrollResults) {
//         feed.write(body);
//         return scrollRecursive(feed);
//       }
//     } else {
//       console.error("options:", options);
//       console.error("error", error);
//       console.error(
//         "response",
//         reponse.statusCode,
//         reponse.statusMessage,
//         reponse.headers
//       );

//       feed.end();
//     }
//   });
// }


function scrollRecursive(feed) {
  const options = {
    uri: nextURI,
    method: 'GET',
    json,
  };

  request.get(options, (error, response, body) => {
    if (error) {
      /* eslint-disable */
      console.error('options:', options);
      console.error('error', error);
      console.error(
        'response',
        response && response.statusCode,
        response && response.statusMessage,
        response && response.headers
      );
      /* eslint-enable */
      return feed.end();
    }
    if (body && body.hits && body.hits.length === 0) {
      return feed.end();
    }
    feed.write(body);
    if (body.noMoreScrollResults) {
      return feed.end();
    }
    return scrollRecursive(feed);
  });
}
