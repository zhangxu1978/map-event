var service = "Controler.ashx";

function dataAfter(result) {
    if (result == "nosession") {

        return false;
    }
    else if (result == 1 || result == "1") { return true; }
    // else if ((result == 1 || result == "1") && result.msg != undefined) { $.messager.alert('执行结果', result.msg, 'error');return true; }
    else if (result == "0" || result == null || result == "") { return false; }
    else if (result.error != undefined) { layer.alert(result.error, { title: "错误", icon: 2 }); return false; }
    else if (result.error == undefined && result != "nosession") { return true; }
    else { return true; }

}
//ajax 请求getlogin
function toAjaxCRUDCallBack(url, data, callBack) {
    $("#circular").show();
    $.ajax({
        cache: true,
        type: "POST",
        url: url,
        data: data,
        async: true,
        success: function (result) {
            $("#circular").hide();
            if (dataAfter(result)) {
                callBack(result);

            }
        },
        erro: function (err) {
            console.log(err);
        }
    });
}

//载入时执行的第一个程序
function first() {
    var data = {
        action: "getfirst",
        id: 1
    }
    toAjaxCRUDCallBack(service, data, function (result) {
        if (result == 1) {
            $("#dengluzhuangtai").html("已登录")
        
        }
        else {
            $("#dengluzhuangtai").html("未登录")
        }
    })
}
//缓存数据
function setData(div, key, data) {
    $("#" + div).removeData(key);
    $("#" + div).data(key, data);
}
//取出缓存的数据
function getData(div, key) {

    return $("#" + div).data(key) == undefined ? "" : $("#" + div).data(key);
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}



// 自定义弹出框
function openCustomLb(title, width, height, content, callback, cancelback, successCallback) {
    var winheight = $(window).height() - 80;
    if (height > winheight)
        height = winheight;
    var index = layer.open({
        btn: ['提交', '取消'],
        title: title,
        offset: 'lb',
        shade: 0,
        type: 1,
        scrollbar: false,
        // skin : 'layui-layer-rim', // 加上边框
        area: [width + 'px', height + 'px'], // 宽高
        content: content,
        yes: function (index, layero) { // 或者使用btn1
            if (callback)
                eval(callback);
        },
        cancel: function (index, layero) { // 或者使用btn2
            if (cancelback) {
                eval(cancelback);
            }
            layer.close(index);
        }, success: function (layero, index) {
            if (successCallback)
                successCallback(index);
        }
    });

    return index;
}// 自定义弹出框
function openCustomLt(title, width, height, content, callback, cancelback, successCallback) {
    var winheight = $(window).height() - 80;
    if (height > winheight)
        height = winheight;
    var index = layer.open({
        btn: ['提交', '取消'],
        title: title,
        offset: 'lt',
        shade: 0,
        type: 1,
        scrollbar: false,
        // skin : 'layui-layer-rim', // 加上边框
        area: [width + 'px', height + 'px'], // 宽高
        content: content,
        yes: function (index, layero) { // 或者使用btn1
            if (callback)
                eval(callback);
        },
        cancel: function (index, layero) { // 或者使用btn2
            if (cancelback) {
                eval(cancelback);
            }
            layer.close(index);
        }, success: function (layero, index) {
            if (successCallback)
                successCallback(index);
        }
    });

    return index;
}
// 自定义弹出框
function openCustom(title, width, height, content, callback, cancelback, successCallback) {
	var winheight = $(window).height() - 80;
	if (height > winheight)
		height = winheight;
	var index = layer.open({
		btn: ['提交', '取消'],
		title: title,
		type: 1,
		scrollbar: false,
		// skin : 'layui-layer-rim', // 加上边框
		area: [width + 'px', height + 'px'], // 宽高
		content: content,
		yes: function (index, layero) { // 或者使用btn1
			if (callback)
				eval(callback);
		},
		cancel: function (index, layero) { // 或者使用btn2
			if (cancelback) {
				eval(cancelback);
			}
			layer.close(index);
		}, success: function (layero, index) {
			if (successCallback)
				successCallback(index);
		}
	});

	return index;
}
// 自定义弹出框
function openCustomIco(title, width, height, content) {
    var winheight = $(window).height() - 80;
    if (height > winheight)
        height = winheight;
    var index = layer.open({
        title: title,
        type: 1,
        scrollbar: false,
        // skin : 'layui-layer-rim', // 加上边框
        area: [width + 'px', height + 'px'], // 宽高
        content: content,
    });
    return index;
}

//正上方弹出消息
function openAlertTopMsg(content) {
    layer.msg(content, {
        offset: 't',
        anim: 1
    });
}
//弹出窗口
function setDivCenter(div, title, width, height) {

    if (height != undefined && height != null) {
        var index = layer.open({
            type: 1, //page层
            area: [width + 'px', height + 'px'],
            offset: ['100px', '200px'],
            title: title,
            maxmin: true,
            maxWidth: 800,
            scrollbar: false,
            skin: 'layui-layer-molv', //墨绿风格
            shade: 0, //遮罩透明度
            shift: 1, //0-6的动画形式，-1不开启
            content: $("#" + div),
           // zIndex: layer.zIndex, //重点1
            moveOut: true,
           // success: function (layero) {
          //      layer.setTop(layero); //重点2
          //  },
            end: function () { $("#" + div).remove(); }
        });
        $("#" + div).attr("index", index);
    } else {
        var index = layer.open({
            type: 1, //page层
            //  area: [width + 'px', height + 'px'],
            offset: ['100px', '200px'],
            title: title,
            maxmin: true,
            maxWidth: 800,
            scrollbar: false,
            skin: 'layui-layer-molv', //墨绿风格
            shade: 0, //遮罩透明度
            shift: 1, //0-6的动画形式，-1不开启
            content: $("#" + div),
           // zIndex: layer.zIndex, //重点1
            moveOut: true,
        //    success: function (layero) {
         //       layer.setTop(layero); //重点2
        //    },
            end: function () { $("#" + div).remove(); }
        });
        $("#" + div).attr("index", index);
    }
}
//获取随机id
function guid() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}//获取随机id
//弹出登录框
function dengluNext() {
    let id = guid();
    let login = '<div id="' + id + '"><div   style="width:400px;padding:50px 60px"  ><div style="margin-bottom:20px"><input class="am-form-field" placeholder="用户" id="login_user2" /></div>'
        + '  <div style="margin-bottom:20px"><input  type="Password" id="login_pwd2" name="password" class="am-form-field" placeholder="密码" />'
        + '</div > <div style="margin-bottom:20px">'
        + '<a href="#" id="btnlogin2" onclick="relogin()"   class="am-btn am-btn-lg am-btn-primary ">登录系统</a><a  style="margin-left: 10px;" }href="#" id="btnlogin2" onclick="register()"   class="am-btn am-btn-lg am-btn-warning ">新用户注册</a></div></div></div>';

    $("body").append(login);
    ToggleDropdown();
    setDivCenter(id, "登录");
}

//退出系统
function exit() {
    var data = {
        action: "exit"
    }
    toAjaxCRUDCallBack(service, data, function (result) {
        location.reload();
    })
}//退出
//注册
function register() {
    if ($("#login_user2").val() == "" || $("#login_pwd2").val() == "") {
        layer.alert("用户名密码不能为空", { title: "错误", icon: 2 }); return false;
    }
    var data = {
        action: "register",
        user: $("#login_user2").val(),
        pwd: $("#login_pwd2").val()
    }

    toAjaxCRUDCallBack(service, data, function (result) {

        location.reload();

    })
}
//登录
function relogin() {
    if ($("#login_user2").val() == "" || $("#login_pwd2").val() == "") {
        layer.alert("用户名密码不能为空", { title: "错误", icon: 2 }); return false;
    }
    var data = {
        action: "getlogin",
        user: $("#login_user2").val(),
        pwd: $("#login_pwd2").val()
    }

    toAjaxCRUDCallBack(service, data, function (result) {

        location.reload();

    })

}

//定义一个函数，用来显示半透明的提示框
function showTipBox(text, duration) {
    //创建一个div元素，作为提示框
    let tipBox = document.createElement("div");
    //设置提示框的样式
    tipBox.style.position = "fixed"; //固定位置
    tipBox.style.bottom = "25px"; //显示在屏幕下方
    tipBox.style.left = "50%"; //水平居中
    tipBox.style.transform = "translateX(-50%)"; //水平居中
    tipBox.style.width = "90%"; //宽度
    tipBox.style.height = "100px"; //高度
    tipBox.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; //半透明的黑色背景
    tipBox.style.color = "white"; //白色的文字
    tipBox.style.fontSize = "20px"; //字体大小
/*    tipBox.style.textAlign = "center"; //文字居中
    tipBox.style.lineHeight = "100px"; //文字垂直居中*/
    tipBox.style.zIndex =  "99999"; //置于顶层
    //设置提示框的内容，根据传入的参数
    tipBox.innerHTML = text;
    //将提示框添加到文档中
    document.body.appendChild(tipBox);
    //设置提示框的显示时长，根据传入的参数
    setTimeout(function () {
        //移除提示框
        document.body.removeChild(tipBox);
    }, duration);
}



