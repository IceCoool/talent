// pages/SelCity/selCity.js
const IdleHttp = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idleCitys: [],
    charIndex: []
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
        let resData = res.data.data.list[0].list;
        // 将所有市级单位摘出
        resData.forEach((provinceItem, provinceIndex) => {
          provinceItem.children.shift();
          citys = citys.concat(provinceItem.children)
        })
        const cityChart = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        let idleCitys = [];
        let charIndex = [];
        for (let i = 0; i < cityChart.length; i++) {
          let hasChar = false;
          let char = cityChart[i];
          let obj = {
            name: char,
            list: []
          };
          for (let k = 0; k < citys.length; k++) {
            let cityItem = citys[k];
            if (cityItem.enname) {
              if (cityItem.enname.slice(0, 1).toUpperCase() == char) {
                hasChar = true;
                obj.list.push(cityItem);
                // 已分组的城市 不在进入循环
                citys.splice(k, 1);
                k--;
              }
            }
          };
          hasChar ? charIndex.push(char) : '';

          idleCitys.push(obj)
        }
        this.setData({
          idleCitys: idleCitys,
          charIndex: charIndex
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
      scrollTop: event.scrollTop + 5
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