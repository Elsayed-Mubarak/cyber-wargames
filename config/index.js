const privateKeySecret = `-----BEGIN RSA PRIVATE KEY-----
MIIEoQIBAAKCAQBw52Y5i2XtifE1tr9f10RdnHOiSbb09dqlM62K6II59gzA0a4+
7K3pUdliswuFkjAN9kIeCPDAYiOaVCQ2rr706WN/jSiDndt++V20DvlU/80Pagn5
V7GQxgROEsrr4oFpnQxtKAOQFF5YoF7+Gf8wLX8bz7e19h3/5Nver7F7kqhTBn2T
kQJ2TcWZI4dxSTRyaCLU3o6Fu9bZUPWCvbfIwo64VlOX/NDfDfDkLQBM6JzUeqaF
eIsnOdwSoUBYDJEn7rM0SItkDVkDxkCc222iDozL9sSlDgPsyoysWu7OLNBroE2T
eN1+qW3cD+zQeBUpm1jYziED3rXA4RozHKIDAgMBAAECggEACt++kLxETOSEPtAj
DnAFPZ7b5D2FSYKEVHTtufs6z6pLACcxyQ2ykk43ybHE4lB6IF4fcBUcWusY0rxX
4IxkB+KSmq5VwJdrlIcf5z+p8+3PKjTkUQeJKpBnyb01nhJqtGlT0Q+RiEbt70tC
2uZWFaXMIDmZUAUsToEUTBZP2b7dVdyfAVZxp55xe4P7kDpbc4ql+TcWm7oiwOYc
HzMUbS0is2JSwnDhMPPyyOvT63rcPYhzw6YT/Lg4X7+jRSVRY93Afs9O/1eZDFfr
43UOPyGHGKP0oYKaPwo6aAWY+kufrREfwUqW4VLbY7yduiBYZpkmiHkKb1IZQxNl
IOAggQKBgQC9mVx4XvIqJp/FkSTpuvJN2uZcj4V4Ay57VRwoCu28VF8ynQXW6D8C
QS9tG6ER4wdLhlDB28PjrREVBHG8N94PtFdTvJpNhPrIqoTx7EV1NiH474Uv6PIT
cSj/gaKEdOINzhtpE7Zb28ApVt4MCfm8Zab+TQxfF+4b7E50lwdy6wKBgQCYceD7
OuOCaFWztA/ZkRxZNj7fvyPiKFJd/TIA14+Xgpnf0SIqFIBWKs0qrvht9HmAVhW5
V93gJPrSaa7oMLSRTVbz4sLFjQpvvh+N0p2wOKsbuPQgCBBuTqyGQw4IXaXamPG3
TQx6A9rM2eEHHODhaBGr632AsLQ6OpbbTA1XSQKBgAUbLT9cpz71XVYvy4Oz8jSg
kZWqk9iglU7jAugdKzvoNcwiKHcaOCAyazmQBe16ZMbm7iPabFMkZRJg1UNRadyY
acWqjalKzIo89WmiiFhYxd9za+3XYzWc1ZLUBfF1SGVAyMIysrWUnH9AhKhkWGJ3
hmDQ6GVjOplr6sz/CEdTAoGAVnL1/+KEVFawiykId/v3lIvTmfT992mgVBaavamA
j44LjsY9VpmrsbGyCYuR7GDgaivnQ+UVOOAfsSUngBrmuyOdtM6aX4c9LOMnZ7jR
nbZ1KlJ3dpa8IqHQ6o6qLYpV3KIxKR6zfZokAVlpaCwzRwBKTTFNSaZrfj3tgM0f
H6kCgYBaINI+sZsAUo0gXdIr4O562t4YOyGy46vQWBGdh3uZ8ow5nKE6p9K5xXk6
a9/QOsBlxYdydBjIggkaADTXIiQ7AxSLKGNWrpNNe+8Pv8CVDP8yn0v3FR0KdIAc
rfAcPqDS3e5CDklVD+HVPGElLU5IJvy7Gk1oOG68+GdCyJWoQQ==
-----END RSA PRIVATE KEY-----`;

const publicKeySecret = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBw52Y5i2XtifE1tr9f10Rd
nHOiSbb09dqlM62K6II59gzA0a4+7K3pUdliswuFkjAN9kIeCPDAYiOaVCQ2rr70
6WN/jSiDndt++V20DvlU/80Pagn5V7GQxgROEsrr4oFpnQxtKAOQFF5YoF7+Gf8w
LX8bz7e19h3/5Nver7F7kqhTBn2TkQJ2TcWZI4dxSTRyaCLU3o6Fu9bZUPWCvbfI
wo64VlOX/NDfDfDkLQBM6JzUeqaFeIsnOdwSoUBYDJEn7rM0SItkDVkDxkCc222i
DozL9sSlDgPsyoysWu7OLNBroE2TeN1+qW3cD+zQeBUpm1jYziED3rXA4RozHKID
AgMBAAE=
-----END PUBLIC KEY-----`;

const defaultTempTokenSecret = '40VUEA8T29nAF8Q9d4FcbgsUfxVreZ_-_=%4VRtddgdosvvv85227dds*@#ddf';


const envs = {
  production: 'production',
  development: 'development',
  staging: 'staging',
  test: 'test'
};

const currentEnv = process.env.NODE_ENV || envs.development;
const config = require(`./env/${currentEnv}.js`);


config.PRIVATEKEY = process.env.PRIVATE_KEY || privateKeySecret;
config.PUBLICKEY = process.env.PUBLIC_KEY || publicKeySecret;

config.tempTokenSecret = process.env.TEMP_TOKEN_SECRET || defaultTempTokenSecret;
config.envs = envs;
config.currentEnv = currentEnv;

// prevent public routes abuse and scanning
config.preventAbuse = true;
config.canTest = false;

// ENVIRONMENT specific
if (config.currentEnv === config.envs.development) {
  config.isEmailVerificationRequired = false;
  config.canSendEmail = false;
  config.canUseCustomErrorPages = false;
  config.canHttps = false;
  config.preventAbuse = false;
  config.canTest = true;
}
if (config.currentEnv === config.envs.test) {
  config.isEmailVerificationRequired = false;
  config.canSendEmail = true;
  config.canUseCustomErrorPages = false;
  config.canHttps = false;
  config.preventAbuse = false;
  config.canTest = true;
}



console.log(`===================== CONFIG [${currentEnv}] =====================`);

config.JWTsecret = process.env.SECRET || privateKeySecret;
config.tempTokenSecret = process.env.TEMP_TOKEN_SECRET || defaultTempTokenSecret;


module.exports = config;