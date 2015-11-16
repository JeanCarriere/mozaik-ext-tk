var Intercom = require('intercom-client');
var config = require('./config');

/**
 *  @param {Mozaik} mozaik
 */
const client = function(mozaik) {

  mozaik.loadApiConfig(config);

  const intercomClient = new Intercom.Client({ 
    appId: config.get('intercom.appId'), 
    appApiKey: config.get('intercom.token') 
  }).usePromises();

  const apiCalls = {

    getCompanies() {
      console.log('Test');
      return intercomClient.companies.list().then(res => res.body);
    }

  };

  return apiCalls;

};

module.exports = client;