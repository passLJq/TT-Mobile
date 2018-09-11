$(function (){

    //设置默认获取分类数据页数 1 ，每页内容为 5 条。
    window.page = 1;
    window.size = 5;

    //动态加载数据
    render();

    //添加一级分类时，利用插件进行校验
    $('#form').bootstrapValidator({
        live: 'enabled',//内容有变化就验证
        submitButtons:'[type=submit]',
        message:'',
        feedbackIcons: {//根据验证结果显示的各种图标，bootst的图标
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields : {
            categoryName : {
                validators:{
                    notEmpty: {//检测非空,radio也可用
                        message: '一级分类名不能为空'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e){
        var $form = Back.getSerialize($(e.target).serialize());

        $.ajax({
            url:'/category/addTopCategory',
            type:'post',
            data:$form,
            dataType:'json',
            success:function (data){
                if(data.success == true){
                    //添加成功后，隐藏模态框并重新加载数据
                    $('#addTopCate').modal('hide');
                    render();
                }
            }
        })

    })

});
//动态加载数据到页面
var render = function (){
  getFirstData(function (data){
    $('tbody').html(template('firstData',data));

    //根据data 初始化分页插件
      $('.pagination').bootstrapPaginator({
          bootstrapMajorVersion:3,  // 告知bootstrap的版本
          currentPage:data.page,
          totalPages: Math.ceil(data.total / data.size),   //总条数除每页数量，得出总页数
          numberOfPage:5,
          pageUrl:'javascript:;',
          onPageClicked:function (event, originalEvent, type,page) {
              //获取点击按钮的页码  page 并异步请求渲染数据
              window.page = page;
              render();
          }
      })
  })
};


//获取一级分类数据
var getFirstData = function (callback){
  $.ajax({
      url:'/category/queryTopCategoryPaging',
      type:'get',
      dataType:'json',
      data:{
          page:window.page,
          pageSize:window.size
      },
      success:function (data){
          callback && callback(data);
      }
  })
};
