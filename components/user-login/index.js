// components/login/index.js
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
    getUserInfo(e) {
      this.setData({
        showLogin: false
      })
      if (e.detail.errMsg.indexOf('fail') != -1) {
        wx.showToast({
          title: '授权失败',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '授权成功',
          icon: 'none'
        })
      }
    }
  }
})