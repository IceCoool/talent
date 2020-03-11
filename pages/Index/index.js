// page/index/index.js
const app = getApp();
const IdleHttp = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idleFilterTop: Number,
    showFxq: false,
    showMyXq: false,
    showLogin: false,
    cityName: '',
    cityCode: '',
    hasRequest: Boolean,
    resumePage: {
      pageSize: 1,
      pageStart: 1,
    },
    queryType: 1, // 1推荐  2最新  3报价正序  4报价倒叙
    resumeList: [],
    requestList: [],
    finished: false,
    param: {}
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
    wx.showLoading()
    let user = app.globalData.user;
    this.setData({
      user
    })
    if (user) {
      // 已登录
      let buid;
      buid = user.buId || user.buList[0].buId
      if (buid) {
        this.getRequestList(buid).then(() => {
          let queryType;
          let param = this.data.param;
          let requestList = this.data.requestList;
          let hasRequest = true;
          // requestList.length == 0 ? ((queryType = 2) && （hasRequest = false)) : ((queryType = 1) && (param.requireId = requestList[0].requireId));  //测试时注释掉
          this.setData({
            queryType: 2,
            // queryType,
            // hasRequest,
            hasRequest: false
          })
          this.getCityCode().then(() => {
            // param.workPlaceCode = this.data.cityCode;//测试时注释掉  
            param.workPlaceCode = 110000;
            // param.queryType = queryType;
            param.queryType = 2;
            param.jfid = 2346870110;
            // param.jfid = user.jfId;//测试时注释掉  
            param = Object.assign(param, {
              ...this.data.resumePage
            })
            this.setData({
              param
            })
            this.getResumeList(param);
          });
        })
      } else {

      }
    } else {
      // 未登录
      this.getCityCode().then(() => {
        this.setData({
          queryType: 2
        })
        let param = {};
        param.workPlaceCode = this.data.cityCode;
        param.queryType = 2;
        param = Object.assign(param, { ...this.data.resumePage
        })
        this.getResumeList(param);
      });
    }
  },
  getRequestList(buid) {
    return new Promise((resolve, reject) => {
      let param = {
        creatorJfid: this.data.user.jfId,
        creatorBuid: buid
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
  getResumeList(params) {
    IdleHttp.request('/mobileapi/resume/queryResumeList', {
      ...params
    }).then(res => {
      let resData = res.data;
      let resumeList = this.data.resumeList;
      if (resData.responseHeader.code == 200) {
        wx.hideLoading()
        let pageStart = params.pageStart;
        pageStart++;
        let list = resData.data.list;
        list.forEach((item, index) => {
          item.personLabelName = item.personLabelName.split(',')
        })
        resumeList = resumeList.concat(list);
        this.setData({
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
    })
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
      this.getResumeList(this.data.param);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})