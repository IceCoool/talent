// pages/enterprise/enterpriseList.js
const app = getApp();
const IdleHttp = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList().then(list => {
      let promise = Promise.all(list.map((item, index) => {
        return new Promise((resolve, reject) => {
          IdleHttp.request('/mobileapi/bu/getBuAuth', {
            buid: item.buId
          }).then(res => {
            res = res.data;
            if (res.responseHeader.code == 200) {
              list[index].auth = res.data.status;
              resolve()
            }
          })
        })
      }));
      promise.then(() => {
        wx.hideLoading();
        this.setData({
          list
        })
      })
    });
  },
  goEnterprise(event) {
    let buid = event.currentTarget.dataset.buid;
    wx.navigateTo({
      url: `/pages/enterprise/authenticate?buid=${buid}&type=bu`,
    })
  },
  getList() {
    wx.showLoading();
    let _this = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            IdleHttp.request('/mobileapi/user/getSessionKeyByCode', {
              code: res.code
            }).then(result => {
              if (result.data.responseHeader.code == 200) {
                let resData = result.data.data;
                app.globalData.user = resData.user;
                wx.setStorageSync('user', JSON.stringify(resData.user))
                if (resData.user.buList && resData.user.buList.length == 0) {
                  wx.hideLoading()
                  wx.redirectTo({
                    url: '/pages/enterprise/search'
                  })
                } else {
                  let list = resData.user.buList;
                  resolve(list)
                }
              }
            })
          }
        }
      })
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
    this.onLoad()
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