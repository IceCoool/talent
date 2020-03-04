// pages/SelCity/selCity.js
const IdleHttp = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityChart: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    idleCitys: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    IdleHttp.request('/mobileapi/dictionary/list', {
      topic: 'LOC'
    }).then(res => {
      if (res.data.responseHeader.code == 200) {
        let citys = [];
        let resList = res.data.data.list[0].list;
        // 将所有市级单位摘出
        resList.forEach((provinceItem, provinceIndex) => {
          provinceItem.children.shift();
          citys = citys.concat(provinceItem.children)
        })
        const cityChart = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
        let idleCitys = []
        // for (let i = 0; i < cityChart.length; i++) {
        //   let char = cityChart[i];
        //   let obj = {
        //     name: char,
        //     list: []
        //   };
        //   for (let k = 0; k < citys.length; k++) {
        //     let cityItem = citys[k];
        //     if (getFirstLetter(cityItem.cnname).slice(0, 1) == char) {
        //       obj.list.push(cityItem)
        //     }
        //   };
        //   idleCitys.push(obj)
        // }
        console.log(idleCitys)
        this.setData({
          idleCitys: idleCitys
        })
      }
    })
  },

  onChange(event) {
    this.setData({
      sortValue: event.currentTarget.dataset.code
    });
  },
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    });
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