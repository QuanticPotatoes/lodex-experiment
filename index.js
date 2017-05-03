const ezs = require("ezs");
const from = require("from");
const fs = require("fs");

ezs.use(require("./ezsLocal"));

const url = ["https://api.istex.fr/document/?q=language:gle"];

let test;

from(url)
    .pipe(ezs("scroll"))
    .pipe(ezs((data,feed) => { console.log(data); feed.end();}));