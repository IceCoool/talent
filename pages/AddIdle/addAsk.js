// pages/AddIdle/addAsk.js
const IdleHttp = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [{
      cnname: 'Java工程师',
      itemCode: 'skill5514'
    }, {
      cnname: '前端开发',
      itemCode: 'skill5549'
    }, {
      cnname: 'UI设计师',
      itemCode: 'skill5516'
    }, {
      cnname: '项目经理',
      itemCode: 'skill5533'
    }],
    cycleList: [],
    tradeList: [{
        cnname: '互联网',
        itemCode: 'industryPexperience00002'
      },
      {
        cnname: '教育',
        itemCode: 'industryPexperience000010'
      },
      {
        cnname: '医疗',
        itemCode: 'industryPexperience000014'
      }
    ],
    postType: '',
    projectCycleCode: '',
    selTrade: [],
    tradeCode: [],
    cityName: '',
    cityCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cityName: app.globalData.cityName
    })
    let _this = this;

    // 项目周期
    IdleHttp.request('/mobileapi/dictionary/topic', {
      topic: 'RESIDENT_PERIOD'
    }).then(res => {
      if (res.data.responseHeader.code == 200) {
        _this.setData({
          cycleList: res.data.data.list[0].list
        })
      }
    })

    IdleHttp.request('/mobileapi/dictionary/list', {
      cnname: this.data.cityName,
      level: 2,
      topic: 'LOC'
    }).then(res => {
      if (res.data.responseHeader.code == 200) {
        _this.setData({
          cityCode: res.data.data.list[0].itemCode
        })
      }
    })
  },
  selTopic(event) {
    let topic = event.currentTarget.dataset.topic;
    let code = event.currentTarget.dataset.code;
    this.setData({
      [topic]: event.currentTarget.dataset.code
    });
  },
  selTrage(event) {
    let selTrade = this.data.selTrade;
    let tradeCode = this.data.tradeCode;
    let itemCode = event.currentTarget.dataset.code;
    let cnname = event.currentTarget.dataset.name;
    if (selTrade.findIndex(item => item.itemCode == itemCode) == -1) {
      if (selTrade.length >= 3) {
        wx.showToast({
          title: '最多选择3个',
          icon: 'none'
        })
        return;
      };
      selTrade.push({
        itemCode,
        cnname
      });
      tradeCode.push(itemCode);
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
  cerateRequest() {
    if (this.data.postType == '' || this.data.tradeCode.length == 0 || this.data.projectCycleCode == '') {
      return
    } else {
      IdleHttp.request('/mobileapi/requirement/saveRequirement', {
        cityCode: this.data.cityCode,
        creatorBuid: 2346869959,
        creatorJfid: 2346870110,
        industryCode: this.data.tradeCode.join(','),
        postType: this.data.postType,
        projectCycleCode: this.data.projectCycleCode
      }).then(res => {
        if (res.data.responseHeader.code == 200) {
          wx.showToast({
            title: '创建成功',
            icon: 'none'
          })
          wx.navigateBack()
        } else {
          wx.showToast({
            title: res.data.responseHeader.message,
            icon: 'none'
          })
        }
      })
    }
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