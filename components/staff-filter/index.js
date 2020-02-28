// components/staff-filter/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    staffFilter: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showSort: false,
    sortValue: '1'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      this.setData({
        sortValue: event.detail
      });
      console.log(this.data.sortValue)
    }
  }
})