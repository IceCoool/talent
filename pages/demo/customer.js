// pages/demo/customer.js
var customer_info = {
  "email": "461258697@qq.cn", //邮箱
  "description": "某某某公司",
  "organization_id": 1, //所属公司ID
  "tags": "标签1,标签2", //标签 已英文号分割
  "level": "normal", // 等级
  "cellphones": [
    ["", "17346520964"] //数组 [[电话ID, 电话文本]]
  ],
  "other_emails": [
    ["", "2629136779@qq.cn"] //数组 [[邮箱ID, 邮箱]]
  ]
}

//转换成字符串
let customer_info_str = JSON.stringify(customer_info)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick_name: '甲方名称',
    avatar:'https://www.udesk.cn/images/index/logo1124.png',
    customer_info_str: customer_info_str
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(new Date('2018-09-08'))
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})