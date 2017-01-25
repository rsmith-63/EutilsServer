/**
 * Created by rob on 1/24/2017.
 */
"use strict";

const router = require('koa-router')(),
    fs = require("fs"),
    path = require("path"),
    _ = require("lodash");
//Set up router



//Add routes to handle our API requests so far, using fake data
router.get("/api/pubMed", function *(ctx){
    this.body = { test:"test only"};
    this.type = "application/json";

});



module.exports = router;
