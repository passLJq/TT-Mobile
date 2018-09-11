$(function() {

  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0006,
    scrollY: true,
    scrollX: false,
    bounce: true
  });

  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
        auto: true, //可选,默认false.首次加载自动上拉刷新一次
        callback: function() {
          var that = this;
          setTimeout(function() {
            //刷新页面时，自动执行上拉刷新数据
            getCartData(function(data) {
              var list = data.data;
              $('.mui-table-view').html(template('cart', {
                  list: list
                }))
              //将数据存入window中，以便用于编辑时调用数据
              window.proData = data.data
              //重新计算金额
              setAmount()
            });
            that.endPulldownToRefresh()


          }, 1000)
        }
      }
    }
  });
  //绑定编辑商品事件
  $('.mui-table-view').on('tap', '.btn-edit', function() {
    //获取修改的id
    var id = $(this).parent().attr('data-id')
      //通过id获取存入window中的商品数据
    var editData = LT.getWindowProData(window.proData, id)

    //模板引擎渲染
    var html = template('productUpdate', {
        data: editData
      })
      //使用mui的消息提示框功能，传入的消息主体要去除换行符'\n'
    mui.confirm(html.replace(/\n/g, ''), '商品编辑', ['确认', '取消'], function(e) {
      if (e.index == 0) {
        var num = mui('.pro_num .mui-numbox').numbox().getValue()
        var size = $('.pro_edit .pro_size span.now').html()

        LT.loginAjax({
          url: '/cart/updateCart',
          type: 'post',
          data: {
            id: id,
            size: size,
            num: num
          },
          dataType: 'json',
          success: function(data) {
            if (data.success == true) {
              //修改editData 等于修改了window.proData里的数据,
              // 同时修改数据库和缓存在window的数据,不用再次请求数据
              editData.size = size
              editData.num = num
                //成功后出现渲染
              $('.mui-table-view').html(template('cart', {
                list: window.proData
              }));
              mui.toast('编辑成功！')
                //重新计算金额
              setAmount()
            } else {
              mui.toast('系统繁忙，请稍后再试！')
                //重新计算金额
              setAmount()
            }
          }
        })
      }
    });
    //初始化数字控件
    mui('.mui-numbox').numbox()
      //编辑框尺码添加点击事件
    $('.pro_edit .pro_size span').off('tap').on('tap', function() {
      $(this).addClass('now').siblings('span').removeClass('now')
    });
  });
  //删除商品事件
  $('.mui-table-view').on('tap', '.mui-btn-danger', function() {
      console.log(1)
        //获取修改的id
      var id = $(this).parent().attr('data-id')
      var $this = $(this)
        //通过id获取存入window中的商品数据
      var editData = LT.getWindowProData(window.proData, id)
      console.log(window.proData)
      mui.confirm('您是否确认删除？', '商品删除', ['确认', '取消'], function(e) {
        if (e.index == 0) {
          LT.loginAjax({
            url: '/cart/deleteCart',
            type: 'get',
            data: {
              id: id
            },
            dataType: 'json',
            success: function(data) {
              if (data.success == true) {

                // 重新获取数据
                getCartData(function(data) {
                  //删除对应的商品标签
                  $this.parent().parent().remove()

                  var list = data.data
                    //重新将数据传入window,防止编辑商品出现已删除的数据
                  window.proData = data.data
                    //提示信息
                  mui.toast('删除成功！')
                    //重新计算金额
                  setAmount()
                });

              } else {
                mui.toast('系统繁忙，请稍后再试！')
              }
            }
          })
        }
      })

    })
    //    点击商品列表的复选框，计算相应的金额合计

  $('.mui-table-view').on('change', '[type=checkbox]', function() {
    setAmount();
  });

  //生产订单
  $('.lt_cart_order a').on('tap', function() {
    mui.toast('页面正在施工...')
  })
});

function setAmount() {
  //设置订单总金额
  var amountPrice = 0;

  var $checkArr = $('[type=checkbox]:checked');
  $checkArr.each(function(i, item) {
    var price = $(this).attr('data-price');
    var num = $(this).attr('data-num');
    var amount = price * num;

    amountPrice += amount;
  });
  //清除js计算时出现的多余数字
  amountPrice = Math.floor(amountPrice * 100) / 100;
  //将计算出的金额 写入html
  $('#cartAmount').html(amountPrice + '元');
}

function getCartData(callback) {
  LT.loginAjax({
    url: '/cart/queryCartPaging',
    type: 'get',
    dataType: 'json',
    data: {
      page: 1,
      pageSize: 999
    },
    success: function(data) {
      callback && callback(data);
    }
  })
}