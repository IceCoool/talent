// pages/card/create/create.js
const http = require('../../utils/http.js')
const user = require('../../utils/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buid: '',
    info: '',

    // 是否成功创建
    isSuccess: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.buid = options.buid // 此处应该是天眼查id
    this.getTycBuInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getTycBuInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },



  // 获取天眼查企业信息
  getTycBuInfo: function() {
    wx.showLoading({
      title: '',
    })
    var url = '/api/bu/getTycBuInfo'
    var params = {
      buid: this.data.buid,
    }
    var that = this
    http.post(url, params, function(res){
      if (res.responseHeader && res.responseHeader.code == 200) {
        wx.hideLoading()
        that.setData({
          info: res.data,
        })
      }else{
        getApp().showError(res.responseHeader ? res.responseHeader.message : '')
      }
      wx.stopPullDownRefresh()
    }, function(err){
      getApp().showError('')
      wx.stopPullDownRefresh()
    })
  },

  // 创建
  create: function(e){
    wx.showLoading({
      title: '',
    })
    var that = this
    var url = '/api/bu/saveBuInfo'
    var params = {
      owner: user.getJfId(),
      buName: this.data.info.name,
      corporate: this.data.info.legalPersonName,
      buildTime: this.data.info.estiblishTime,
      rstCapital: this.data.info.regCapital,
      address: this.data.info.regLocation,
      fullName: user.getNickName(),
      photoUrl: user.getAvatarUrl(false),
      staffNumRange: this.data.info.staffNumRange,
      dataType: 'tyc'
    }
    http.post(url, params, function(res){
      if (res.responseHeader && res.responseHeader.code == 200) {
        wx.hideLoading()
        const info = res.data.buinfo
        user.setBuId(info.buId)
        user.setBuName(info.buName)
        user.setManager(true)

        that.setData({
          isSuccess: true,
        })
      }else{
        getApp().showError(res.responseHeader ? res.responseHeader.message : '')
      }
    }, function(err){
      getApp().showError()
    })
  },

  // 完善信息
  completeInfo: function(e) {
    console.log("completeInfo")

    wx.navigateBack({
      delta: getCurrentPages().length - 1,
      complete: () => {
        wx.navigateTo({
          url: '/pages/mine/enterprise/menu',
        })
      }
    })
  },

  // 查看名片
  go2Card: function(e) {
    console.log("go2Card")

    wx.switchTab({
      url: '/pages/card/card-tab',
    })
  }
})