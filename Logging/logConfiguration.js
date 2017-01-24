/**
 * Created by rob on 1/24/2017.
 */
"use strict";
const process = require('process');
const configuration = require("../config/config");
const fs = require('fs');
const path = require("path");

const logging = {
    "application": {
        "console": {
            "level": "info",
            "colorize": false
        },
        "file": {
            "timestamp": true,
            "json": false,
            "filename": "",
            "maxFiles": configuration.LOG_MAX_FILES,
            "maxsize": configuration.LOG_MAX_FILE_SIZE,
            "level": "info"
        }
    },
    "koaUse": {
        "console": {
            "level": "info",
            "colorize": true
        },
        "file": {
            "timestamp": true,
            "json": false,
            "filename": "",
            "maxFiles": configuration.LOG_MAX_FILES,
            "maxsize": configuration.LOG_MAX_FILE_SIZE,
            "level": "info"
        }
    }
};
const errorConfig = {
    "name": "error",
    "timestamp": true,
    "json": false,
    "filename": "",
    "maxFiles": configuration.LOG_MAX_FILES,
    "maxsize": configuration.LOG_MAX_FILE_SIZE,
    "level": "error"

};
module.exports.logLineFormat =function logLineFormat(logLine) {
    let lineOut = logLine || '';
    const os = require("os");
    const uuid = require("node-uuid");

    lineOut +=  " " + os.hostname();
    lineOut +=  " " + process.pid;
    lineOut +=  " " + uuid.v4();


    return lineOut;

};
module.exports.formatOptions = function formatOptions(meta){
    let spaces = 2;
    let stringify = require("json-stringify-safe");

    let additionalData = '\n\t';
    if(meta && Object.keys(meta).length) {
        additionalData += stringify(meta, null, spaces);

    }
    else{
        additionalData = meta
    }

    return additionalData;

};

function isDirSync(filePath) {

    try {
        return fs.statSync(filePath).isDirectory();
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
}

module.exports.generateLogfilename =function generateLogfilename(sufix){
    let sufixUse = sufix || '';
    let  pathUse = '';

    if(configuration.isDevelopment){
        pathUse  = path.resolve(__dirname,'../../../../logs');

        if (!isDirSync(pathUse)) {
            fs.mkdirSync(pathUse);
        }
    }
    else{
        pathUse = '/logs/ncbi';
    }

    return pathUse + "/" + configuration.APPNAME + "_" + process.pid +"_" + sufixUse +".log";



};


module.exports.config = logging;
module.exports.errorConfig = errorConfig;
