// pages/mine/enterprise/authenticate.js
const http = require('../../utils/http.js');
const util = require('../../utils/utils.js');
const IdleHttp = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 0, // 模式 0-查看， 1-编辑
    auth: -3,
    buid: '',
    jfid: '',
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
    comSpInfo: {},
    isInBu: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      mode: options.mode || 1, // 默认是1编辑模式
      source: options.source || '',
      // jfid: getApp().globalData.user.jfId
      jfid: 2346870110
    })
    wx.showLoading()
    if (options.type == 'bu') {
      // 平台存在企业  如果是从搜索处进来 先查用户是否在当前企业内
      if (options.source == 'search') {
        IdleHttp.request('/mobileapi/bu/verifyUserBuMember', {
          jfid: 2346870110,
          buid: options.buid
        }).then(res => {
          console.log(res)
          if (res.data.responseHeader.code == 200) {
            wx.hideLoading()
            let isInBu = res.data.data.exist;
            console.log(1111)
            this.setData({
              isInBu
            })
            this.getBuInfo(options, isInBu)
          }else{
            wx.showToast({
              title: res.data.responseHeader.message,
              icon: 'none'
            })
          }
        })
      } else {
        this.getBuInfo(options, true)
      }
    } else {
      // 天眼查来源 先创建企业
      let comSpInfo = JSON.parse(options.comInfo)
      this.setData({
        comSpInfo
      });
      let param = {};
      param.jfid = this.data.jfid;
      param.buname = comSpInfo.name;
      param.corporate = comSpInfo.legalPersonName;
      param.buildTime = comSpInfo.estiblishTime;
      param.rstCapital = comSpInfo.regCapital;
      this.creat(param);
    }
  },

  getBuInfo(options, isInBu) {
    IdleHttp.request('/mobileapi/bu/getBuInfo', {
      buid: options.buid
    }).then(res => {
      if (res.data.responseHeader.code == 200) {
        this.setData({
          buid: options.buid,
          comBuInfo: res.data.data,
          type: 'bu'
        });
        isInBu ? this.getInfo() : ''
      }
    })
  },
  //创建企业
  creat(param) {
    IdleHttp.request('/mobileapi/bu/saveBizUnit', {
      ...param
    }).then(res => {
      console.log(res)
      if (res.data.responseHeader.code == 200) {
        wx.hideLoading();
        this.setData({
          buid: res.data.data.buid
        })
      } else {
        wx.showToast({
          title: res.responseHeader.message,
          icon: 'none'
        })
      }
    })
  },
  // 加入企业
  join(){
    IdleHttp.request('/mobileapi/bu/applyBuMember',{
      jfId: 2346870110,
      buId: this.data.buid,
      realName: 'GG'
    }).then(res=>{
      if(res.data.responseHeader.code == 200){
        this.onLoad()
      }else{
        wx.showToast({
          title: res.data.responseHeader.message,
          icon: 'none'
        })
      }
    })
  },
  // 获取信息
  getInfo: function() {
    var url = '/mobileapi/bu/getBuAuth'
    var params = {
      buid: this.data.buid
    }
    var that = this
    http.post(url, params, function(res) {
      if (res.responseHeader && res.responseHeader.code == 200) {
        wx.hideLoading()
        const data = res.data || {}
        that.setData({
          auth: data.status
        })
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

    const type = e.currentTarget.dataset.type // 图片类型：营业资质0、身份证正1反2、其他资质3
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
    let params = {
        jfid: this.data.jfid,
        buid: this.data.buid
      },
      files = [],
      urls = []
    var types = []
    // 新文件需要上传：非网络文件
    if (this.data.licenseSrc != '' && this.data.licenseKey == '' && !util.checkUrl(this.data.licenseSrc)) {
      urls.push('/mobileapi/bu/businessLicense')
      files.push(this.data.licenseSrc)
      types.push('license')
    }
    if (this.data.idCardSrc1 != '' && this.data.idCardKey1 == '' && !util.checkUrl(this.data.idCardSrc1) && !this.data.idCardWrong1) {
      urls.push('/mobileapi/bu/idcard')
      params.idCardSide = 'front'

      files.push(this.data.idCardSrc1)
      types.push('front')

    }
    if (this.data.idCardSrc2 != '' && this.data.idCardKey2 == '' && !util.checkUrl(this.data.idCardSrc2) && !this.data.idCardWrong2) {
      urls.push('/mobileapi/bu/idcard')
      params.idCardSide = 'back'
      files.push(this.data.idCardSrc2)
      types.push('back')
    }
    // 处理其他资质图片: 非网络图片需要上传
    this.data.others.forEach((item, index) => {
      if (item != '' && this.data.otherKeys[index] == '' && !util.checkUrl(item)) {
        urls.push('/mobileapi/bu/attachment')
        files.push(item)
        types.push('other,' + index)
      }
    })
    if (files.length == 0) {
      return success && success()
    }
    var that = this;
    console.log(files)
    http.uploadFiles(urls, files, 'uploadFile', params, (results) => {
      var hasError = false,
        errMsg = ''
      results.forEach((res, index) => {
        const type = types[index]
        if (res.responseHeader && res.responseHeader.code == 200) {
          let newData = {}
          if (type == 'license') {
            console.log('营业执照')
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
            newData['idCardKey1'] = res.data.cardFront.idenimgpos;
            newData['idCardInfo1'] = {
              name: res.data.cardFront.fullName || '',
              idNumber: res.data.cardFront.idNumber || '',
            }
          } else if (type == 'back') {
            this.data.idCardKey2 = res.data.cardBack.idenimgrev
            this.data.idCardInfo2 = res.data.cardBack
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
    // if (this.data.type == 'bu') {
    var params = {
      jfid: this.data.jfid,
      buid: this.data.buid,
      name: this.data.idCardInfo1.name,
      idCardNumber: this.data.idCardInfo1.idNumber,
      idCardFrontImage: this.data.idCardKey1,
      idCardBackImage: this.data.idCardKey2,
      buname: this.data.licenseInfo.buname,
      creditCode: this.data.licenseInfo.creditCode,
      registAddr: this.data.licenseInfo.registAddr,
      licimg: this.data.licenseKey,
      attach: this.data.others.join(',') //其它证明材料obs地址多个逗号分隔
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


  // 查看
  check: function(e) {
    wx.navigateBack()
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