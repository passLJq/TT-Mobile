$(function() {

  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0006,
    scrollY: true,
    scrollX: false,
    indicators: false
  })

  //获取get的数据
  var search = location.search
    //设置储存proName的变量
  var value = ''
  var params = {
      page: 1,
      pageSize: 4,
      proName: value
    }
    //如果没有get的传值则默认触发mui下拉刷新事件

  //如果有get的传值则替换params中的对应数据并触发mui下拉刷新事件
  if (search) {
    //传过来的get数据是url编码 需要 decodeURI解码
    value = decodeURI(LT.getUrlParams().proName)
      //有传值则替换proName
    params.proName = value
  }
  //点击搜索按钮时
  $('.lt_insearch input[type=button]').on('click', function() {
    if (!$('.lt_insearch input[type=search]').val()) {
      //提示
      mui.toast('搜索框内不能为空！', {
        duration: 'short',
        type: 'div'
      })
    }
    if ($('.lt_insearch input[type=search]').val()) {

      //获取新的数据并替换
      value = $.trim($('.lt_insearch input[type=search]').val())
      params.proName = value
        //把新数据替换至url参数中，避免刷新时跳回
      location.search = '?proName=' + value
    }
  })

  //点击排序按钮，进行排序
  $('.lt_order a').on('tap', function() {
    //点击排序按钮添加样式，并且将箭头朝上
    $(this).addClass('now').parent('li').siblings('li').find('a').removeClass('now')
      //默认箭头朝下，点击切换箭头方向
    if ($(this).find('span').hasClass('lt-icon-up')) {
      $(this).find('span').removeClass('lt-icon-up').addClass('lt-icon-down')
    } else {
      $(this).find('span').removeClass('lt-icon-down').addClass('lt-icon-up')
    }

    //获取排序数据
    var order = $(this).attr('data-order')
    var orderVal = $(this).find('span').hasClass('lt-icon-up') ? 1 : 2

    params[order] = orderVal
      //重新按排序数据渲染商品
    getProData(params, function(data) {
      var proData = template('render_pro', data)
      $('.lt_search_pro ul').html(proData)
    })
  })

  //下拉刷新
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        style: 'circle',
        callback: function() {
          var that = this
          params.page = 1
          getProData(params, function(data) {
            if (!data.data[0]) {
              setTimeout(function() {
                $('.lt_search_pro ul').html('<li>没有查到相关数据!</li>')
                that.endPulldownToRefresh() //关闭加载动画
              }, 500)
            } else {
              setTimeout(function() {
                $('.lt_search_pro ul').html(template('render_pro', data))
                that.endPulldownToRefresh()
                that.refresh(true)
              }, 500)
            }
          })
        }
      },
      up: {
        height: 100,
        contentrefresh: "正在加载更多...",
        contentnomore: '没有更多数据了 >﹏<...',
        callback: function() {
          params.page += 1
          var that = this
          var htmlVal = $('.lt_search_pro ul').html()
          getProData(params, function(data) {
            if (!data.data[0]) {
              setTimeout(function() {
                that.endPullupToRefresh(true) //传入true关闭上拉加载功能
              }, 500)
            } else {
              setTimeout(function() {
                $('.lt_search_pro ul').html(htmlVal + template('render_pro', data))
                that.endPullupToRefresh(false) //传入false，表示还有更多数据
              }, 500)
            }
          })
        }
      }
    }
  })

  //点击商品时跳转，商品详细页
  $('.lt_search_pro').on('tap', 'a', function() {
    location.href = $(this).attr('href')
  })

})

function getProData(params, callback) {
  $.ajax({
    url: '/product/queryProduct',
    type: 'get',
    data: params,
    dataType: 'json',
    success: function(data) {
      callback && callback(data)
    }
  })
}