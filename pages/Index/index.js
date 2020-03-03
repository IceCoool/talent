// page/index/index.js
const app = getApp();
const IdleHttp = require('../../utils/request.js')

IdleHttp.request('/api', {
  data: {
    ab: 'c',
    dd: 'e'
  }
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idleFilterTop: Number,
    showFxq: false,
    showMyXq: false,
    showLogin: false,
    textOption: {
      locaCity: '',
      sort: '排序',
      filter: '筛选'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 提示用户 授权地理位置
    app.promiseLocaAuthorize().then(() => {
      this.setData({
        'textOption.locaCity': app.globalData.locaCity
      })
    }).catch(() => {
      this.setData({
        'textOption.locaCity': app.globalData.locaCity
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.createSelectorQuery().select('#staff-filter').boundingClientRect().exec((res) => {
      this.setData({
        idleFilterTop: res[0].top
      })
    })
  },
  // 页面滚动事件
  onPageScroll: function(e) {
    const idleFilterTop = this.data.idleFilterTop
    if (e.scrollTop >= idleFilterTop - 150) {
      this.setData({
        showFxq: true
      })
    } else {
      this.setData({
        showFxq: false
      })
    }


    // if (e.scrollTop >= idleFilterTop - 190) {
    //   this.setData({
    //     showMyXq: true
    //   })
    // } else {
    //   this.setData({
    //     showMyXq: false
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})