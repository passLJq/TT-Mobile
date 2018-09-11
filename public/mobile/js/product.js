$(function (){

    //区域滑动初始化
    mui('.mui-scroll-wrapper').scroll({
        scrollY:true,
        scrollX:false,
        indicators: false,
        deceleration: 0.0006
    })


    //获取url传递过来的参数
    var productId = LT.getUrlParams()

    //根据传递的id值 获取并渲染商品数据到页面
    getProData({id:productId.productId},function (data){
        //动态渲染商品数据
        render(data)

        //mui轮播初始化
        var banner = mui('.mui-slider')
        banner.slider({
            interval:2000
        })

        /*数量选择初始化*/
        mui('.mui-numbox').numbox()

        //尺码绑定点击事件
            $('.size span').on('tap',function (){
            $(this).addClass('active').siblings('span').removeClass('active')
        })
        //加入购物车
        $('.join_cart').on('tap',function (){
            //获取选择的尺码数
            var size = $('.size span.active').html()
            //获取选择的数量
            var num = mui('.mui-numbox').numbox().getValue()
            //获取商品id
            var id = productId.productId
            //将数据传入购物车
            LT.loginAjax({
                url:'/cart/addCart',
                type:'post',
                data:{
                    productId:id,
                    num:num,
                    size:size
                },
                dataType:'json',
                success:function (data) {
                    if(data.success == true){
                        location.href = LT.cartUrl
                    }else {
                        mui.toast('服务器繁忙，请稍后再试。')
                    }
                }
            })
        })
    })



})


//获取ajax数据并回调
function getProData (params,callback){
    $.ajax({
        url:'/product/queryProductDetail',
        type:'get',
        data:params,
        dataType:'json',
        success:function (data) {
            callback && callback(data)
        }
    })
}
//渲染模板引擎
function  render(data) {
    $('#main').html(template('productDetail',{data:data}))
}

