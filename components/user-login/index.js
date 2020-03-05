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
    getPhoneNumber(e) {
      this.setData({
        showLogin: false
      })
      console.log(e)
    }
  }
})