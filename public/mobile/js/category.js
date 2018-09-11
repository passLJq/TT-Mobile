$(function() {

  mui(".mui-scroll-wrapper").scroll({
    scrollY: true,
    scrollX: false,
    indicators: false,
    bounce: true,
    deceleration: 0.0006
  })


  //异步获取第一级的分类
  getTopData(function(data) {
    $('.lt_cate_left').find('ul').html(template('firstCate', data))
    var id = data.rows[0].id
    getSecondData({
      id: id
    }, function(data) {
      $('.lt_cate_right').find('ul').html(template('secondCate', data))
    })
  })

  $('.lt_cate_left').on('tap', 'li', function() {
    $('.lt_cate_left').find('li').removeClass('active')
    $(this).addClass('active')
    getSecondData({
      id: $(this).attr('data-id')
    }, function(data) {
      $('.lt_cate_right').find('ul').html('').html(template('secondCate', data))
      if (!template('secondCate', data)) {
        $('.lt_cate_right').find('ul').html('<h3>没有数据</h3>')
      }
    })
  })


  //点击搜索按钮时
  //搜索跳转
  $('.searchBtn').on('click', function() {
    searchPro()
  })


})

function getTopData(callback) {
  $.ajax({
    url: '/category/queryTopCategory',
    type: 'get',
    data: {},
    dataType: 'json',
    success: function(data) {
      callback && callback(data)
    }
  })
}

function getSecondData(params, callback) {
  $.ajax({
    url: '/category/querySecondCategory',
    type: 'get',
    data: params,
    dataType: 'json',
    success: function(data) {
      callback && callback(data)
    }
  })
}

function searchPro() {
  var str = $('.lt_header_search input[type=search]').val()
  if (!str) {
    mui.toast('搜索框内不能为空！', {
      duration: 'short',
      type: 'div'
    })
    $('.mui-toast-container').css('top', '50%')
  } else {
    var url = ''
    url += '?proName=' + str
    location.href = 'http://localhost:3000/mobile/search.html' + url
  }
}