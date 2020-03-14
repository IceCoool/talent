// pages/IdleType/epiboly.js
const app = getApp();
const IdleHttp = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName: '',
    cityCode: '',
    hasRequest: true,
    resumePage: {
      pageSize: 10,
      pageStart: 1,
    },
    queryType: 1, // 1推荐  2最新  3报价正序  4报价倒叙
    resumeList: [],
    finished: false,
    param: {},
    isLoading: false,
    offsetTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cityName: app.globalData.cityName,
      requireId: options.requireId,
      user: app.globalData.user,
      'param.requireId': options.requireId,
      'param.queryType': 1
    });
    this.init()
  },
  init() {
    let user = this.data.user;
    // let buid;    //未定下来需求列表是否要与企业挂钩
    // buid = user.buId || user.buList[0].buId
    // if (buid) {
    let param = this.data.param;
    this.getCityCode().then(() => {
      param.workPlaceCode = this.data.cityCode; //测试时注释掉
      // param.workPlaceCode = 110000;
      // param.queryType = 2;
      // param.jfid = 2346870110;
      param.jfid = user.jfId; //测试时注释掉  
      param = Object.assign(param, {
        ...this.data.resumePage
      })
      this.setData({
        param
      })
      this.getResumeList(param);
    });
  },

  // 获取简历列表
  getResumeList(params, replace) {
    replace = replace || false;
    if (!this.data.isLoading) {
      wx.showLoading();
      this.setData({
        isLoading: true
      })
      IdleHttp.request('/mobileapi/resume/queryResumeList', {
        ...params
      }).then(res => {
        let resData = res.data;
        let resumeList = this.data.resumeList;
        if (resData.responseHeader.code == 200) {
          wx.hideLoading()
          if (resData.data.totalCount == 0) {
            this.setData({
              isLoading: false,
              resumeList: [],
              finished: true
            })
          } else {
            let pageStart = params.pageStart;
            pageStart++;
            let list = resData.data.list;
            list.forEach((item, index) => {
              if (item.personLabelName != '') {
                item.personLabelName = item.personLabelName.split(',')
              }
            })
            if (!replace) {
              resumeList = resumeList.concat(list);
            } else {
              resumeList = list
            }
            this.setData({
              isLoading: false,
              resumeList,
              'resumePage.pageStart': pageStart,
              'param.pageStart': pageStart,
              totalCount: resData.data.totalCount
            });
            if (this.data.totalCount == this.data.resumeList.length) {
              this.setData({
                finished: true
              })
            }
          }
        }
      })
    }

  },
  getCityCode() {
    return new Promise((resolve, reject) => {
      IdleHttp.request('/mobileapi/dictionary/list', {
        cnname: this.data.cityName,
        level: 2,
        topic: 'LOC'
      }).then(res => {
        if (res.data.responseHeader.code == 200) {
          this.setData({
            cityCode: res.data.data.list[0].itemCode
          });
          resolve();
        }
      })
    })

  },
  // 切换列表标签
  changeQuery(event) {
    let type = event.detail;
    this.setData({
      queryType: type,
      finished: false,
      'resumePage.pageStart': 1,
      'param.pageStart': 1,
      'param.queryType': type
    });
    this.getResumeList(this.data.param, true)
  },

  onPullDownRefresh: function() {
    this.setData({
      resumeList: [],
      'param.pageStart': 1,
      'resumePage.pageStart': 1,
      finished: false
    })
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.finished) {
      this.getResumeList(this.data.param);
    }
  },
  navTo(event) {
    wx.navigateTo({
      url: event.detail.url,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})