// page/index/index.js
const app = getApp();
const IdleHttp = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFxq: false,
    showMyXq: false,
    showLogin: false,
    cityName: '',
    cityCode: '',
    hasRequest: Boolean,
    resumePage: {
      pageSize: 10,
      pageStart: 1,
    },
    queryType: 1, // 1推荐  2最新  3报价正序  4报价倒叙
    resumeList: [],
    requestList: [],
    finished: false,
    param: {},
    isLoading: false,
    offsetTop: 0,
    record: `{
      "serviceType": "",
      "educ": {
        "id":"",
        "value": ""
       },
      "priceRange": "",
      "workRange": "",
      "tradeCode": [],
      "workYearLowerLimit": "",
      "workYearUpperLimit": "",
      "personPriceLowerLimit": "",
      "personPriceUpperLimit": ""
    }`
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 提示用户 授权地理位置
    app.promiseLocaAuthorize().then(() => {
      this.setData({
        cityName: app.globalData.cityName
      });
      app.getUser().then(() => {
        this.init()
      })
    }).catch(() => {
      this.setData({
        cityName: app.globalData.cityName
      })
      app.getUser().then(() => {
        this.init()
      })
    });
  },
  init() {
    let user = app.globalData.user;
    this.setData({
      user
    })
    if (user) {
      // let buid;    //未定下来需求列表是否要与企业挂钩
      // buid = user.buId || user.buList[0].buId
      // if (buid) {
      this.getRequestList().then(() => {
        let queryType;
        let param = this.data.param;
        let requestList = this.data.requestList;
        let hasRequest = true;
        let offsetTop = 0;
        requestList.length == 0 ? ((queryType = 2) && (hasRequest = false) && (offsetTop = 68)) : ((queryType = 1) && (param.requireId = requestList[0].requireId) && (offsetTop = 104)); //测试时注释掉
        this.setData({
          // queryType: 2,
          queryType,
          hasRequest,
          offsetTop
          // hasRequest: false
        })
        this.getCityCode().then(() => {
          param.workPlaceCode = this.data.cityCode; //测试时注释掉
          // param.workPlaceCode = 110000;
          param.queryType = queryType;
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
      })
      // } else {

      // }
    } else {
      // 未登录
      this.getCityCode().then(() => {
        this.setData({
          queryType: 2
        })
        let param = {};
        param.workPlaceCode = this.data.cityCode;
        param.queryType = 2;
        param = Object.assign(param, {
          ...this.data.resumePage
        })
        this.getResumeList(param);
      });
    }
  },
  // 获取需求列表
  getRequestList() {
    return new Promise((resolve, reject) => {
      let param = {
        creatorJfid: this.data.user.jfId
        // creatorBuid: buid
      }
      IdleHttp.request('/mobileapi/requirement/queryMobileRequirementList', {
        ...param
      }).then(res => {
        let resData = res.data;
        if (resData.responseHeader.code == 200) {
          if (resData.data.totalCount != 0) {
            this.setData({
              requestList: resData.data.list
            });
          }
          resolve();
        }
      })
    })
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
      }).catch(res => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
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
  // 页面滚动事件
  onPageScroll: function(event) {
    if (event.scrollTop >= 500 && this.data.requestList.length == 0) {
      this.setData({
        showFxq: true
      })
    } else {
      this.setData({
        showFxq: false
      })
    }

    if (event.scrollTop >= 500 && this.data.requestList.length != 0) {
      this.setData({
        showMyXq: true
      })
    } else {
      this.setData({
        showMyXq: false
      })
    }
  },
  isLogin(event) {
    let url = event.currentTarget.dataset.url;
    app.loginAuthorize(this, url)
  },
  compIsLogin(event) {
    app.loginAuthorize(this, event.detail.url)
  },
  reload() {
    this.setData({
      requestList: [],
      resumeList: [],
      'param.pageStart': 1,
      'resumePage.pageStart': 1,
      finished: false
    })
    this.onLoad();
  },
  unbindUser(){
    app.unbindUser();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      requestList: [],
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
      if (this.data.param.queryType && this.data.param.workPlaceCode) {
        this.getResumeList(this.data.param);
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})