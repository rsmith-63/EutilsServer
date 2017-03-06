/**
 * Created by rob on 1/24/2017.
 */
"use strict";

const router = require('koa-router')(),
    fs = require("fs"),
    path = require("path"),
    _ = require("lodash"),
    request = require('koa-request'),
    config = require('./../config/config'),
    ncbiProvider = require('./ncbiRequests/ncbiProvider'),
    url = require('url');

//Set up router
//Set up requests
let requestOptions = config.requestOptions;


//Add routes to handle our API requests so far, using fake data
router.get("/api/pubMed", function *(ctx){
    this.body = { test:"test only"};
    this.type = "application/json";

});

router.get("/api/dblist", function *(ctx){
   //https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?retmode=json&

    let options = {
        method: 'GET',
        url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?retmode=json&',
        headers: {
            headers: { 'User-Agent': 'request' }
        }

    };


     let response = yield request(options);
     let res = JSON.parse(response.body);
    this.body = res.einforesult.dblist.sort();
    this.type = "application/json";

});
/*
 Provides the number of records retrieved in all Entrez databases by a single text query.
 */
router.get("/api/query", function *(ctx){
    //https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?retmode=json&

    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.query(queryBody);

    this.body = result;
    this.type = "application/json";

});
router.get("/api/summary", function *(ctx){
    //https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?retmode=json&

    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.summary(queryBody);

    this.body = result;
    this.type = "application/json";

});

/*
 Required Parameters
 db
 Database to search. Value must be a valid Entrez database name (default = pubmed).
 term
 Entrez text query. All special characters must be URL encoded. Spaces may be replaced by '+' signs. For very long queries (more than several hundred characters long), consider using an HTTP POST call. See the PubMed or
 Entrez help for information about search field descriptions and tags.
 Search fields and tags are database specific.
 */
router.get("/api/test/esearch", function *(ctx){
    //https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?retmode=json&

    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.esearch(queryBody);

    this.body = result;
    this.type = "application/json";

});

/*
 Required Parameter
 db
 Database from which to retrieve DocSums. The value must be a valid Entrez database name (default = pubmed).
 The E-utilities In-Depth: Parameters, Syntax and More 47
 Required Parameter – Used only when input is from a UID list
 id
 UID list. Either a single UID or a comma-delimited list of UIDs may be provided. All of the UIDs must be from the database specified by db. There is no set maximum for the number of UIDs that can be passed to ESummary, but if more than about 200 UIDs are to be provided, the request should be made using the HTTP POST method.
 esummary.fcgi?db=protein&id=15718680,157427902,119703751
 Required Parameters – Used only when input is from the Entrez History server
 query_key
 Query key. This integer specifies which of the UID lists attached to the given Web Environment
 will be used as input to ESummary. Query keys are obtained from the output of previous ESearch, EPost or ELink calls.
 The query_key parameter must be used in conjunction with WebEnv.
 WebEnv
 Web Environment. This parameter specifies the Web Environment that
 contains the UID list to be provided as input to ESummary. Usually this WebEnv value is obtained from the
  output of a previous ESearch, EPost or ELink call. The WebEnv parameter must be used in conjunction with query_key.
 esummary.fcgi?db=protein&query_key=<key>&WebEnv=<webenv string>
 */
router.get("/api/test/esummary", function *(ctx){

    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.esummary(queryBody);

    this.body = result;
    this.type = "application/json";

});

/*
 Required Parameters
 db
 Database from which to retrieve records. The value must be a valid Entrez database name (default = pubmed). Currently EFetch does not support all Entrez databases. Please see Table 1 in Chapter 2 for a list of available databases.
 Required Parameter – Used only when input is from a UID list
 id
 UID list. Either a single UID or a comma-delimited list of UIDs may be provided. All of the UIDs must be from the database specified by db. There is no set maximum for the number of UIDs that can be passed to EFetch,
 but if more than about 200 UIDs are to be provided,
  the request should be made using the HTTP POST method.
 */
router.get("/api/test/efetch", function *(ctx){
    //https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?retmode=json&

    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.efetch(queryBody);

    this.body = result;
    this.type = "application/json";

});
router.get("/api/test/einfo", function *(ctx){
    //https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?retmode=json&

    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.einfo(queryBody);

    this.body = result;
    this.type = "application/json";

});
/*
 Required Parameters
 db
 Database from which to retrieve UIDs. The value must be a valid Entrez database name (default = pubmed).
  This is the destination database for the link operation.
 dbfrom
 Database containing the input UIDs. The value must be a valid Entrez database name (default = pubmed).
 This is the origin database of the link operation. If db and dbfrom are set to the same database value,
 then ELink will return computational neighbors within that database. Please see the full list of Entrez links
 for available computational neighbors. Computational neighbors have linknames that begin with dbname_dbname
 (examples: protein_protein, pcassay_pcassay_activityneighbor).
 cmd
 ELink command mode. The command mode specified which function ELink will perform.
  Some optional parameters only function for certain values of &cmd (see below).cmd=neighbor (default)
 ELink returns a set of UIDs in db linked to the input UIDs in dbfrom.Example:
 Link from protein to
 genehttps://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&db=gene&id=15718680,157427902
 */


router.get("/api/test/elink", function *(ctx){
    //https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?retmode=json&

    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.elink(queryBody);

    this.body = result;
    this.type = "application/json";

});

/*
 Required Parameters
 db
 Database to search. Value must be a valid Entrez database name (default = pubmed).
 term
 Entrez text query. All special characters must be URL encoded. Spaces may be replaced by '+' signs. For very long queries
 (more than several hundred characters long), consider using
 an HTTP POST call. See the PubMed or Entrez help for information about search field
  descriptions and tags. Search fields and tags are database specific.
 */
router.get("/api/test/espell", function *(ctx){


    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.espell(queryBody);

    this.body = result;
    this.type = "application/json";

});

/*
 Required Parameters
 db
 Database to search. The only supported value is ‘pubmed’.
 rettype
 Retrieval type. The only supported value is ‘xml’.
 bdata
 Citation strings. Each input citation must be represented by a citation string in the following format:
 journal_title|year|volume|first_page|author_name|your_key|
 Multiple citation strings may be provided by separating the strings with a carriage return character (%0D).
 The your_key value is an arbitrary label provided by the user that may serve as a local identifier for the citation,
 and it will be included in the output. Be aware that all spaces must be replaced by ‘+’
 symbols and that citation strings should end with a final vertical bar ‘|’.
 */

router.get("/api/test/ecitmatch", function *(ctx){

    // this api is not returning proper xml

    let ncbiReq = new ncbiProvider(requestOptions);
    let queryString = url.parse(this.url,true);
    let queryBody = queryString.query;
    let result =  yield ncbiReq.ecitmatch(queryBody);

    this.body = result;
    this.type = "application/xml";

});


module.exports = router;
