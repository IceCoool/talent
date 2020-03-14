// components/staff-filter/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    cityName: {
      type: String,
      value: ''
    },
    cityCode: {
      type: String,
      value: ''
    },
    serUrl: {
      type: String,
      value: ''
    },
    hasRequest: {
      type: Boolean,
      value: true
    },
    queryType: {
      type: Number,
      value: 1
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
    changeQuery(event) {
      let type = event.currentTarget.dataset.type;
      if (type != this.data.queryType) {
        this.triggerEvent('changeQuery', type)
      }
    },
    tapEvent(event) {
      let url = event.currentTarget.dataset.url;
      this.triggerEvent('isLogin', {
        url: url
      })
    }
  }
})