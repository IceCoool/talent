const ENV = 'development';
// const ENV = 'production';

const conf = {
  development: {
    baseUrl: 'https://apiidledev.jfh.com',
    signAppKey: 'jfidlewechat',
    signAppSecret: 'it5z9oizcwkazqah1b5dos8iwerynj9x'
  },
  production: {
    baseUrl: 'https://apiidle.jfh.com',
    signAppKey: 'jfidlewechat',
    signAppSecret: 'prod-br677r5bja4t5eyfu1s8tp25sp9izexl'
  },
}

const {
  baseUrl,
  signAppKey,
  signAppSecret
} = conf[ENV];

module.exports = conf[ENV]