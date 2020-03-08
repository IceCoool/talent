/**
 * 用户登录信息以及相关其他信息的维护
 */

var userToken = ''
const keyToken = 'user-token' // 目前没有维护登录验证，所以未用到。

const keyJfId = "jfid"
// 擦，这数据模型设计真是无语了，一个用户有两种id标识：jfid、userid，
const keyUserId = 'userid'
const keyBuId = "buid"
const keyBuName = 'buName'

const keyNickName = 'nickName'
const keyAvatarUrl = 'avatarUrl'
const keyMobile = "mobile"

const keyIsManager = 'isMananger' // 是否管理员

const keyOpenId = 'openid'
const keyAppletCode = 'appletCode' // 用于绑定jf账户使用的参数

/**
 * 设置usertoken
 * 背景：usertoken用于验证用户信息当登录、注册成功后，接口会通过responseheader的[Set-Cookie]将用户信息带到小程序前端。
 * 调用该接口存储后，可以用于http接口请求时的cookie，以供服务器验证用户信息使用；
 * 同时，依据是否有此值，用来判断是否用户已绑定，可以避免频繁登录；当用户退出登录时需要清除该值
 */

// 登录，该接口在登录后者注册成功回调时使用，以供后面使用
const setToken = (data) => {
  if (!data) return

  data.expires = Date.now() + data.expires * 1000
  data.token = 'Bearer ' + data.token
  wx.setStorageSync(keyToken, data) // 缓存
  userToken = data // 存到变量，便于访问性能
}

// 外度调用查询token
const getToken = () => {
  if (userToken == '') {
    userToken = wx.getStorageSync(keyToken) || {token: '', expires: 0}// 此处赋值，避免频繁访问存储系统
  }
  return userToken
}

// 检测token是否存在、过期：时间1小时应该足够：1小时之内只要用户有切换前后台操作，就可以触发再次token刷新检测了。
const checkToken = () => {
  var token = getToken()
  if (!token || token.expires < Date.now() + 3600000) {
    return false
  }
  return true
}

// 退出
const logout = () => {
  // 只保留openid
  const keys = [keyToken, keyJfId, keyUserId, keyAppletCode, keyAvatarUrl, keyBuId,
  keyBuName, keyIsManager, keyNickName, keyMobile]

  keys.forEach(key => {
    wx.removeStorageSync(key)
  })


  userToken = ''
}

// 是否登录: 依据token或者jfid，待定
const isLogin = () => {
  return getJfId() != "" && getUserId() != ""
}

// 设置buid： 企业id
const setBuId = (data) => {
  wx.setStorageSync(keyBuId, data)
}
const getBuId = () => {
  return wx.getStorageSync(keyBuId) || ""
}
// 设置buName： 企业名字
const setBuName = (data) => {
  wx.setStorageSync(keyBuName, data)
}
const getBuName = () => {
  return wx.getStorageSync(keyBuName) || ""
}

// 设置jfid：个人账号jfid
const setJfId = (data) => {
  wx.setStorageSync(keyJfId, data)
}
const getJfId = () => {
  return wx.getStorageSync(keyJfId) || ""
}

// 设置userid：个人账号userid
const setUserId = (data) => {
  wx.setStorageSync(keyUserId, data)
}
const getUserId = () => {
  return wx.getStorageSync(keyUserId) || ""
}

// 设置openid：微信openid
const setOpenId = (data) => {
  wx.setStorageSync(keyOpenId, data)
}
const getOpenId = () => {
  return wx.getStorageSync(keyOpenId) || ""
}

// 设置mobile
const setMobile = (data) => {
  wx.setStorageSync(keyMobile, data)
}
const getMobile = () => {
  return wx.getStorageSync(keyMobile) || ""
}

// 设置用户nickname
const setNickName = (data) => {
  wx.setStorageSync(keyNickName, data)
}

const getNickName = () => {
  var name = wx.getStorageSync(keyNickName) || ''
  if (name == '' ) {
    const userInfo = getApp().globalData.userInfo
    if (userInfo) name = userInfo.nickName
  }
  return name
}

const setAvatarUrl = (data) => {
  // 头像地址固定，为了促使刷新, 真是操蛋的设计啊
  if (data && data != '') {
    data += data.indexOf('?') >= 0 ? '&' : '?'
    data += ('random=' + Math.ceil(Math.random() * 10))
  }
  wx.setStorageSync(keyAvatarUrl, data)
}

// 头像地址固定，为了刷新，保存时增加了random参数,
// 当取出来时，使用random参数指定是否带random
const getAvatarUrl = (random = true) => {
  var url = wx.getStorageSync(keyAvatarUrl) || ''
  if (url != '') {
    if (!random) {
      const idx = url.indexOf('random')
      if (idx > 0) {
        url = url.substr(0, idx-1)
      }
    }
  }else{
    const userInfo = getApp().globalData.userInfo
    if (userInfo) url = userInfo.avatarUrl
  }
  return url
}

// 是否管理员
const setManager = (data) => {
  wx.setStorageSync(keyIsManager, data)
}
const isManager = () => {
  return wx.getStorageSync(keyIsManager) || false
}
const parseUserRoles = (roles) => {
  var role = 0
  roles.forEach((item) => {
    if (item.roleId != 3) role |= item.roleId
  })
  setManager(role & 1 == 1 ? true : false)
}

const setAppletCode = (data) => {
  wx.setStorageSync(keyAppletCode, data)
}
const getAppletCode = () => {
  return wx.getStorageSync(keyAppletCode) || ''
}

const parseJFUserInfo = (userInfo) => {
  setJfId(userInfo.jfId)
  setUserId(userInfo.userId)
  setMobile(userInfo.mobile || '')
  setBuId(userInfo.buid || '')
  if (userInfo.buid) { // 奇葩数据处理：竟然有没有id却有name的情况。。。接口真是服了
    setBuName(userInfo.buName || '')
  }
  setNickName(userInfo.fullName || userInfo.nickName || '')
  setAvatarUrl(userInfo.photoUrl)
}

/**
 * 向当前上下文注入_data对象
 * @param ctx
 * @param data
 * @param config
 * @returns {*}
 */
const initData = (ctx, data, config={}) => {
  let _parentPage = null
  ctx._data = {
    get isLogin(){
      return isLogin();
    },
    get isManager(){
      return isManager();
    },
    get uname(){
      return getNickName()
    },
    get uid(){
      return getJfId();
    },
    get ueid(){
      return getBuId();
    },
    get phone(){
      return getMobile();
    },
    get openid(){
      return getOpenId();
    },
    get parentPage(){
      if(_parentPage){
        return _parentPage
      }else{
        let pages = getCurrentPages();
        return pages.length > 1 ? pages[pages.length -2] : null;
      };
    },
    ...data
  }
}

module.exports = {
  setToken: setToken,
  getToken: getToken,
  checkToken,
  logout: logout,
  isLogin: isLogin,
  setBuId: setBuId,
  getBuId: getBuId,
  setBuName: setBuName,
  getBuName: getBuName,
  setJfId: setJfId,
  getJfId: getJfId,
  setOpenId: setOpenId,
  getOpenId: getOpenId,
  setAppletCode,
  getAppletCode,
  getMobile: getMobile,
  getNickName,
  setNickName,
  getAvatarUrl,
  setAvatarUrl,
  setManager: setManager,
  isManager: isManager,
  initData,
  parseJFUserInfo,
  getUserId,
  setUserId,
  parseUserRoles,
}