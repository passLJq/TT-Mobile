$(function() {
  $('#btn').on('tap', function() {
    //获取传递过来的返回地址
    var returnUrl = location.search.replace('?returnUrl=', '')
      //获取表单序列化数据，并通过封装好的函数将数据转为对象
    var data = LT.stringToObj($('form').serialize())

    if (!data.username) {
      mui.toast('请输入用户名')
      return false
    }
    if (!data.password) {
      mui.toast('请输入密码')
      return false
    }

    $.ajax({
      url: '/user/login',
      data: data,
      type: 'post',
      dataType: 'json',
      success: function(data) {
        /*如果错误则提示错误信息*/
        if (data.error == 403) {
          mui.toast(data.message)
        }
        //账密正确 则判断是否有返回地址，没有则跳转用户页面
        else if (data.success == true) {
          if (returnUrl) {
            location.href = returnUrl
          } else {
            location.href = LT.userUrl
          }
        } else {
          mui.toast('服务器繁忙，请稍后再试。')
        }
      }
    })
  })

})