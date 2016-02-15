import request from 'superagent-bluebird-promise';
import Promise from 'bluebird';
var Intercom = require('intercom-client');
var config = require('./config');
var chalk = require('chalk');
var Firebase = require('firebase');
var google = require('googleapis');
var path = require('path');
var fs = require('fs');
var Analyser = require('./Analyser');

/**
 *  @param {Mozaik} mozaik
 */
const client = function(mozaik) {

  mozaik.loadApiConfig(config);

  const intercomClient = new Intercom.Client({ 
    appId: config.get('tk.intercomAppId'), 
    appApiKey: config.get('tk.intercomToken') 
  }).usePromises();

  var keyPath = path.normalize(config.get("tk.gaPem"));
  if (keyPath.substr(0, 1) !== "/") {
    keyPath = path.join(process.cwd(), keyPath);
  }
  if (!fs.existsSync(keyPath)) {
    mozaik.logger.error("Failed to find analytics .PEM file: %s -- ignoring API", keyPath);
  }
  var analyzer = new Analyser({serviceEmail:config.get('tk.gaEmail'), serviceKey:fs.readFileSync(keyPath).toString()});


  const apiCalls = {

    getCompaniesBySegment(params) {
      mozaik.logger.info(chalk.yellow(`[intercom] calling companies for appId: ${config.get('tk.intercomAppId')} and segment: ${params.segment}`));
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
      mozaik.logger.info(chalk.yellow(`[intercom] calling invited users for appId: ${config.get('tk.intercomAppId')} and segment: ${params.segment}`));
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
        var ref = new Firebase(config.get('tk.firebaseUrl'));
        ref.authWithCustomToken(config.get('tk.firebaseSecret'), function(error, authData) {
          if (error) {
            console.log("Authentication Failed!", error);
            reject();
          } else {
            ref.child('tk_global_presence').once('value', function(snapshot) {
              var users = snapshot.val();
              var count = 0;
              if(users) {
                for(var userId in users) {
                  var userTimestamp = users[userId];
                  if(userTimestamp === true || userTimestamp > new Date().getTime() - 24 * 3600 * 1000) {
                    count ++;
                  }
                }
              }
              resolve(count);
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
              reject();
            });
          }
        });
      });
    },
    getActiveUsers(params) {
      return analyzer.getActiveUsers({
        id: params.id,
        startDate: params.startDate,
        endDate: params.endDate
      });
    },
    getNewCompanies(params) {
      return analyzer.getNewCompanies({
        id: params.id,
        startDate: params.startDate,
        endDate: params.endDate
      });
    }
  };

  return apiCalls;

};

module.exports = client;