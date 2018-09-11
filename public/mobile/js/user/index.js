$(function(){

    //获取登录用户信息
    LT.loginAjax({
        url:'/user/queryUserMessage',
        type:'get',
        dataType:'json',
        data:{},
        success:function (data) {
            //将用户信息写入html
            $('#username').html(data.username)
            $('#userPhone').html(data.mobile)
        }
    })

    $('.lt_logout button').on('tap',function (){
        /*LT.loginAjax*/$.ajax({
            url:'/user/logout',
            type:'get',
            dataType:'json',
            data:{},
            success:function (data) {
                if(data.success == true){
                    location.href = LT.loginUrl
                }else{
                    mui.toast('登出失败，请重新尝试!')
                }
            }
        })
    })
})