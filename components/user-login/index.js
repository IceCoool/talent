// components/login/index.js
const app = getApp();
const IdleHttp = require('../../utils/request.js');
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    showLogin: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.setData({
        showLogin: false
      });
    },
    getPhoneNumber(e) {
      this.setData({
        showLogin: false
      })
      if (e.detail.errMsg.indexOf('ok') != -1) {
        IdleHttp.request('/mobileapi/user/getUserByMobile', {
          appletCode: app.globalData.appletCode,
          openid: app.globalData.openid,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }).then(res => {
          if (res.data.responseHeader.code == 200) {
            wx.showToast({
              title: '注册成功',
              icon: 'none'
            })
            app.globalData.user = res.data.data.user;
            app.globalData.isLoginAuthorize = true;
            this.triggerEvent('reload')
          } else {
            wx.showToast({
              title: res.data.responseHeader.message,
              icon: 'none'
            })
          }
        })
      }
    }
  }
})