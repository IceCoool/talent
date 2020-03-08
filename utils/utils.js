Date.prototype.Formate = function (format) {
  var o = {
    "M+": this.getMonth() + 1,  //month
    "d+": this.getDate(),     //day
    "h+": this.getHours(),    //hour
    "m+": this.getMinutes(),  //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
    "S": this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}
/**
 * 格式化时间，支持年月日时分秒
 */
const formatTime = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('0' + str).substr(-2));
    }
  }
  return fmt;
}

/**
 * 解析时间为描述字符串
 *
 * 5分钟内的时间显示：刚刚
 * 5〜60分钟的时间显示：xx分钟前
 * 1〜24小时（不包括昨天的时间）的时间显示：xx小时前
 * 昨天的时间显示：昨天19: 36
 * 昨天之前的时间显示：月-日时间例如：04-28 19: 36
 * 去年及以前的时间显示：年-月-日时间例如：2017-12-2219: 36
 */
const getTimeParser = function () {
  const now = Date.now();
  // 昨天 包括ytdStart，不包括ytdEnd
  const ytdEnd = new Date(now); ytdEnd.setHours(0, 0, 0, 0);
  const ytdStart = new Date(ytdEnd); ytdStart.setDate(ytdStart.getDate() - 1);
  const lyEnd = new Date(now); lyEnd.setMonth(0, 1); lyEnd.setHours(0, 0, 0, 0);
  // const lyStart = new Date(lyEnd);   lyStart.setFullYear(lyStart.getFullYear() - 1);

  const parse = dateStr => {
    const date = new Date(dateStr);
    // console.log('timeParser:', dateStr, date);
    const target = date.getTime();
    const diff = (now - target) / 60000; // 分钟
    if (diff <= 5) {
      return '刚刚'
    } else if (diff <= 60) {
      return `${Math.floor(diff)}分钟前`;
    } else if (diff <= 60 * 24) {
      if (target > ytdEnd)
        return `${Math.floor(diff / 60)}小时前`
      else
        return `昨天 ${formatTime(date, 'hh:mm')}`
    } else if (target >= ytdStart) {
      return `昨天 ${formatTime(date, 'hh:mm')}`
    } else if (target > lyEnd) {
      return formatTime(date, 'MM-dd hh:mm');
    } else {
      return formatTime(date, 'yyyy-MM-dd hh:mm');
    }
  }
  return { parse };
};

/**
 *  格式化金额：千分位显示, 无单位
 */
const formatMoney = (val) => {
  val = parseFloat(val)
  var num = (val || 0).toString(), result = '';
  var index = num.indexOf('.');
  var dot = index < 0 ? '' : num.substring(num.indexOf('.'))
  num = num.substring(0, num.indexOf('.')) || num
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  result += dot
  return result;
}

/**
 * 简化数字显示， k w为单位， 按照指定精度， 默认为0
 */
const simplifyNumber = (val, precision) => {
  precision = precision || 0
  val = parseFloat(val)
  if (val >= 10000) return (val / 10000.0).toFixed(precision) + "w"
  if (val >= 1000) return (val / 1000.0).toFixed(precision) + 'k'
  return val
}

/**
 * 格式化时长: 传入单位 s，返回为分：秒格式
 */
const fmtDuration = (val) => {
  val = Math.floor(val)
  var m = Math.floor(val / 60)
  var s = val % 60
  return (('0' + m).substr(-2)) + ":" + (('0' + s).substr(-2))
}

/**
 * 格式化验证：包括手机号、邮箱、url
 */
const validationReg = {
  num: "^\\d*$",
  float: "^([+-]?)\\d*\\.\\d+$",
  email: "^([a-zA-Z0-9]+[-|\\-|_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|\\-|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]",
  url: "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",
  mobile86: "(^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\\d{8}$)",
  mobile852: "(^[1-9]\\d{7}$)",
  mobile886: "(^[0][9]\\d{8}$)",
  mobile853: "(^[6]([8|6])\\d{5}$)",
  formatCheck: function (a, e) { return new RegExp(validationReg[a]).test(e) },
  checkMobile: function (a) { return validationReg.formatCheck("mobile86", a) },
  checkEmail: function (a) { return validationReg.formatCheck("email", a) },
  checkUrl: function (a) { return validationReg.formatCheck('url', a) },
  checkMobileHK: function (a) { return validationReg.formatCheck("mobile852", a) },
  checkMobileMO: function (a) { return validationReg.formatCheck("mobile853", a) },
  checkMobileTW: function (a) { return validationReg.formatCheck("mobile886", a) },
  checkMobileAll: function (a) {
    return validationReg.formatCheck("mobile86", a) || validationReg.formatCheck("mobile852", a) || validationReg.formatCheck("mobile853", a) || validationReg.formatCheck("mobile886", a)
  }
}

// 判断是否是数组
const isArray = (value) => {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === "[object Array]";
  }
}

const getData = (data, paths) => {
  paths = [].concat(paths);
  return paths.map(path => path.replace(/(\[(.*)\])/g, (...args) => '.' + args[2]).split('.'))
    .flat()
    .reduce((acc, item) => acc[item], data);
}

/**
 * data 数据持久化
 * @param ctx    # 页面上下文
 * @param paths  # 要持久化的属性路径
 * @returns {{load: load, save: save}}
 * @constructor
 */
const DataStore = (ctx, paths) => {
  let key = `PD_${ctx.is}`;
  let load = (preHandler = (() => { }), afterHandler = (() => { })) => {
    let data = wx.getStorageSync(key);
    let pathMap = {}
    if (data) {
      data.forEach(([path, data]) => {
        pathMap[path] = data;
      })
      preHandler(pathMap);
      ctx.setData(pathMap, afterHandler)
    }
  }
  let save = () => {
    let data = paths.map(path => [path, getData(ctx.data, path)])
    wx.setStorageSync(key, data)
  }
  return { load, save }
}

const qs = data => '?' + Object.keys(data).map(k => `${k}=${data[k]}`).join('&');
const navTo = params => {
  if (params.query) {
    params.url += qs(params.query)
  }
  wx.navigateTo(params)
}

// 比较微信版本
const compareWechatVersion = (v1, v2) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/*
 * fileSize格式化
 * size: 整数， 单位Byte
 */
const fmtFileSize = (size) => {
  var div = 1024 * 1024, unit = 'M'
  if (size < div) {
    div = 1024
    unit = 'K'
  }
  if (size < div) {
    div = 1
    unit = 'B'
    return size + unit
  }
  return (size / div).toFixed(1) + unit
}

const throttle = (fn, gap = 0, wait = 0) => {
  let timeStamp = 0, timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (gap && Date.now() - timeStamp > gap) {
      fn(...args);
      timeStamp = Date.now();
    } else if (wait) {
      timer = setTimeout(() => {
        fn(...args);
        timeStamp = Date.now();
      }, wait);
      timeStamp = Date.now();
    }
  }
}

const checkAuthSetting = function (scope, reason) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        // 用户拒绝过
        if (res.authSetting[scope] === false) {
          wx.showModal({
            title: '提示',
            content: reason,
            cancelText: '拒绝',
            confirmText: '允许',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting[scope]) {
                      resolve()
                    } else {
                      reject()
                    }
                  },
                  fail(err) {
                    reject()
                  }
                })
              } else {
                reject()
              }
            }
          })
        } else if (!res.authSetting[scope]) { // 第一次申请授权
          wx.authorize({
            scope: scope,
            success: () => {
              resolve();
            },
            fail(err) {
              reject()
            }
          })
        } else {
          resolve();
        }
      }
    })
  });
}

module.exports = {
  formatTime: formatTime, // 格式化时间
  formatMoney: formatMoney, // 千分位格式化金额
  checkMobile: validationReg.checkMobile, // 验证手机号
  checkEmail: validationReg.checkEmail, // 验证邮箱
  checkUrl: validationReg.checkUrl, // 验证url
  checkMobileHK: validationReg.checkMobileHK,
  checkMobileMO: validationReg.checkMobileMO, //澳门手机号
  checkMobileTW: validationReg.checkMobileTW,
  checkMobileAll: validationReg.checkMobileAll, // 港澳台大陆
  simplifyNumber: simplifyNumber,
  fmtDuration: fmtDuration,
  DataStore,
  getData,
  qs,
  isArray,
  getTimeParser,
  navTo,
  compareWechatVersion,
  fmtFileSize,
  throttle,
  checkAuthSetting
}
