$(function (){

    window.page = 1;   //页码
    window.size = 5;   //每页显示条数
    window.proData = {}; //储存临时商品数据

    render();   //加载动态渲染商品数据

    renderSecond();//动态加载二级分类信息

    initUpload();//文件上传，初始化

    //点击是否上架取值
    $('#addProduct').on('change','[type="radio"]',function (){
        $('[name="statu"]').val($(this).val());
    });


    //选择获取brandId,
    $('body').on('click','.brandName-menu li',function (){
        var $parent = $(this).parent().parent();
        $parent.find('[name="brandId"]').val($(this).find('a').attr('data-id'));
        $parent.find('#brandName').html($(this).find('a').html());
    });

    //校验form 初始化
    formValidator($('#form'),function (e){
        e.preventDefault();
        var $form = $(e.target);
        var data = $form.serialize();
        picList.forEach(function(item,i){
            data += '&picName'+(i+1)+'='+item.picName+'&picAddr'+(i+1)+'='+item.picAddr;
        });
        $.ajax({
            url:'/product/addProduct',
            type:'post',
            dataType:'json',
            data:data,
            success:function (data){
                if(data.success){
                    //关闭模态框
                    $('#addProduct').modal('hide');
                    //重新渲染数据
                    render();
                    //重置表单
                    $form[0].reset();
                    $form.data('bootstrapValidator').resetForm();
                    //删除预览的img图片
                    $form.find('img').remove();
                    //重置品牌下拉菜单选项
                    $('#brandName').html('请选择');
                }
            }
        })
    });




    //点击编辑
    $('tbody').on('click','.edit',function (){
        var id = $(this).parent().parent().attr('data-id');
        var editData = Back.getWindowData(window.proData,id);
        var modal = ['<div class="modal fade" id="editProduct">',
            '    <div class="modal-dialog modal-md">',
            '        <div class="modal-content">',
            '            <div class="modal-header">',
            '                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>',
            '                <h4 class="modal-title" id="myModalLabel">编辑商品信息</h4>',
            '            </div>',
            '            <div class="modal-body">',
            '                <form action="#" id="editForm" autocomplete="off">',
            '                    <!--二级分类下拉菜单-->',
            '                    <div class="form-group">',
            '                        <div>',
            '                            <div class="dropdown">',
            '                                <input type="hidden" value="'+editData.brandId+'" id="brandId" name="brandId">',
            '                                <label>品牌信息：</label>',
            '                                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">',
            '                                    <span id="brandName">请选择</span>',
            '                                    <span class="caret"></span>',
            '                                </button>',
            '                                <ul class="dropdown-menu brandName-menu">',
            '                                </ul>',
            '                            </div>',
            '                        </div>',
            '                    </div>',
            '                    <div class="form-group">',
            '                        <input type="text" class="form-control" placeholder="请输入商品名称" name="proName" value="'+editData.proName+'">',
            '                    </div>',
            '                    <div class="form-group">',
            '                        <textarea name="proDesc" class="form-control" id="proDesc" cols="30" rows="3" placeholder="请输入商品描述">'+editData.proDesc+'</textarea>',
            '                    </div>',
            '                    <div class="form-group">',
            '                        <input type="number" class="form-control" placeholder="请输入商品库存" name="num" value="'+editData.num+'">',
            '                    </div>',
            '                    <div class="form-group">',
            '                        <input type="number" class="form-control" placeholder="请输入商品价格" name="price" value="'+editData.price+'">',
            '                    </div>',
            '                    <div class="form-group">',
            '                        <input type="number" class="form-control" placeholder="请输入商品原价" name="oldPrice" value="'+editData.oldPrice+'">',
            '                    </div>',
            '                    <div class="form-group">',
            '                        <input type="text" class="form-control" placeholder="请输入商品尺寸" name="size" value="'+editData.size+'">',
            '                    </div>',
            '                    <div class="form-group">',
            '                        是否上架:',
            '                        <input type="radio" class="" name="statuValue" value="1" checked="true">是',
            '                        <input type="radio" class="" name="statuValue" value="0">否',
            '                        <input type="hidden" name="statu" value="'+editData.statu+'">',
            '                    </div>',
            '                </form>',
            '            </div>',
            '            <div class="modal-footer">',
            '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>',
            '                <button id="btnEdit" type="submit" form="editForm" class="btn btn-primary">确认</button>',
            '            </div>',
            '        </div>',
            '    </div>',
            '</div>'].join("");
        $('body').append(modal);
        //加载二级分类品牌信息
        renderSecond();
        $('#editProduct').modal('show');
        //初始化编辑框 校验插件
        formValidator($('#editProduct form'),function (e){
            e.preventDefault();
            $form = $(e.target).serialize();
            $.ajax({
                url:'/product/updateProduct',
                type:'post',
                dataType:'json',
                data:$form,
                success:function (data){
                    if(data.success){
                        alert('修改商品信息成功');
                        //修改成功后 重新加载商品数据,删除表单
                        $('#editProduct').remove();
                        render();
                    }
                }
            })
        })


    })

});


//动态渲染商品数据
function render() {
    getProductData(function (data){
        //将获取的商品数据 存入临时缓存window
        window.proData = data.rows;
        //载入模板引擎
        $('tbody').html(template('productData',data));
        //加载分页插件
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
        });
    })
}

//获取商品数据
function getProductData(callback){
    $.ajax({
        url:'/product/queryProductDetailList',
        type:'get',
        dataType:'json',
        data:{
            page : window.page,
            pageSize : window.size
        },
        success:function (data){

            callback && callback(data);
        }
    })
}
//图片数组，储存图片数据
var picList = [];
function initUpload(){

    $('[name="pic1"]').fileupload({
        dataType:'json',
        done:function (e, data) {
            if(picList.length<3){
                //追加图片，预览
                $(this).parent().parent().append('<img width="100" height="100" src="'+data.result.picAddr+'"/> ');
                //追加信息入数组
                picList.push(data.result);
            }
            //当数组长度为3时，校验成功
            if(picList.length==3){
                $('#form').data('bootstrapValidator').updateStatus('pic','VALID');
            }
        }
    });
}

//获取二级分类信息 用于添加商品表单
function getSecond(callback){
    $.ajax({
        url:'/category/querySecondCategoryPaging',
        dataType:'json',
        type:'get',
        data:{
            page:1,
            pageSize:999
        },
        success:function (data){
            callback && callback(data);
        }
    })
}
//动态加载二级分类信息
function renderSecond(){
    getSecond(function (data) {
        $('.brandName-menu').html(template('FirstData',data));
    })
}

//校验封装
function formValidator(ele,callback){
    //自定义图片数组校验
    $.fn.bootstrapValidator.validators.checkPic = {
        validate:function (validate, $field, options) {
            if(picList.length !=3) return {valid: false, message: '请上传三张图片'};
            return true;
        }
    };
    //对添加商品信息表单进行验证
    ele.bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*设置校验属性*/
        fields: {
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择品牌'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    }
                }
            },
            price:{
                validators: {
                    notEmpty: {
                        message: '请输入商品价格'
                    }
                }
            },
            oldPrice:{
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            size:{
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    }
                }
            },
            pic:{
                validators: {
                    checkPic:{}
                }
            },
            statu:{
                validators: {
                    notEmpty: {
                        message: '请选择上架信息'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e){
        callback && callback(e);
    })
}

//动态表单 添加校验
function addValidator(ele,callback){
    formValidator(ele,callback);
}