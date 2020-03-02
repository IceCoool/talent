var amapFile = require('./libs/amap-wx.js');
App({
  onLaunch: function() {

  },
  // 全局数据
  globalData: {
    // 用户是否授权地理位置
    locaAuthorize: false
  },
  // 判断用户是否授权登录
  loginAuthorize() {
    let _this = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          _this.setData({
            showLogin: true
          })
        } else {
          console.log('用户已授权')
        }
      }
    })
  },
  // 用户地理位置授权
  locaAuthorize() {
    let _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          // 已授权 调用地理位置API
          _this.getLocation()
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
                      _this.getLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none'
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none'
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //初次进入 调用地理位置API
          _this.getLocation()
        }
      }
    })
  },
  // 获取地理位置
  getLocation() {
    let _this = this;
    wx.getLocation({
      type: "gcj02",
      success(res) {
        // 授权成功  获取地理位置
        let latitude = res.latitude;
        let longitude = res.longitude;
        console.log(`纬度${latitude}---经度${longitude}`)
        _this.getCityName(`${longitude},${latitude}`)
      },
      fail(res) {
        if (res.errMsg.indexOf('auth deny') != -1) {
          // 拒绝授权
          wx.showToast({
            title: '拒绝授权',
            icon: 'none'
          })
        } else if (res.errMsg.indexOf('system permission') != -1) {
          // 用户授权，但手机定位服务没开启
          wx.showModal({
            title: '提示',
            content: '请在系统设置中打开定位服务',
            showCancel: false,
            success: result => {

            }
          })
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          })
        }
      }
    })
  },

  // 逆地理编码
  getCityName(lonlat) {
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: '603c6fa808c6283a7aaff2ba2650ee10',
        output: 'json',
        location: lonlat,
        extensions: 'base'
      },
      success(res) {
        console.log(res)
      }
    })

    // let _this = this;
    // let myAmapFun = new amapFile.AMapWX({
    //   key: 'cf7f9a6bc988083166ac2d4e06d3bac4'
    // });
    // myAmapFun.getRegeo({
    //   success: function(data) {
    //     //成功回调
    //     console.log(data)
    //     wx.showToast({
    //       title: '成功'
    //     })
    //   },
    //   fail: function(info) {
    //     //失败回调
    //     console.log(info)
    //     wx.showToast({
    //       title: '失败'
    //     })
    //   }
    // })
  }
})