// pages/Filter/selAll.js
// 
const IdleHttp = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobList: [],
    selTrade: [],
    tradeCode: [],
    serviceType: '',
    education: '',
    priceRange: '',
    workRange: '',
    personPriceMonth: [{
      id: 1,
      name: '3K以下',
      lower: '11999',
      upper: '12000'
    }],
    personPriceDay: [{
      id: 1,
      name: '5K以下',
      lower: '799',
      upper: '801'
    }],
    workYear: [{
      id: 1,
      name: '1年以内',
      lower: '4',
      upper: '8'
    }, {
      id: 2,
      name: '1-3年',
      lower: '5',
      upper: '6'
    }],
    educationRange: {
      '1': '0,2',
      '2': '3,4,5,6'
    },
    workYearLowerLimit: '',
    workYearUpperLimit: '',
    custom: false,
    param: {}
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
  goBack() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let param = this.data.param;
    let prevParam = prevPage.data.param;
    prevParam.pageStart = 1;
    let newParam = Object.assign(param, prevParam)
    prevPage.setData({
      finished: false,
      'resumePage.pageStart': 1,
      param: newParam
    });
    prevPage.getResumeList && prevPage.getResumeList(newParam, true)
    wx.navigateBack()
  },
  // 选择行业
  selTradeFn(event) {
    let tradeCode = this.data.tradeCode;
    let itemCode = event.currentTarget.dataset.code;
    if (tradeCode.indexOf(itemCode) == -1) {
      tradeCode.push(itemCode)
    } else {
      tradeCode.splice(tradeCode.findIndex(item => item == itemCode), 1)
    }
    this.setData({
      tradeCode,
      'param.industryCode': tradeCode.join(',')
    })
  },
  // 选择服务类型
  selService(event) {
    let serviceType = event.currentTarget.dataset.type;
    let param = this.data.param;
    param.serviceType = serviceType;
    delete param.personPriceLowerLimit;
    delete param.personPriceUpperLimit;
    this.setData({
      serviceType,
      param,
      priceRange: ''
    });

  },
  // 选择学历
  selEduc(event) {
    let type = event.currentTarget.dataset.type;
    let educationRange = this.data.educationRange[type];
    this.setData({
      education: type,
      'param.educationRange': educationRange
    })
  },
  // 选择报价
  selPrice(event) {
    let id = event.currentTarget.dataset.id;
    let lower = event.currentTarget.dataset.lower;
    let upper = event.currentTarget.dataset.upper;
    this.setData({
      priceRange: id,
      'param.personPriceLowerLimit': lower,
      'param.personPriceUpperLimit': upper
    })
  },
  // 选择经验
  selWork(event) {
    let id = event.currentTarget.dataset.id;
    let lower = event.currentTarget.dataset.lower;
    let upper = event.currentTarget.dataset.upper;
    this.setData({
      workRange: id,
      custom: false,
      'param.workYearLowerLimit': lower,
      'param.workYearUpperLimit': upper,
      workYearLowerLimit: '',
      workYearUpperLimit: ''
    })
  },
  clearCode(event) {
    let param = this.data.param;
    delete param.industryCode;
    this.setData({
      tradeCode: [],
      param
    })
  },
  clearSel(event) {
    let name = event.currentTarget.dataset.name;
    let param = this.data.param;
    switch (name) {
      case 'serviceType':
        delete param.serviceType;
        delete param.personPriceLowerLimit;
        delete param.personPriceUpperLimit;
        this.setData({
          priceRange: '',
          serviceType: ''
        })
        break;
      case 'education':
        delete param.educationRange;
        this.setData({
          education: ''
        });
        break;
      case 'priceRange':
        delete param.personPriceLowerLimit;
        delete param.personPriceUpperLimit;
        this.setData({
          priceRange: ''
        })
        break;
      case 'workRange':
        delete param.workYearLowerLimit;
        delete param.workYearUpperLimit;
        this.setData({
          workRange: '',
          custom: false,
          workYearLowerLimit: '',
          workYearUpperLimit: ''
        })
        break;
    }
  },
  showCustom() {
    let param = this.data.param;
    delete param.workYearLowerLimit;
    delete param.workYearUpperLimit;
    this.setData({
      custom: true,
      workRange: 'custom'
    })
  },
  customWork(event) {
    let workYear = '';
    let custom = event.currentTarget.dataset.custom;
    workYear = custom;
    let paramWork = `param.${workYear}`
    this.setData({
      [custom]: event.detail.value,
      [paramWork]: event.detail.value
    })
  },
  clearAll() {
    this.setData({
      serviceType: '',
      education: '',
      workRange: '',
      priceRange: '',
      tradeCode: [],
      custom: false,
      workYearLowerLimit: '',
      workYearUpperLimit: '',
      param: {}
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