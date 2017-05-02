const ezs = require("ezs");
const from = require("from");
const fs = require("fs");

ezs.use(require("./ezsLocal"));

const url = ["https://api.istex.fr/document/?q=language:rus"];

from(url)
    .pipe(ezs("scroll"),{output: 'doi'})
    .pipe(fs.createWriteStream("output.txt"));
