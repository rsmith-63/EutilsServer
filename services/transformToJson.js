/**
 * Created by rob on 2/9/2017.
 */
var parseString = require('xml2js').parseString;

function *toJsonFromXML(xmlString){
    "use strict";
   let jsonResp =  yield parseXmlToJson(xmlString);
   return jsonResp;
}


function parseXmlToJson(xmlString) {

        return new Promise(function(resolve, reject) {
            parseString(xmlString, {explicitArray:false}, function(err, result) {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
}

module.exports = toJsonFromXML;