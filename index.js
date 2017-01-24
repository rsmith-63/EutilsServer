/**
 * Created by rob on 1/24/2017.
 */
const configuration = require("./config/config")
    , log = require("winston")
    , path = require("path")
    , koa = require('koa')
    , staticPath = path.join(__dirname, "..", "client")
    , serve = require("koa-static")
    , port = process.env.PORT || configuration.PORT
    , fs = require("fs")
    , compress = require('koa-compress')
    , router = require("./routes/router.js")
    , bodyParser = require('koa-bodyparser')
    , session = require('koa-generic-session')
    , mount = require('koa-mount')
    , convert = require('koa-convert')
    , logger = require("koa-logger")
    ,pug = require("pug")
    ;

log.debug("Configuration", configuration);

var app = new koa();


//Centralized Error handler
function *errorHandler (next){
    try {
        yield next;
    } catch(err){
        this.status = err.status || 500;
        err.message = err.message || "Unknown Error";

        if(!this.state.xhr) {
            this.type = 'text/html';
            let jadeText = yield fs.readFileAsync(path.join(templatePath, 'error.pug'));
            this.body = pug.render(jadeText, { serverErr: err.message });
        } else {
            this.body = err.message;
        }

        log.error(err);
        this.app.emit('error', err, this)
    }
}


//Trust proxy
app.proxy = true;

//Session key
app.keys = ["secret secret 111"];

app.use(function *(next){
    if(this.request.url === "/api/status"){
        this.status = 200;
    } else {
        return yield next;
    }
});



//If not in production, configure the logger
if(!configuration.isProduction){
    app.use(logger());
}

app
    .use(errorHandler)		//error handler goes at the top. It catches errors from all the middleware below it.
    .use(compress())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(staticPath));



app.listen(port, err => {
    if(err){
        log.error(err);
    } else {
        log.info("Main server listening on port %s", port);
    }
});
