
const request = require('request');
const fs = require('fs');

let done = false;
let next = undefined;
let scroll = 0;
let maxRequest = 1;
const output = "doi,id,language";


let stream = fs.createWriteStream('test.txt', { flags: 'w'});

scrollInit('https://api-v5.istex.fr/document/?q=language:rus&scroll=1m');


function scrollInit(url){

    /**
     * Request options
     * return a json in the body object
     */
    const options = {
        uri: `${url}&output=${output}`,
        json: true
    }

    request(options,(error,response,body) => {

        if(!error){

            if(body.hits.length) {
               const out = JSON.stringify(body.hits);
               stream.write(out); 
            }

            if(!body.noMoreScrollResults){
                next = body.nextScrollURI;
                scrollRecursive();
            }
        }

    });
}

function scrollRecursive(){

    let options = {
        uri: `${next}&output=${output}`,
        json: true
    }

    request(options,(error,reponse,body) => {

        if(!error){

            if(body.hits.length) {
               const out = JSON.stringify(body.hits);
               stream.write(out); 
            }

            if(!body.noMoreScrollResults){
                next = body.nextScrollURI;
                return scrollRecursive();
            }
        }
    });
}