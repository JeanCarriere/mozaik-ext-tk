var convict = require('convict');

var config = convict({
    intercom: {
        appId: {
            doc:    'the intercom app id ',
            default: '',
            format:  String,
            env:     'INTERCOM_APP_ID'
        },
        token: {
            doc:    'The intercom API token.',
            default: '',
            format:  String,
            env:     'INTERCOM_API_TOKEN'
        }
    }
});

module.exports = config;