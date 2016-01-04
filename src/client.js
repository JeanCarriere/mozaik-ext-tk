var Intercom = require('intercom-client');
var config = require('./config');
var chalk = require('chalk');

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

    getUsersBySegment(params) {
      mozaik.logger.info(chalk.yellow(`[intercom] calling users for appId: ${config.get('intercom.appId')} and segment: ${params.segment}`));
      return intercomClient.users.listBy({segment_id: params.segment}).then(res => res.body);
    },

    getCompaniesBySegment(params) {
      mozaik.logger.info(chalk.yellow(`[intercom] calling companies for appId: ${config.get('intercom.appId')} and segment: ${params.segment}`));
      return intercomClient.companies.list().then(function(resTot) {
        return intercomClient.companies.listBy({segment_id: params.segment, per_page: 50}).then(function(res) {
          mozaik.logger.info(chalk.yellow(`restTot : ${resTot.body.total_count} ${res.body.total_count}`));
          return {
            segment:res.body,
            total:resTot.body
          }
        });
      });
    }

  };

  return apiCalls;

};

module.exports = client;