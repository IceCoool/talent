// pages/mine/enterprise/authenticate.js
const user = require('../../utils/user.js');
const http = require('../../utils/http.js');
const util = require('../../utils/utils.js');
const IdleHttp = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 0, // 模式 0-查看， 1-编辑
    buid: '',

    licenseSrc: '', // 营业执照
    licenseKey: '',
    licenseInfo: '',
    licenseWrong: false,

    idCardSrc1: '', // 身份证正面
    idCardKey1: '',
    idCardInfo1: '',
    idCardWrong1: false,

    idCardSrc2: '', // 身份证反面
    idCardKey2: '',
    idCardInfo2: '',
    idCardWrong2: false,

    others: [], // 其他资质图片
    otherKeys: [],

    btnEnabled: false,

    isSuccess: false,

    type: '',
    comBuInfo: {},
    comSpInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      mode: options.mode || 1, // 默认是1编辑模式
    })

    if (options.type == 'bu') {
      IdleHttp.request('/mobileapi/bu/getBuInfo', {
        buid: options.buid
      }).then(res => {
        if (res.data.responseHeader.code == 200) {
          this.setData({
            comBuInfo: res.data.data,
            type: 'bu'
          });
        }
        this.getInfo()
      })
    } else {
      let comSpInfo = JSON.parse(options.comInfo)
      this.setData({
        comSpInfo,
        type: 'tyc'
      })
    }

    // wx.showLoading({
    //   title: '',
    // })
    // // 刷新权限
    // getApp().getBuRole(()=>{
    //   const isManager = user.isManager()
    //   var mode = this.data.mode
    //   // 矫正mode，保证只有管理员可编辑
    //   if (mode == 1 && !isManager) {
    //     mode = 0
    //   }
    //   this.setData({
    //     buid: user.getBuId(),
    //     mode: mode
    //   })

    //   this.getInfo()
    // })
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
    // wx.showLoading({
    //   title: '',
    // })
    // this.getInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  // 获取信息
  getInfo: function() {
    var url = '/mobileapi/bu/getBuAuth'
    var params = {
      buid: this.data.comBuInfo.buid
    }
    var that = this
    http.post(url, params, function(res) {
      if (res.responseHeader && res.responseHeader.code == 200) {
        wx.hideLoading()
        const data = res.data || {}
        var others = [],
          otherKeys = []
        for (var i = 1; i <= 3; i++) {
          var url = data[`otherCertificateUrl${i}`] || ''
          if (url != '') {
            others.push(url)
            otherKeys.push(data[`otherCertificate${i}`])
          }
        }
        that.setData({
          licenseSrc: data.licimgUrl || '',
          licenseKey: data.licimg || '',
          licenseInfo: {
            buname: data.buname || '',
            registAddr: data.registAddr || '',
            creditCode: data.orgcode || '',
          },
          idCardSrc1: data.idcardObverseUrl || '',
          idCardKey1: data.idcardObverse || '',
          idCardInfo1: {
            name: data.legalPersonName || '',
            idNumber: data.legalPersonIdcardNo || '',
          },
          idCardSrc2: data.idcardReverseUrl || '',
          idCardKey2: data.idcardReverse || '',
          others: others,
          otherKeys: otherKeys
        })

      } else {
        getApp().showError(res.responseHeader ? res.responseHeader.message : '');
      }
      wx.stopPullDownRefresh()
    }, function(err) {
      getApp().showError()
      wx.stopPullDownRefresh()
    })
  },

  // 选择图片： 图片都提交到主站
  chooseImage: function(e) {
    if (this.data.mode == 0) return

    const type = e.currentTarget.dataset.type // 图片类型：营业资质0、省份证正1反2、其他资质3
    const index = e.currentTarget.dataset.index // 其他资质多图片时的index
    console.log("chooseImage:" + type + "," + index)
    var that = this

    var count = 1
    if (type == 3) { // 其他资质图片
      if (index == -1) { // 添加新图片,
        count = 3 - this.data.others.length // 最多允许3张图片
      } else { // 替换原图片
        count = 1
      }
    }
    wx.chooseImage({
      // 其他资质最多3张
      count: count,
      success: function(res) {
        if (res.tempFilePaths.length == 0) return

        // 先使用临时文件路径吧（有可能出现选择图片太多导致临时文件被销毁的情况。。。）
        const tempFiles = res.tempFilePaths
        const len = tempFiles.length

        var newData = {}
        if (type == 0) {
          newData["licenseSrc"] = tempFiles[0]
          newData["licenseKey"] = ''
          newData["licenseWrong"] = false
        } else if (type == 1) {
          newData["idCardSrc1"] = tempFiles[0]
          newData["idCardKey1"] = ''
          newData["idCardWrong1"] = false
        } else if (type == 2) {
          newData["idCardSrc2"] = tempFiles[0]
          newData["idCardKey2"] = ''
          newData["idCardWrong2"] = false
        } else if (type == 3) { // 其他资质
          if (index == -1) { // 增加新图片
            var idx = that.data.others.length
            tempFiles.forEach((item) => {
              newData[`others[${idx}]`] = item
              newData[`otherKeys[${idx}]`] = ''
              idx++
            })
          } else { // 替换图片
            newData[`others[${index}]`] = tempFiles[0]
            newData[`otherKeys[${index}]`] = ''
          }
        }
        that.setData(newData)

        // 编辑模式下
        if (that.data.mode == 1) {
          // 只有执照、身份证齐全了，才能提交
          that.data.btnEnabled = (that.data.licenseSrc != "") && (that.data.idCardSrc1 != "") && (that.data.idCardSrc2 != "")

          // 触发更新
          that.setData({
            btnEnabled: that.data.btnEnabled
          })
        }

        // 由于身份证等验证耗时，提前上传
        if (type != 3) {
          wx.showLoading({
            title: '信息验证中...',
          })
        }
        that.uploadFiles(() => {
          if (type != 3) {
            wx.showToast({
              title: '验证成功',
            })
          }
        })
      },
    })
  },

  // 删除其他资质图片
  deleteOtherImage: function(e) {
    const index = e.currentTarget.dataset.index
    this.data.others.splice(index, 1)

    this.setData({
      others: this.data.others,
      [`otherKeys[${index}]`]: '',
      btnEnabled: true
    })
  },

  // 上传文件
  uploadFiles: function(success) {
    var params = [],
      files = [],
      urls = []
    var types = []
    // 新文件需要上传：非网络文件
    if (this.data.licenseSrc != '' && this.data.licenseKey == '' && !util.checkUrl(this.data.licenseSrc)) {
      urls.push('/mobileapi/bu/businessLicense')
      params.push({
        jfid: user.getJfId(),
        buid: user.getBuId(),
      })
      files.push(this.data.licenseSrc)
      types.push('license')
    }
    if (this.data.idCardSrc1 != '' && this.data.idCardKey1 == '' && !util.checkUrl(this.data.idCardSrc1) && !this.data.idCardWrong1) {
      urls.push('/mobileapi/bu/idcard')
      params.push({
        jfid: user.getJfId(),
        srctype: "front",
      })
      files.push(this.data.idCardSrc1)
      types.push('front')
    }
    if (this.data.idCardSrc2 != '' && this.data.idCardKey2 == '' && !util.checkUrl(this.data.idCardSrc2) && !this.data.idCardWrong2) {
      urls.push('/mobileapi/bu/idcard')
      params.push({
        jfid: user.getJfId(),
        srctype: "back",
      })
      files.push(this.data.idCardSrc2)
      types.push('back')
    }
    // 处理其他资质图片: 非网络图片需要上传
    var data = {
      jfid: user.getJfId(),
      buid: user.getBuId(),
    }
    this.data.others.forEach((item, index) => {
      if (item != '' && this.data.otherKeys[index] == '' && !util.checkUrl(item)) {
        urls.push('/mobileapi/bu/attachment')
        params.push(data)
        files.push(item)
        types.push('other,' + index)
      }
    })
    if (files.length == 0) {
      return success && success()
    }
    var that = this
    http.uploadFiles(urls, files, 'uploadFile', params, (results) => {
      console.log(results)
      var hasError = false,
        errMsg = ''
      results.forEach((res, index) => {
        const type = types[index]
        if (res.responseHeader && res.responseHeader.code == 200) {
          let newData = {}
          if (type == 'license') {
            newData['licenseKey'] = res.data.ossKey
            // 任何有用信息都没识别出来，则认为图片不正确
            if (!res.data.name && !res.data.creditCode && !res.data.address) {
              newData['licenseWrong'] = true
              hasError = true
              errMsg = '请上传标准的营业执照'
            } else {
              newData['licenseInfo'] = {
                buname: res.data.name || '',
                creditCode: res.data.creditCode || '',
                registAddr: res.data.address || '',
              }
            }
          } else if (type == 'front') {
            newData['idCardKey1'] = res.data.idenimgpos
            newData['idCardInfo1'] = {
              name: res.data.fullName || '',
              idNumber: res.data.idNumber || '',
            }
          } else if (type == 'back') {
            this.data.idCardKey2 = res.data.idenimgrev
            this.data.idCardInfo2 = res.data
          } else if (type.indexOf('other') == 0) {
            var index = type.split(',')[1]
            this.data.otherKeys[index] == res.data.ossKey
          }
          if (!!newData) {
            this.setData(newData)
          }
        } else {
          if (type == 'front') this.data.idCardWrong1 = true
          if (type == 'back') this.data.idCardWrong2 = true

          console.log(type + '文件上传失败:' + res.responseHeader.message)
          hasError = true
          errMsg = res.responseHeader ? res.responseHeader.message : ''
        }
      })
      if (!hasError) {
        success && success()
      } else {
        this.isSubmiting = false
        getApp().showError(errMsg)
      }
    }, (err) => {
      console.log(err)
      getApp().showError()
      this.isSubmiting = false
    })
  },

  // 提交
  submit: function() {
    console.log("submit")

    if (!this.data.btnEnabled || this.isSubmiting) return

    let tip = ''
    if (this.data.licenseWrong) {
      tip = '请上传标准的营业执照'
    } else if (!this.data.licenseInfo.buname) {
      tip = '请补全企业名称'
    } else if (!this.data.licenseInfo.creditCode) {
      tip = '请补全统一社会信用代码'
    } else if (!this.data.licenseInfo.registAddr) {
      tip = '请补全公司地址'
    } else if (this.data.idCardWrong1 || this.data.idCardWrong2) {
      tip = '请上传标准二代身份证'
    } else if (!this.data.idCardInfo1.name) {
      tip = '请补全法人姓名'
    } else if (!this.data.idCardInfo1.idNumber) {
      tip = '请补全法人身份证号'
    }

    if (tip) {
      return getApp().showError(tip)
    }

    wx.showLoading({
      title: '',
    })

    this.isSubmiting = true
    this.uploadFiles(() => {
      this.saveInfo()
    })
  },

  // 保存信息
  saveInfo: function() {
    var url = '/mobileapi/bu/buVerify'
    var that = this
    var params = {
      jfid: user.getJfId(),
      buid: user.getBuId(),
      name: this.data.idCardInfo1.name,
      idCardNumber: this.data.idCardInfo1.idNumber,
      idCardFrontImage: this.data.idCardKey1,
      idCardBackImage: this.data.idCardKey2,
      buname: this.data.licenseInfo.buname,
      creditCode: this.data.licenseInfo.creditCode,
      registAddr: this.data.licenseInfo.registAddr,
      licimg: this.data.licenseKey,
      attach: this.data.otherKeys.join(','), //其它证明材料obs地址多个逗号分隔
    }
    http.post(url, params, function(res) {
      if (res.responseHeader && res.responseHeader.code == 200) {
        wx.hideLoading()
        that.setData({
          isSuccess: true,
          btnEnabled: false
        })
      } else {
        getApp().showError(res.responseHeader ? res.responseHeader.message : '')
      }
      that.isSubmiting = false
    }, function(err) {
      getApp().showError()
      that.isSubmiting = false
    })
  },

  // 联系客服
  contactCS: function(e) {
    wx.navigateTo({
      url: '/mine/pages/contact-cs',
    })
  },

  // 查看
  check: function(e) {
    wx.redirectTo({
      url: './authenticate?mode=0',
    })
  },

  // 人工输入信息
  infoInput: function(e) {
    const value = e.detail.value
    const name = e.currentTarget.dataset.name

    this.setData({
      [name]: value,
      btnEnabled: true
    })
  }
})