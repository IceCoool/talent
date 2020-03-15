const IdleHttp = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobList: [],
    selJob: {
      cnname: '',
      itemCode: ''
    },
    searchList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    IdleHttp.request('/mobileapi/dictionary/topic', {
      topic: 'WT_HR'
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
  onChange(event) {
    let cnname = event.currentTarget.dataset.name;
    let code = event.currentTarget.dataset.code;
    this.setData({
      'selJob.cnname': cnname,
      'selJob.itemCode': code
    });
    let selJob = this.data.selJob;
    if (selJob.cnname == '') {
      wx.navigateBack()
      return;
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let postList = prevPage.data.postList;
    let isInclude = postList.find((item, index) => {
      if (item.itemCode == selJob.itemCode) {
        return true;
      } else {
        return false
      }
    })
    if (!isInclude) {
      postList.push(selJob);
    }
    prevPage.setData({
      postList,
      postType: selJob.itemCode
    });
    wx.navigateBack()
  },
  goBack() {
    wx.navigateBack()
  },
  searchJob(event) {
    let keyword = event.detail.value;
    this.setData({
      keyword
    });
    if (this.data.keyword == '') {
      this.setData({
        searchList: []
      })
      return;
    }
    IdleHttp.request('/mobileapi/dictionary/list', {
      cnname: this.data.keyword,
      level: 3,
      topic: 'WT_HR'
    }).then(res => {
      if (res.data.responseHeader.code == 200) {
        this.setData({
          searchList: res.data.data.list
        })
      }
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