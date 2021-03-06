// pages/IdleXq/idleList.js
const IdleHttp = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requsetList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      user: app.globalData.user
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
    wx.showLoading()
    IdleHttp.request('/mobileapi/requirement/queryMobileRequirementList', {
      creatorJfid: this.data.user.jfId
      // creatorJfid: 2346870110
    }).then(res => {
      if (res.data.responseHeader.code == 200) {
        wx.hideLoading();
        let list = res.data.data.totalCount == 0 ? [] : res.data.data.list;
        this.setData({
          requsetList: list
        })
      } else {
        wx.showToast({
          title: res.data.responseHeader.message,
          icon: 'none'
        })
      }
    })
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