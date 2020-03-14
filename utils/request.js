let md5 = require('./md5.js');
const ENV = require('./env.js');
const {
  baseUrl,
  signAppKey,
  signAppSecret
} = ENV;

// let signAppSecret = '';
// let signAppKey = 'jfidlewechat';
// let baseUrl = 'https://apiidle.jfh.com';

// __wxConfig.envVersion == 'release' ? signAppSecret = 'prod-br677r5bja4t5eyfu1s8tp25sp9izexl' : signAppSecret = 'it5z9oizcwkazqah1b5dos8iwerynj9x';

// __wxConfig.envVersion == 'develop' ? baseUrl = 'https://apiidledev.jfh.com' : baseUrl = 'https://apiidle.jfh.com';

const genSign = (params) => {
  if (params == null) {
    return params;
  }
  if (!params.hasOwnProperty('timestamp')) {
    params['timestamp'] = new Date().getTime();
  }
  if (!params.hasOwnProperty('clientType')) {
    params['clientType'] = 6;
  }
  params['appKey'] = signAppKey;
  params['version'] = '1.0';
  var paramsArray = [];
  for (var key in params) {
    paramsArray.push(key + '=' + params[key]);
  }
  paramsArray.sort();
  var orderedString = paramsArray.join('&');
  params['sign'] = md5(orderedString + signAppSecret)
  // console.log('sign:' + params['sign'])
  return params;
}

const request = (url, options) => {
  options = genSign(options);
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: options,
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    })
  })
}




module.exports = {
  request
}