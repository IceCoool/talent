const user = require('user.js')
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

var refreshingToken = false
var queueWaitingForToken = []

const setRefreshingToken = (isRefreshing) => {
  refreshingToken = isRefreshing
  if (!isRefreshing) {
    queueWaitingForToken.forEach(item => {
      let {
        url,
        data,
        success,
        fail,
        responseType
      } = item
      post(url, data, success, fail, responseType)
    })
  }
  queueWaitingForToken = []
}

const isRefreshingToken = () => {
  return refreshingToken
}

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
 * 通用的get方法，
 * 传入的数据会是querystring，返回json数据
 */
const getJson = (url, data, success, fail) => {
  if (data != '' && data != undefined) {
    data = {
      data: JSON.stringify(data)
    }
  }
  data = genSign(data || {})
  // console.log(data)
  wx.request({
    url: fullUrl(url),
    data: data,
    header: {
      'cookie': 'jfterminal=weixin_xcx_card;',
      'Authorization': user.getToken().token
    },
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
 * post json，目前好像后台接口没有采用这种方式的，此处先有备无患吧
 * 传输到后台的数据会被json序列化
 */
const postJson = (url, data, success, fail) => {
  if (data != '' && data != undefined) {
    data = {
      data: JSON.stringify(data)
    }
  }
  data = genSign(data || {})
  // console.log(data)
  wx.request({
    url: fullUrl(url),
    header: {
      'cookie': 'jfterminal=weixin_xcx_card',
      'content-type': 'application/json',
      'Authorization': user.getToken().token
    },
    method: 'POST',
    data: data,
    success: function(res) {
      if (success) {
        success(res.data);
      }
    },
    fail: function(res) {
      fail(res);
    }
  });
}

/**
 * 仅添加签名功能
 * @param params
 * @returns {Promise<unknown>}
 */
const request = params => {
  return new Promise((resolve, reject) => {
    let data = params.data !== undefined ? genSign({
      data: JSON.stringify(params.data)
    }) : genSign({});
    // console.log(data)
    let task = wx.request({
      url: fullUrl(params.url),
      header: Object.assign({
        'cookie': 'jfterminal=weixin_xcx_card',
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': user.getToken().token
      }, params.header),
      method: params.method || 'POST',
      data,
      success: function(res) {
        res._data = res.data.data;
        resolve(res);
      },
      fail: function(res) {
        reject(res)
      }
    });
    params.task.abort = task.abort.bind(task);
  });
}

/**
 * upload File, 支持单个或多文件上传
 * 但是因为微信接口限制只能上传一个，因此利用promise.all实现同步
 * 如果成功，则success中是一个结果数组，如果失败，fail中是最先reject失败状态的值
 * formData: 可能是一个{}对象或者数组。一个时所有文件共享，数组时，一对一按顺序对应
 */
const uploadFiles = (url, filePaths, name, formData = '', success, fail) => {
  var isFromDataArray = false;
  if (formData != '' && formData != undefined) {
    if (util.isArray(formData)) {
      isFromDataArray = true
      formData = formData.map((item) => {
        return genSign(item)
      })
    } else {
      formData = genSign(formData)
    }
  } else {
    formData = genSign({})
  }

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
        formData: isFromDataArray ? formData[index] : formData,
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

/**
 * upload File, 单文件上传，返回uploadTask，主要用于大文件上传进度指示或者取消
 */
const uploadFileWithTask = (url, filePath, name, formData = '', success, fail) => {
  if (formData != '') {
    formData = genSign({
      data: JSON.stringify(formData)
    })
  } else {
    formData = genSign({})
  }
  url = fullUrl(url)

  return wx.uploadFile({
    url: url,
    header: {
      'cookie': 'jfterminal=weixin_xcx_card',
      'Authorization': user.getToken().token
    },
    filePath: filePath,
    name: name,
    formData: formData,
    success: function(res) {
      success && success(JSON.parse(res.data));
    },
    fail: function(err) {
      fail && fail(err)
    }
  })
}

const downloadFile = (url, filePath, success, fail) => {
  wx.downloadFile({
    url: fullUrl(url),
    header: {
      'cookie': 'jfterminal=weixin_xcx_card',
      'Authorization': user.getToken().token
    },
    filePath: filePath,
    success: function(res) {
      console.log(res)

      if (res.statusCode == 200) {
        success && success(res)
      } else {
        fail && fail()
      }
    },
    fail: function(res) {

      console.log(res)
      fail && fail(res)
    },
  })
}

module.exports = {
  getJson: getJson,
  post: post,
  uploadFiles: uploadFiles,
  uploadFileWithTask,

  postJson: postJson,
  fullUrl: fullUrl,

  request,
  downloadFile,
  setRefreshingToken,
  isRefreshingToken,
}