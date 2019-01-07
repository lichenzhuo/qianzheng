import {
  config
} from '../../config.js'
// let http=new HTTP()
const img_base_url = 'http://192.168.1.102:907'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码',
    currentTime: 61,
    disabled: false,
    phone: '',
    yanzhengma: '',
    Token: ''
  },
  //获取框内输入数据
  searchValueInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  //获取框内输入数据
  yanzhengmaInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      yanzhengma: e.detail.value
    })
  },
  //获取验证码按钮
  bindButtonTap: function () {
    var that = this;
    wx.request({
      url: config.api_base_url + 'User/GetCode',
      method: 'post',
      data: {
        phone: that.data.phone
      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'BasicAuth ' + that.data.Token
      },
      success: (res) => {
        if(res.data.Code==0){
          console.log('验证码发送成功')
        }else{
          console.log('验证码发送失败')
        }
      }
    })

    that.setData({
      disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      color: '#F8F8F8',
    })
    var phone = that.data.phone;
    var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (phone == '') {
      warn = "号码不能为空";
    } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      warn = "手机号格式不正确";
    } else {
      //当手机号正确的时候提示用户短信验证码已经发送
      wx.showToast({
        title: '短信验证码已发送',
        icon: 'none',
        duration: 2000
      });
      //设置一分钟的倒计时
      var interval = setInterval(function () {
        currentTime--; //每执行一次让倒计时秒数减一
        that.setData({
          text: currentTime + 's', //按钮文字变成倒计时对应秒数
        })
        //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            text: '重新发送',
            currentTime: 61,
            disabled: false,
            color: '#F8F8F8'
          })
        }
      }, 1000);
    };
    //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
    if (warn != null) {
      wx.showModal({
        title: '提示',
        content: warn
      })
      that.setData({
        disabled: false,
        color: '#F8F8F8'
      })
      return;
    };
  },
  //点击提交
  bindphone: function () {
    var  that =this
    console.log(that.data.yanzhengma)
    if(that.data.phone==''){
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空'
      })
    }else{
      wx.request({
        url: config.api_base_url + 'User/BindPhone',
        method: 'post',
        data: {
          phone: that.data.phone,
          code:that.data.yanzhengma
        },
        header: {
          'content-type': 'application/json',
          'Authorization': 'BasicAuth ' + that.data.Token
        },
        success: (res) => {
          console.log(res)
          if(res.data.Code==0){
            wx.showToast({
              title: '绑定手机号码成功',
              icon: 'none',
              duration: 2000
            });
            wx.navigateBack({
              
            })
          }
          else{
            wx.showToast({
              title: '未知错误，绑定失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
         console.log(res)
        that.setData({
          Token: res.data,
        })
      },
    })
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