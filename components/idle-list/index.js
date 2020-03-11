// components/idle-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    resumeList: {
      type: Object,
      value: []
    }
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
    tapEvent(event) {
      let url = event.currentTarget.dataset.url;
      this.triggerEvent('isLogin', {
        url: url
      })
    }
  }
})