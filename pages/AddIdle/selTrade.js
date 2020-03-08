const IdleHttp = require('../../utils/request.js');
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
  onChange(event) {
    let selTrade = this.data.selTrade;
    let tradeCode = this.data.tradeCode;
    let itemCode = event.currentTarget.dataset.code;
    let cnname = event.currentTarget.dataset.name;
    if (selTrade.findIndex(item => item.itemCode == itemCode) == -1) {
      if (tradeCode.length >= 3) {
        wx.showToast({
          title: '最多选择3个',
          icon: 'none'
        })
        return;
      }
      selTrade.push({
        cnname,
        itemCode
      })
      tradeCode.push(itemCode)
    } else {
      selTrade.splice(selTrade.findIndex(item => item.itemCode == itemCode), 1);
      tradeCode.splice(tradeCode.findIndex(item => item == itemCode), 1)
    }
    this.setData({
      selTrade,
      tradeCode
    })
  },
  clearCode() {
    this.setData({
      selTrade: [],
      tradeCode: []
    })
  },
  goBack() {
    let selTrade = this.data.selTrade;
    let tradeCode = this.data.tradeCode;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let tradeList = prevPage.data.tradeList;
    tradeList = tradeList.concat(selTrade);
    var hash = {};
    tradeList = tradeList.reduce(function(arr, current) {
      hash[current.cnname] ? '' : hash[current.cnname] = true && arr.push(current);
      return arr
    }, [])
    prevPage.setData({
      tradeList,
      selTrade,
      tradeCode: tradeCode
    });
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