// page/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffFilterTop: Number,
    showFxq: false,
    showMyXq: false,
    staffFilter: {
      showSort: false,
      showAddr: false,
      showFil: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.createSelectorQuery().select('#staff-filter').boundingClientRect().exec((res) => {
      this.setData({
        staffFilterTop: res[0].top
      })
    })
  },
  // 页面滚动事件
  onPageScroll: function(e) {
    const staffFilterTop = this.data.staffFilterTop
    if (e.scrollTop >= staffFilterTop - 68) {
      this.setData({
        showFxq: true
      })
    } else {
      this.setData({
        showFxq: false
      })
    }

    // if (e.scrollTop >= staffFilterTop - 104) {
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