// pages/card/create/search.js
const http = require('../../utils/http.js')
// const tracker = require('../../utils/tracker.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /* 该页面包含搜索输入和搜索结果展示两部分,
     如果页面启动参数有searchKey，表明为搜索结果展示，否则为搜索结果输入*/
    searchText: '', // 搜索框输入文本
    // 展示搜索结果时，搜索关键字
    searchKey: '',
    result: [], // 搜索结果列表
    isReady: false,
    // 列表来自两种： 天眼查或者已有企业，
    isCreated: false, // 是否已经创建
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.searchKey = options.searchKey || ""
    console.log(this.data.searchKey)

    if (this.data.searchKey != "") {
      this.beginSearch()
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#007AFF',
      })
    }

    this.setData({
      searchKey: this.data.searchKey
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



  // 执行搜索
  beginSearch: function() {
    wx.showLoading({
      title: '',
    })

    var url = '/mobileapi/bu/searchBuList'
    var params = {
      buName: this.data.searchKey.trim()
    }
    var that = this
    http.post(url, params, function(res) {
      if (res.responseHeader && res.responseHeader.code == 200) {
        wx.hideLoading()
        var type = res.data.dataType
        // 不同的类型，不同的结构。。。。。哎
        if (type == 'bu') {
          that.setData({
            result: (res.data && res.data.buItems) || [],
            isCreated: false,
            type: 'bu'
          })
        } else {
          that.setData({
            result: (res.data && res.data.spItems) || [],
            isCreated: true,
            type: 'tyc'
          })
        }
        // sensor记录
        // tracker.search(that.data.searchKey, that.data.result.length, '自主输入')
      } else {
        getApp().showError(res.responseHeader ? res.responseHeader.message : '')
      }
      that.setData({
        isReady: true
      })
    }, function(err) {
      that.setData({
        isReady: true,
      })
      getApp().showError()
    })
  },

  // 输入框事件
  searchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  // 搜索提交
  submit: function() {
    if (this.data.searchText == "") {
      return getApp().showError('请输入要搜索企业名称')
    }

    wx.navigateTo({
      url: './search?searchKey=' + (this.data.searchText || '解放号'),
    })
  },

  // 点击搜索结果项
  itemClick: function(e) {
    let item = JSON.stringify(e.currentTarget.dataset.item);
    let type = e.currentTarget.dataset.type;
    let buid = e.currentTarget.dataset.buid;
    wx.navigateTo({
      url: `./authenticate?comInfo=${item}&buid=${buid}&type=${type}`,
    })

    // // tracker.searchResultClick(name, index)

    // if (this.data.isCreated) { // 平台已有
    //   wx.navigateTo({
    //     url: './join?buid=' + id
    //   })
    //   return
    // }

    // 检查企业是否已经在平台存在
    // 因为天眼查的接口并不是严格按照文字搜索，会”联想“到跟字眼有关的其他企业，这些企业可能已经在凭条注册过！！！

    // wx.showLoading({
    //   title: '',
    // })

    // http.post('/mobileapi/bu/searchBuByName', {
    //   buName: name
    // }, (res) => {
    //   wx.hideLoading()
    //   if (res.responseHeader && res.responseHeader.code == 200) {
    //     let isCreated = false
    //     if (res.data.chechkBuName == 1) { // 平台已存在
    //       isCreated = true
    //       id = res.data.buid
    //     }

    //     var url = isCreated ? './join' : './create'
    //     url += ('?buid=' + id)
    //     wx.navigateTo({
    //       url: url,
    //     })
    //   } else {
    //     getApp().showError(res.responseHeader ? res.responseHeader.message : '')
    //   }
    // }, (err) => {
    //   wx.hideLoading()
    //   getApp().showError()
    // })
  },
})