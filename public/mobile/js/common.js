//设置一个全局对象，方便调用封装函数
window.LT = {}


//登录页
LT.loginUrl = '/mobile/user/login.html'
//购物车页
LT.cartUrl = '/mobile/user/cart.html'
//用户页面
LT.userUrl = '/mobile/user/index.html'


//获取get传过来的参数 ，"?"后面的参数
LT.getUrlParams = function (){
    var params = {}
    var str = location.search
    if(str) {
        str = str.replace('?','')
        var arr = str.split('&')
        arr.forEach(function (item,i){
            var itemArr = item.split('=')
            params[itemArr[0]] = itemArr[1]
        })
    }
    return params
}

//需要验证是否已登录的ajax请求封装
LT.loginAjax = function (params){
  $.ajax({
      url:params.url || '#',
      type : params.type || 'get',
      dataType : params.dataType || 'json',
      data : params.data || '',
      success : function (data){
          if(data.error === 400){
              location.href = LT.loginUrl + '?returnUrl=' + location.href
              return false
          }else {
              params.success && params.success(data)
          }
      },
      error: function (){
          mui.toast('服务器繁忙，请稍后再试。')
      }
  })
}

//将序列化字符串转为对象
LT.stringToObj = function (str){
    var obj = {}
    var arr = str.split('&')
    arr.forEach(function(item,i){
        var itemArr = item.split('=')
        obj[itemArr[0]] = itemArr[1]
    })
    return obj
}

//根据传入的id获取window.proData对应数据
LT.getWindowProData = function(arr,id){
    var obj = {}
    arr.forEach(function (item,i){
        if(item.id==id){
            obj = item
        }
    })
    return obj
}
