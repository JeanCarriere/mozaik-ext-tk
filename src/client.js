import request from 'superagent-bluebird-promise';
import Promise from 'bluebird';
var Intercom = require('intercom-client');
var config = require('./config');
var chalk = require('chalk');
var Firebase = require('firebase');

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
      let req = request.get('https://signup.talkspirit.com/internal/api/v1/analytics?size=10000');
      return req.promise().then(function(res) {
          var messages = 0;
          var connectors = 0;
          for(var i = 0; i < res.body.data.length; i++) {
            var vendor = res.body.data[i];
            messages = messages + vendor.message_count;
            connectors = connectors + vendor.connector_count;
          }
          return {
            messages: messages,
            connectors: connectors
          };
      });
    },
    getOnlineUsers(params) {
      mozaik.logger.info(chalk.yellow(`[intercom] calling firebase online users`));
      return new Promise(function (resolve, reject) {
        var ref = new Firebase(config.get('firebase.url'));
        ref.authWithCustomToken(config.get('firebase.secret'), function(error, authData) {
          if (error) {
            console.log("Authentication Failed!", error);
            reject();
          } else {
            ref.child('tk_global_presence').once('value', function(snapshot) {
              resolve(snapshot.numChildren());
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
              reject();
            });
          }
        });
      });
    }
  };

  return apiCalls;

};

module.exports = client;