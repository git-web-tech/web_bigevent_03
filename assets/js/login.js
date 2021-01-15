$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //自定义校验规则 
    //从layui中获取form对象
    var form = layui.form
    //通过form.verify()函数自定义校验
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //确认密码规则
        //(1)通过形参拿到的是确认密码框中的内容
        //(2)还需要拿到密码框中的内容
        //(3)进行一次等于的判断
        //(4)如果判断失败,return返回一个消息即可
        repwd: function (value) {
            //选择器必须带空格,选择的是后代中的input,name属性值为password的那一个标签
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //提交成功后注册代码
                layer.msg("注册成功,请登录")
                //手动切换到登录表单
                $("#link_login").click();
                //重置form表单
                $("#form_reg")[0].reset()
            }
        });
    })

    //登录功能
    $("#form_login").submit(function (e) {
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                //校验返回状态
                if (res.status !== 0) {
                    return layer.mes(res.message);
                }
                //提示信息,保存token 跳转页面
                layer.msg('跳转成功');
                //保存token 未来接口会使用token
                localStorage.setItem("token", res.token);
                //跳转
                location.href = "/index.html"
            }
        })
    });

})