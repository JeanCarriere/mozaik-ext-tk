var convict = require('convict');

var config = convict({
    tk: {
        intercomAppId: {
            doc:    'the intercom app id ',
            default: '',
            format:  String,
            env:     'INTERCOM_APP_ID'
        },
        intercomToken: {
            doc:    'The intercom API token.',
            default: '',
            format:  String,
            env:     'INTERCOM_API_TOKEN'
        }
    }
});

module.exports = config;