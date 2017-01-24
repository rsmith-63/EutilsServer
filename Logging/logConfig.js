/**
 * Created by rob on 1/24/2017.
 */
/**
 * Created by rob_smith on 9/30/16.
 */
"use strict";
const P = require("bluebird")
    ,WinstonConfig= P.promisifyAll(require('winston-config'))
    ,winston = require('winston')
    ,configuration = require("../../../config/default")
    ,loggingConfig = require('./LogConfiguration');


let config = loggingConfig.config;
let errorConfig = loggingConfig.errorConfig;
let useFile = configuration.LOG_TO_FILE;
if(useFile) {
    try {
        config.application.file.filename = loggingConfig.generateLogfilename("app");

        config.koaUse.file.filename = loggingConfig.generateLogfilename("koa");
        errorConfig.filename = loggingConfig.generateLogfilename("error");
    }
    catch(e) {
        defaultToConsole();
    }
}
else{
    defaultToConsole()
}

function defaultToConsole(){
    delete  config.application.file;
    delete  config.koaUse.file;
    useFile = false;
}
function createLoggers() {
    return WinstonConfig.fromJsonAsync(config).then(function (winstonLoggers) {
        let loggers = {};
        let appLogger = winstonLoggers.loggers.get('application');
        if(useFile){
            appLogger.add(winston.transports.File, errorConfig);
        }

        appLogger.filters.push(function (level, msg, meta) {
            return loggingConfig.logLineFormat(msg, meta);
        });
        appLogger.rewriters.push(function (level, msg, meta) {
            return loggingConfig.formatOptions(meta);
        });
        let kLogger = winstonLoggers.loggers.get('koaUse');
        loggers.appLogger = appLogger;
        loggers.KoaLogger = kLogger;
        return loggers;

    });

}
module.exports.createLoggers = createLoggers;


