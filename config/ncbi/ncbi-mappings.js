/**
 * Created by rob on 1/24/2017.
 */
const mappings = {
    "development": {

        'NcbiAPI': {
            defaultConfiguration: 'ncbi',
            NCBI_DOMAIN: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',

        },
        'RequestOptions':{
            method: 'GET',
            url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
            headers: {
                headers: { 'User-Agent': 'request' }
            }


        }
    },

};

module.exports = mappings;