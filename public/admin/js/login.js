$(function (){
   $('#login').bootstrapValidator({

       live: 'enabled',//内容有变化就验证
       excluded: [':disabled', ':hidden', ':not(:visible)'],//排除无需验证的控件
       submitButtons:'[type=submit]',
       message:'',
       feedbackIcons:{
           valid: 'glyphicon glyphicon-ok',
           invalid: 'glyphicon glyphicon-remove',
           validating: 'glyphicon glyphicon-refresh'
       },
       fields:{
           username:{
               validators:{
                   notEmpty:{   //检测非空
                       message:'用户名不能为空！'
                   },
                   callback:{   //用户名不存在时调用
                       message:'用户名不存在！'
                   }
               }
           },
           password:{
               validators:{
                   notEmpty:{   //检测非空
                       message:'密码不能为空！'
                   },
                   stringLength: {  //检测长度
                       min: 6,
                       max: 18,
                       message: '长度必须在6-18之间'
                   },
                   callback:{   //密码错误时调用
                       message:'密码错误！'
                   }
               }
           }
       }
   }).on('success.form.bv',function (e){
       e.preventDefault();
       var $username = e.target[1].value;
       var $password = e.target[2].value;
       $.ajax({
           url:'/employee/employeeLogin',
           type:'post',
           dataType:'json',
           data:{
               username:$username,
               password:$password
           },
           success:function (data) {
               console.log(data);
               if(data.success == true){
                   location.href = Back.indexUrl;
               }
               if(data.error == 1000){
                   $('#login').data('bootstrapValidator').updateStatus('username','INVALID','callback');
               }
               if(data.error == 1001){

                   $('#login').data('bootstrapValidator').updateStatus('password','INVALID','callback');
               }
           }
       })

   })


});