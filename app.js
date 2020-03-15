const util = require('./utils/utils.js')
const IdleHttp = require('./utils/request.js');
App({
  onLaunch: function() {

  },
  // 全局数据
  globalData: {
    // 用户是否授权地理位置
    isLocaAuthorize: false,
    longitude: '',
    latitude: '',
    isLoginAuthorize: false,
    cityName: '北京市'
  },
  getUser() {
    let _this = this;
    return new Promise((resolve, reject) => {
      let userInfo = wx.getStorageSync('user')
      if (!userInfo) {
        wx.login({
          success(res) {
            if (res.code) {
              IdleHttp.request('/mobileapi/user/getSessionKeyByCode', {
                code: res.code
              }).then(result => {
                if (result.data.responseHeader.code == 200) {
                  let resData = result.data.data;
                  if (resData.user) {
                    _this.globalData.isLoginAuthorize = true;
                    _this.globalData.openid = resData.openid;
                    _this.globalData.appletCode = resData.appletCode;
                    _this.globalData.user = resData.user;
                    wx.setStorageSync('user', JSON.stringify(resData.user))
                    resolve();
                  } else {
                    _this.globalData.openid = resData.openid;
                    _this.globalData.appletCode = resData.appletCode;
                    resolve();
                  }
                }
              })
            }
          }
        })
      } else {
        _this.globalData.user = JSON.parse(userInfo);
        _this.globalData.isLoginAuthorize = true;
        resolve();
      }
    })
  },
  // 判断用户是否授权登录
  loginAuthorize(_this, url) {
    // _this 为当前页面的this
    if (this.globalData.isLoginAuthorize) {
      wx.navigateTo({
        url: url
      })
    } else {
      _this.setData({
        showLogin: true
      })
    }
  },
  showError(title) {
    wx.showToast({
      title: title || '不好意思，系统开小差了，请稍后再试',
      icon: 'none'
    })
  },
  // promise 解决异步问题
  promiseLocaAuthorize() {
    var pro = new Promise((resolve, reject) => {
      this.locaAuthorize(resolve, reject);
    })
    return pro;
  },
  // 用户地理位置授权
  locaAuthorize(resolve, reject) {
    let _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          // 已授权 调用地理位置API
          _this.getLocation(resolve)
        } else if (res.authSetting['scope.userLocation'] == false) {
          // 已拒绝授权 引导用户去授权
          wx.showModal({
            title: '提示',
            content: '小程序需要获取您的地理位置，请确认授权',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(settingRes) {
                    if (settingRes.authSetting['scope.userLocation']) {
                      //引导授权成功 调用地理位置API
                      _this.getLocation(resolve)
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none'
                      })
                      reject()
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none'
                })
                reject()
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //初次进入 调用地理位置API
          _this.getLocation(resolve, reject)
        }
      }
    })
  },
  // 获取地理位置
  getLocation(resolve, reject) {
    let _this = this;
    wx.getLocation({
      type: "gcj02",
      success(res) {
        // 授权成功  获取地理位置
        let latitude = res.latitude;
        let longitude = res.longitude;
        _this.globalData.latitude = res.latitude;
        _this.globalData.longitude = res.longitude;
        _this.globalData.isLocaAuthorize = true;
        _this.getCityName(`${longitude},${latitude}`, resolve)
      },
      fail(res) {
        if (res.errMsg.indexOf('auth deny') != -1) {
          // 拒绝授权
          wx.showToast({
            title: '拒绝授权',
            icon: 'none'
          })
          reject()
        } else if (res.errMsg.indexOf('system permission') != -1) {
          // 用户授权，但手机定位服务没开启
          wx.showModal({
            title: '提示',
            content: '请在系统设置中打开定位服务',
            showCancel: false,
            success: result => {

            }
          })
          reject()
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          })
          reject()
        }
      }
    })
  },
  // 逆地理编码
  getCityName(lonlat, resolve) {
    let _this = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: '603c6fa808c6283a7aaff2ba2650ee10',
        output: 'json',
        location: lonlat,
        extensions: 'base'
      },
      success(res) {
        let addressInfo = res.data.regeocode.addressComponent;
        let municipality = "北京市上海市重庆市天津市";
        if (municipality.indexOf(addressInfo.province) != -1) {
          _this.globalData.cityName = addressInfo.province
        } else {
          _this.globalData.cityName = addressInfo.city
        }
        resolve()
      }
    })
  }
})