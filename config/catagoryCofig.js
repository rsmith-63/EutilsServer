/**
 * Created by rob on 3/1/2017.
 */
const categorySet = [{
    "category": 'Literature', 'dbList': ['books', 'mesh', 'nlmcatalog',
        'pubmed', 'pmc']
}, {
    "category": 'Genes', 'dbList': ['nucest', 'gds', 'geoprofiles',
        'homologene', 'popset', 'unigene']
}, {
    "category": 'Health', 'dbList': ['clinvar', 'gap', 'gtr',
        'medgen', 'omim', 'pubmedhealth']
}, {
    "category": 'Proteins', 'dbList': ['cdd', 'protein', 'proteinclusters',
        'structure']
}, {
    "category": 'Genomes', 'dbList': ['assembly', 'bioproject', 'biosample',
        'clone', 'dbvar', 'genome', 'nucgss', 'nuccore', 'probe', 'snp', 'sra', 'taxonomy']
},
    {
        "category": 'Chemicals', 'dbList': ['BioSystems', 'pcassay', 'biosample',
        'pccompound', 'pcsubstance']
    }
];

module.exports = categorySet;