/*后台公用js*/
window.Back = {};

//用户管理页，主页
Back.indexUrl = '/admin/index.html';
//后台登录页
Back.loginUrl = '/admin/login.html';

// nprogress 进度条

NProgress.configure({showSpinner:false});

$(window).ajaxStart(function(){
    NProgress.start();
});
$(window).ajaxComplete(function(){
    NProgress.done();
});

$(function (){

    //点击隐藏侧边栏
    $('.topBar .fl').on('click',function (){
        $('.index_slide').toggle();
        /*$(this).css('marginLeft','15px');
        $('.main').css('paddingLeft','15px');*/
        $(this).toggleClass('active');
        $('.main').toggleClass('active');
    });
    //点击出现二级分类
    $('.list li').on('click',function (){
        $(this).addClass('now').siblings('li').removeClass('now');
        if($('.list li').eq(1).hasClass('now')){
            $('.child').slideToggle();
        }
    });

    //点击模态框确认按钮 退出登录状态
    $('#logout').on('click',function () {
        $.ajax({
            url:'/employee/employeeLogout',
            type:'get',
            dataType:'json',
            success:function (data) {
                if(data.success == true) {
                    location.href = Back.loginUrl;
                }else {
                    $('#myModal').hide();
                    alert('退出失败，请稍后再试。');
                }
            }
        })
    })
});
//由于jquery的serialize API会对数据进行url编码 所以需要封装公用函数进行解码
Back.getSerialize = function (str){
    var itemArr = str.split('&');
    var params = {};
    itemArr.forEach(function (item,i){
        var arr = item.split('=');
        arr[1] = decodeURIComponent(arr[1]);
        params[arr[0]] = arr[1];
    });
    return params;
};

//根据传入的数据和id，找到数据对象中匹配id的对应数据
Back.getWindowData = function (obj,id){
    var params = {};
    obj.forEach(function (item,i){
        if(item.id == id){
            params = item;
        }
    });
    return params;
};