// const user = require('user.js')
const util = require('utils.js')
import md5 from 'md5'

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


// 判断是否完整的url：规则为是否以http(s)://开始
const isFullUrl = (url) => {
  if (url.indexOf("https://") == 0 || url.indexOf("http://") == 0) {
    return true
  }
  return false
}

const fullUrl = (uri) => {
  return isFullUrl(uri) ? uri : baseUrl + uri
}

/**
 * 服务器接口调用的签名加密算法
 */
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
  params['version'] = '1.0'

  var paramsArray = [];
  for (var key in params) {
    paramsArray.push(key + '=' + params[key]);
  }

  paramsArray.sort();
  var orderedString = paramsArray.join('&');

  params['sign'] = md5(orderedString + signAppSecret)
  //console.log('sign:' + params['sign'])

  return params;
}



/**
 * post, form格式, 后台接口实现多采用这种post方式
 * 传输到后台的数据会采用转为querystring：（key=value&key=value）
 */
const post = (url, data, success, fail, responseType) => {

  // if (data != '' && data != undefined) {
  //   data = { data: JSON.stringify(data) }
  // }
  data = genSign(data || {})
  // console.log('gensign:' + data)
  wx.request({
    url: fullUrl(url),
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    data: data,
    // responseType: responseType || 'text',
    success: function(res) {
      if (success) {
        success(res.data);
      }
    },
    fail: function(res) {
      if (fail) {
        fail(res);
      }
    }
  });
}


/**
 * upload File, 支持单个或多文件上传
 * 但是因为微信接口限制只能上传一个，因此利用promise.all实现同步
 * 如果成功，则success中是一个结果数组，如果失败，fail中是最先reject失败状态的值
 * formData: 可能是一个{}对象或者数组。一个时所有文件共享，数组时，一对一按顺序对应
 */
const uploadFiles = (url, filePaths, name, formData = '', success, fail) => {
  formData = genSign(formData)
  console.log(formData)
  // 处理多URL情况
  var isUrlArray = false
  if (util.isArray(url)) {
    isUrlArray = true
    url = url.map((item) => {
      return fullUrl(item)
    })
  } else {
    url = fullUrl(url)
  }
  var promise = Promise.all(filePaths.map((filePath, index) => {
    return new Promise(function(resolve, reject) {
      wx.uploadFile({
        url: isUrlArray ? url[index] : url,
        header: {

        },
        filePath: filePath,
        name: name,
        formData: formData,
        success: function(res) {
          resolve(JSON.parse(res.data));
        },
        fail: function(err) {
          // 为了保证不影响成功上传的其他文件，走resolve
          resolve({
            responseHeader: {
              code: '',
              message: '文件上传失败',
              index: index // 记录失败的是第几个
            }
          });
        }
      });
    });
  }));
  return promise.then(function(results) {
    if (success) {
      success(results)
    }
    return results;
  }).catch(function(err) {
    if (fail) {
      fail(err)
    }
    throw err;
  });
}

module.exports = {
  post: post,
  uploadFiles: uploadFiles,
  fullUrl: fullUrl
}