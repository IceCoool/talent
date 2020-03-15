// pages/MyIdle/idleEdit.js
const IdleHttp = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selId: [],
    show: false
    // requestList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      user: app.globalData.user
    })
    wx.showLoading()
    IdleHttp.request('/mobileapi/requirement/queryMobileRequirementList', {
      // creatorJfid: this.data.user.jfId
      creatorJfid: 2346870110
    }).then(res => {
      if (res.data.responseHeader.code == 200) {
        wx.hideLoading()
        this.setData({
          requsetList: res.data.data.list
        })
      } else {
        wx.showToast({
          title: res.data.responseHeader.message,
          icon: 'none'
        })
      }
    })
  },
  selRequest(event) {
    let selId = this.data.selId
    let id = event.currentTarget.dataset.id;
    if (selId.findIndex(item => item == id) == -1) {
      selId.push(id)
    } else {
      selId.splice(selId.findIndex(item => item == id), 1);
    }
    this.setData({
      selId
    })
  },
  clear() {
    this.setData({
      selId: []
    })
  },
  remove() {
    wx.showLoading()
    IdleHttp.request('/mobileapi/requirement/deleteRequirement', {
      ids: this.data.selId.join(',')
    }).then(res => {
      if (res.data.responseHeader.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        this.setData({
          show: false
        })
        this.onLoad()
      } else {
        wx.showToast({
          title: res.data.responseHeader.message,
          icon: 'none'
        })
      }
    })
  },
  closeDialog() {
    this.setData({
      show: false
    })
  },
  showDialog() {
    if (this.data.selId.length == 0) {
      wx.showToast({
        title: '请选择您想删除的需求',
        icon: 'none'
      })
      return;
    }
    this.setData({
      show: true
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