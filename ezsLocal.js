const request = require("request");
const url = require("url");
const jsonld = require("jsonld");

let nextURI = undefined;
let json;
let v = 0;
exports.istexQueryToNquads = function(data, feed) {
  if (this.isLast) {
    feed.end();
  }

  const graph = this.getParam("graph", "test");
  const context = {
    doi: "http://purl.org/ontology/bibo/doi"
    //"language":"http://purl.org/dc/elements/1.1/langue",
  };

  /**
   * Transform "id" to "@id"
   */
  let hits = data.hits;

  hits.map(e => {
    e.doi = e.doi[0];
  });

  let hitsString = JSON.stringify(hits).replace(/\"id\":/g, '"@id":');

  const doc = { 
  "@context": { 
    "doi": "http://purl.org/ontology/bibo/doi",
    "schema": "http://schema.org/"
   },
  "@id" : "hello",
  "@graph": [
    {
      "@id": "http://json-ld.org/playground/coucou",
      "doi": "doitest"
    }
  ]
};

  //console.log(doc);

  jsonld.toRDF(doc, { format: "application/nquads" }, (err, nquads) => {
    if (err) {
      //feed.send(null);
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
  //console.time("scroll");

  const output = this.getParam("output", "doi");
  const sid = this.getParam("sid", "lodex");
  json = this.getParam("json", true);
  const query = url.parse(data);

  const urlObj = {
    protocol: "https:",
    /** Remove when api turn to v5 */
    hostname: "api-v5.istex.fr",
    pathname: "document",
    search: `${query.search}&scroll=30s&output=${output}&sid=${sid}`
  };

  const options = {
    uri: url.format(urlObj),
    method: "GET",
    json
  };

  request(options, (error, reponse, body) => {
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
        feed.write(body);
        return scrollRecursive(feed);
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

      feed.end();
    }
  });
}
