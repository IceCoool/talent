// pages/demo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interviewAddr: '',
    cityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getCity(e) {
    let keyword = e.detail.value;
    let _this = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/assistant/inputtips',
      data: {
        key: '603c6fa808c6283a7aaff2ba2650ee10',
        keywords: keyword
      },
      success(res) {
        _this.setData({
          cityList: res.data.tips
        })
      }
    })
  },
  getTapName(e) {
    let addrName = e.currentTarget.dataset.addr;
    this.setData({
      interviewAddr: addrName,
      cityList: []
    })
  },
  goBack() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      interviewAddr: this.data.interviewAddr
    })
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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