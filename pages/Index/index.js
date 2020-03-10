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
    pageSize: 10,
    pageStart: 1,
    cityName: '',
    cityCode: '',
    hasRequest: false,
    resumePage: {
      pageSize: 10,
      pageStart: 1,
    },
    queryType: 1, // 1推荐  2最新  3报价正序  4报价倒叙
    resumeList: [],
    requestList: [],
    finished: false
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
      this.init()
    }).catch(() => {
      this.setData({
        cityName: app.globalData.cityName
      })
      this.init()
    });
  },
  init() {
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
          let param = {};
          let requestList = this.data.requestList;
          requestList.length == 0 ? queryType = 2 : (queryType = 1 && (param.requireId = requestList[requestList.length - 1].requireId));
          this.setData({
            queryType
          })
          this.getCityCode().then(() => {
            param.workPlaceCode = this.data.cityCode;
            param.queryType = queryType;
            param.jfid = this.data.user.jfId;
            param = Object.assign(param, {
              ...this.data.resumePage
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
          this.setData({
            requestList: resData.data.list
          });
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
        let pageStart = this.data.resumePage.pageStart;
        pageStart++;
        resumeList = resumeList.concat(resData.data.list);
        this.setData({
          resumeList,
          'resumePage.pageStart': pageStart,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.createSelectorQuery().select('#staff-filter').boundingClientRect().exec((res) => {
      this.setData({
        idleFilterTop: res[0].top
      })
    })
  },
  // 页面滚动事件
  onPageScroll: function(event) {
    const idleFilterTop = this.data.idleFilterTop
    if (event.scrollTop >= idleFilterTop - 150 && this.requestList.length == 0) {
      this.setData({
        showFxq: true
      })
    } else {
      this.setData({
        showFxq: false
      })
    }

    if (event.scrollTop >= idleFilterTop - 190 && this.requestList.length != 0) {
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
    this.onLoad();
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
    this.onLoad();
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