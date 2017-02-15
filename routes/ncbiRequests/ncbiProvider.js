/**
 * Created by rob on 2/9/2017.
 */
const request = require('koa-request');
const _ = require('lodash');
const assert = require('assert');
const transformToJson = require('../../services/transformToJson');
class NCBIProvider {

    constructor(options) {

       this.options = _.cloneDeep(options);

        assert(this.options.url, 'API url is required.');
        assert(this.options.method, 'API method is required.');
    }

    validateReq(options, dbName,searchTerm, ncbiApi) {


            let msg = 'Invalid arguments supplied to ' + ncbiApi;
            if (options === undefined) {

                assert(`Invalid arguments supplied to  ${ncbiApi}`);
            }
        if (dbName === undefined) {

            assert(`database name requierd for  ${ncbiApi}`);
        }

        if (searchTerm === undefined) {

            assert(`a search term requierd for  ${ncbiApi}`);
        }




    }
/*
 ESearch now provides a supported sort parameter
 EInfo, ESearch and ESummary now provide output data in JSON format

 */
    buildQuery(options, ignoreList) {
        let query = '';
        for (let prop in options) {
            if (options.hasOwnProperty(prop) && ignoreList.indexOf(prop) == -1) {
                query += '&' + prop + '=' + options[prop];
            }
        }
        return query;
    }

    /**
     * query API and return the body.
     *  @param queryBody
     * Function
     *  Required queryBody Parameter term
     Entrez text query. All special characters must be URL encoded. Spaces may be replaced by '+' signs.
     For very long queries (more than several hundred characters long),
     consider using an HTTP POST call. See the PubMed or Entrez help for
     information about search field descriptions and tags. Search fields and tags are database specific.
     Provides the number of records retrieved in all Entrez databases by a single text query.
     */
    *query(queryBody) {


        let  options = _.cloneDeep(this.options);
        options.url = `${options.url}egquery.fcgi?term=${queryBody.term}`;


         let response = yield request(options);
         let jsonResponce = yield transformToJson(response.body);

        return jsonResponce;
    }

/*
 •
 Provides a list of the names of all valid Entrez databases
 •
 Provides statistics for a single database, including lists of indexing fields and available link names
 */

    *einfo(queryBody) {


        let  options = _.cloneDeep(this.options);
        options.url = `${options.url}einfo.fcgi?retmode=json&version=2.0&db=${queryBody.term}`;


        let response = yield request(options);

        return response.body;
    }
    /*
     •
     Provides a list of UIDs matching a text query
     •
     Posts the results of a search on the History server
     •
     Downloads all UIDs from a dataset stored on the History server
     •
     Combines or limits UID datasets stored on the History server
     •
     Sorts sets of UIDs
     */

    *esearch(queryBody) {


        let  options = _.cloneDeep(this.options);
        options.url=`${options.url}esearch.fcgi?retmode=json&usehistory=y&term=${queryBody.term}&db=${queryBody.db}`;
        let response = yield request(options);
        //todo fix responce so that is only retruns the result
        return response.body;
    }

/*
 •
 Returns document summaries (DocSums) for a list of input UIDs
 •
 Returns DocSums for a set of UIDs stored on the Entrez History server
 */
    *esummary(queryBody) {


        let  options = _.cloneDeep(this.options);
        options.url=`${options.url}esummary.fcgi?retmode=json&usehistory=y&id=${queryBody.id}&db=${queryBody.db}`;


        let response = yield request(options);

        return response.body;
    }
/*
 •
 Returns formatted data records for a list of input UIDs
 •
 Returns formatted data records for a set of UIDs stored on the Entrez History server
 */
    *efetch(queryBody) {


        let  options = _.cloneDeep(this.options);
        options.url=`${options.url}efetch.fcgi?retmode=xml&usehistory=y&id=${queryBody.id}&db=${queryBody.db}`;

        let response = yield request(options);


        let jsonResponce = yield transformToJson(response.body);

        return jsonResponce;
    }
/*
 •
 Returns UIDs linked to an input set of UIDs in either the same or a different Entrez database
 •
 Returns UIDs linked to other UIDs in the same Entrez database that match an Entrez query
 •
 Checks for the existence of Entrez links for a set of UIDs within the same database
 •
 Lists the available links for a UID
 •
 Lists LinkOut URLs and attributes for a set of UIDs
 •
 Lists hyperlinks to primary LinkOut providers for a set of UIDs
 •
 Creates hyperlinks to the primary LinkOut provider for a single UID
 */
    *elink(queryBody) {


        let  options = _.cloneDeep(this.options);
        options.url=`${options.url}elink.fcgi?retmode=xml&usehistory=y&id=${queryBody.id}&db=${queryBody.db}&dbfrom=${queryBody.dbfrom}`;
        let response = yield request(options);


        let jsonResponce = yield transformToJson(response.body);


        return jsonResponce;
    }
/*
 Retrieves PubMed IDs (PMIDs) that correspond to a set of input citation strings.
 */
    *ecitmatch(queryBody) {

        let  options = _.cloneDeep(this.options);
        options.url=`${options.url}ecitmatch.cgi?&db=${queryBody.db}&retmode=xml&bdata=${queryBody.bdata}`;
        let response = yield request(options);
        // this api is not returning proper xml
        return response.body;
    }
/*
 Provides spelling suggestions for terms within a single text query in a given database.
 */
    *espell(queryBody) {


        let  options = _.cloneDeep(this.options);
        options.url=`${options.url}espell.fcgi?retmode=xml&usehistory=y&term=${queryBody.term}&db=${queryBody.db}`;

        let response = yield request(options);

        let jsonResponce = yield transformToJson(response.body);

        return jsonResponce;
    }
}



module.exports = NCBIProvider;
