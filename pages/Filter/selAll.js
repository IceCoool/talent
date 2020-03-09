// pages/Filter/selAll.js
// 
const IdleHttp = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobList: [],
    selTrade: [],
    tradeCode: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    IdleHttp.request('/mobileapi/dictionary/topic', {
      topic: 'INDUSTRY_EXPERIENCE'
    }).then(res => {
      wx.hideLoading()
      if (res.data.responseHeader.code == 200) {
        let resData = res.data.data.list[0].list;
        this.setData({
          jobList: resData
        })
      }
    })
  },
  selTradeFn(event) {
    let tradeCode = this.data.tradeCode;
    let itemCode = event.currentTarget.dataset.code;
    if (tradeCode.indexOf(itemCode) == -1) {
      tradeCode.push(itemCode)
    } else {
      tradeCode.splice(tradeCode.findIndex(item => item == itemCode), 1)
    }
    this.setData({
      tradeCode
    })
  },
  clearCode(event) {
    
    this.setData({
      tradeCode: []
    })
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