$(function(){

    mui('.mui-scroll-wrapper').scroll({
        scrollY:true,
        scrollX:false,
        indicators: false,
        deceleration: 0.0006
    });

    var banner = mui('.mui-slider');
    banner.slider({
        interval:1000
    });

    //搜索跳转
    $('.lt_insearch input[type=button]').on('click',function(){
        var str = $('.lt_insearch input[type=search]').val();
        if(!str){
            mui.toast('搜索框内不能为空！',{ duration:'short', type:'div' })
            $('.mui-toast-container').css('top','50%');
        }else {
            var url = '';
            url += '?proName='+str;
            location.href = 'http://localhost:3000/mobile/search.html' + url;
        }
    })
});
