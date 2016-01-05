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
    },
    getInvited(params) {
      mozaik.logger.info(chalk.yellow(`[intercom] calling invited users for appId: ${config.get('intercom.appId')} and segment: ${params.segment}`));
      return intercomClient.companies.listBy({segment_id: params.segmentCompanies}).then(function(res) {
        var invitedUsers = 0;
        var getAllPages= function(res) {
          for (var i=0;i<res.body.companies.length;i++) {
            if(res.body.companies[i].custom_attributes.invited_users) {
              invitedUsers = invitedUsers + res.body.companies[i].custom_attributes.invited_users;
            }
          }
          if(res.body.pages.page < res.body.pages.total_pages) {
            return intercomClient.nextPage(res.body.pages).then(function(res2) {
              return getAllPages(res2);
            });
          }
          return intercomClient.users.listBy({segment_id: params.segment}).then(function(resUsers) {
            return {
              invited:invitedUsers,
              total:resUsers.body.total_count
            }
          });
        }
        return getAllPages(res);
      });
    },
    getMessagesCount(params) {
      mozaik.logger.info(chalk.yellow(`[intercom] calling messages`));
      
    }

  };

  return apiCalls;

};

module.exports = client;