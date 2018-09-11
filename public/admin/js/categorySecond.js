$(function () {
    //获取二级分类数据并动态加载到html
    function render() {
        getCartData(function (data) {
            $('tbody').html(template('cateSecond',data));
            //分页插件
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
    }
    render();

    //将一级数据渲染至添加模态框
    getFirstData(function (data){
        $('.dropdown-menu').html(template('cateFirst',data)).on('click','li',function (){
            //点击替换下拉列表的html内容
            var cateName = $(this).find('a').html();
            $('#cateName').html(cateName);
            //将对应一级分类的id给隐藏表单储存
            var cateId = $(this).find('a').attr('data-id');
            $('#cateId').val(cateId);
            //将表单中的对应状态设置为 验证通过
            $('#form').data('bootstrapValidator').updateStatus('cateId','VALID');
        })
    });

    //初始化文件上传插件
    initUpload();

    //点击添加模态框确认按钮 表单插件进行验证
    $('#form').bootstrapValidator({
        live: 'enabled',//内容有变化就验证
        excluded: [],//排除无需验证的控件
        submitButtons:'[type=submit]',
        message:'',
        feedbackIcons: {//根据验证结果显示的各种图标，bootst的图标
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            cateId : {
                validators:{
                    notEmpty: {//检测非空,radio也可用
                        message: '一级分类名不能为空'
                    }
                }
            },
            cateSecondName : {
                validators:{
                    notEmpty: {//检测非空,radio也可用
                        message: '二级分类名不能为空'
                    }
                }
            },
            brandLogo : {
                validators:{
                    notEmpty: {//检测非空,radio也可用
                        message: '必须上传图片'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e){
        e.preventDefault();
        //获取表单序列化数据
        var $data = $(e.target).serialize();
        //将表单序列化数据转化为 obj对象
        var $form = Back.getSerialize($data);

        $.ajax({
            url:'/category/addSecondCategory',
            type:'post',
            data : {
                hot:1,
                categoryId:$form.cateId,
                brandLogo:$form.brandLogo,
                brandName:$form.cateSecondName,
                isDelete:1
            },
            dataType:'json',
            success:function (data){
                if(data.success==true){
                    location.href = location.pathname;
                }
            }
        })
    });
});
//默认获取第1页数据
window.page = 1;
//获取二级分类数据
var getCartData = function (callback) {
    $.ajax({
        url:'/category/querySecondCategoryPaging',
        type:'get',
        dataType:'json',
        data:{
            page:window.page || 1,
            pageSize : 3
        },
        success:function (data) {
            callback && callback(data);
        }
    })
};

//获取一级分类数据
function getFirstData(callback){
    $.ajax({
        url:'/category/queryTopCategoryPaging',
        type:'get',
        dataType:'json',
        data:{
            page:1,
            pageSize : 999
        },
        success:function (data) {
            callback && callback(data);
        }
    })
}
//文件上传插件初始化
var initUpload = function () {
    $('[name="pic1"]').fileupload({
        dataType:'json',
        done:function (e, data) {
            $('#cateImg').attr('src',data.result.picAddr);
            //将brand logo的地址存入隐藏input #brandLogo
            $('#brandLogo').val(data.result.picAddr);
            //将表单中的对应状态设置为 验证通过
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });
};