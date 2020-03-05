// pages/demo/customer.js
var customer_info = {
  "email": "test@udesk.cn", //邮箱
  "customer_token": 'test_token', //客户外部ID
  "ip": "192.168.1.1", //IP
  "description": "描述",
  "organization_id": 1, //所属公司ID
  "tags": "标签1,标签2", //标签 已英文号分割
  "owner_id": 1, //客户负责人ID
  "owner_group_id": 1, //客户负责组ID
  "level": "normal", // 等级
  "cellphones": [
    ["", "13100000002"], //数组 [[电话ID, 电话文本]]
    ["3", "13100000003"] //id为空字符串或null时表示新增电话号，有值时表示更新此id对应的电话号码
  ],
  "other_emails": [
    ["", "13100000002@udesk.cn"], //数组 [[邮箱ID, 邮箱]]
    ["1", "13100000003@udesk.cn"] //id为空字符串或null时表示新增邮箱，有值时表示更新此id对应的邮箱
  ],
  "custom_fields": {
    "TextField_1": "普通文本内容",
  }
}

var nick_name = "张三" // 客户昵称
var avatar = "https://www.udesk.cn/images/index/logo1124.png" // 客户头像

var note_info = {
  "title": "业务记录标题",
  "custom_fields": {
    "TextField_1": "普通文本内容",
  }
}

//转换成字符串
let customer_info_str = JSON.stringify(customer_info)
let note_info_str = JSON.stringify(note_info)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick_name: '甲方名称',
    avatar:'https://www.udesk.cn/images/index/logo1124.png',
    customer_info_str: customer_info_str,
    note_info_str: note_info_str
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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