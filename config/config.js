
/*
 Default configuration parameters. These can and should be overridden using config files and environment variables. See:
 https://www.npmjs.com/package/rc
 */

"use strict";

const rc = require("rc")
    , path = require("path")
    , env = process.env.NODE_ENV || "development"
    , appName = "EutilsServer"
    , _ = require("lodash")
    , NcbiConfiguration = require("./ncbi/ncbi-mappings")[env].NcbiAPI
    ;


//Configs are selected using the value of the NODE_ENV variable, i.e. NODE_ENV="development" loads the development configuration, etc.
const configs = {
    //Development configuration.
    "development": {
        PORT: 3000,				//port to run the server on
        HOST: "localhost:3000",
        OAUTH_KEY: "key",		//Set these in a configuration file in production.
        OAUTH_SECRET: "secret",
        LOG_MAX_FILE_SIZE: 20971520, // 20 Meg
        LOG_MAX_FILES: 50, // 50 x 20MB = about 1 GB maximum for logs
        LOG_TO_FILE: false,
        NCBI: {
            USE_NCBI_API: true
        },
        SECURITY: {
            JWT_SECRET: "abracadabra"
        }
    },


};

let config;

//Set up configuration
if(config = configs[env]) {

    //Copy out this property, because we're about to replace the whole object
    let useNcbiAPI = _.get(config, "NCBI.USE_NCBI_API", false);
    config.NCBI = _.cloneDeep(NcbiConfiguration);

    //Copy the property back
    config.NCBI.USE_NCBI_API = useNcbiAPI;

    //Apply the rc module to the selected configuration, allowing parameters to be overridden with environment variables.
    config = rc(appName, config);

    //This creates a bunch of properties on config for isProduction, isDevelopment, etc.
    Object.keys(configs).forEach(function(configKey){	//development, sandbox, production, etc...
        config["is" + configKey.charAt(0).toUpperCase() + configKey.slice(1)] = env === configKey;
        //e.g. config.isProduction, config.isDevelopment, etc.
    });



    //Export appName for logging and whatnot
    config.APPNAME = appName;


    //JWT stuff
    config.JWT_QUERY_PARAM = "_j";	//The query parameter to use to store the JWT packet when it is sent to the client. This also tells the client where to look for it.
    config.SECURITY = config.SECURITY || {};




} else {
    throw new Error("No config specified for "+env);
}


module.exports = config;
