var service = "Controler.ashx";

function dataAfter(result) {
    if (result == "nosession") {
        let id = guid();
        let login = '<div id="' + id +'"><div   style="width:400px;padding:50px 60px"  ><div style="margin-bottom:20px"><input class="am-form-field" placeholder="用户" id="login_user2" /></div>'
            + '  <div style="margin-bottom:20px"><input id="login_pwd2" name="password" class="am-form-field" placeholder="密码" />'
            +'</div > <div style="margin-bottom:20px">'
            + '<a href="#" id="btnlogin2" onclick="relogin(\'' + id +'\')"   class="am-btn am-btn-lg am-btn-primary ">登录系统</a></div></div></div>';
       
        $("body").append(login);
        setDivCenter(id, "重新登录");
           return false;
    }
    else if (result == 1 || result == "1") { return true; }
   // else if ((result == 1 || result == "1") && result.msg != undefined) { $.messager.alert('执行结果', result.msg, 'error');return true; }
    else if (result == "0" || result == null || result == "") { return false; }
    else if (result.error != undefined) { layer.alert(result.error, { title: "错误",icon: 2 }); return false; }
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

//登录
function login() {
    var data = {
        action: "getlogin",
        user: $("#login_user").val(),
        pwd: $("#login_pwd").val(),
        status:$("#ygselect").val()
    }
    
    toAjaxCRUDCallBack(service, data, function (result){
        location.reload();
    
    })

}
//登录
function relogin(id) {
    //let id = $(this).attr("id");
    var data = {
        action: "getlogin",
        user: $("#login_user2").val(),
        pwd: $("#login_pwd2").val(),
        status: $("#ygselect").val()
    }

    toAjaxCRUDCallBack(service, data, function (result) {
    
        location.reload();

    })

}

//载入时执行的第一个程序
function first() {
    $("#master").hide();
    var data = {
        action: "getfirst",
        id:1
     }
    toAjaxCRUDCallBack(service, data, function (result) {
        if (result==1) {
            if (!$("#divpath").html()) 
                getPath("getpath", "divpath");
           $("#master").show();
        }
        else {
            $("#master").hide();
            $("#login_pwd").val("");
            $("#zx_login").show();
 
            $('#login_pwd').keydown(function (e) {
                if (e.keyCode == 13) {
                    login();
                }
            });
        }
    })
    }
function getPath(action, div) {

    var postdata = {
        action: action
    }
    toAjaxCRUDCallBack(service, postdata, function (data) {
        $("#" + div).empty();
        var result = data[0].data;
        let toolyn = data[0].toolyn;
        if (toolyn == "0") {
            $('#sys_operation').hide();
        }
        result.sort(function (a, b) {
            var value1 = a.parid, value2 = b.parid
            if (value1 === value2) {
                return a.lpos - b.lpos;
            }
            return a.parid - b.parid
        });
        $.each(result, function (i, field) {
            if (result[i].lpath == "1" && result[i].first == "1") {
                $("#leftmenuDiv").append('<li class="admin-parent"><a class="am-cf am-collapsed" data-am-collapse="{target: \'#ul_' + result[i].id + '\'}"><i class="am-icon-' + result[i].ico + '"></i> ' + result[i].chname + '<span class="am-icon-angle-right am-fr am-margin-right" style="transform: rotate(0deg); transform-origin: 50% 50%;"></span></a><ul class="am-list admin-sidebar-sub am-collapse" id=\"ul_' + result[i].id + '\" style="height: 0px;">   </ul></li>');

            }
            if (result[i].lpath == "1" && result[i].first == "0") {
                $("#leftmenuDiv").append(' <li><a  class="am-cf am-c" id=\"path_' + result[i].id + '\"><i class="am-icon-' + result[i].ico + '"></i> ' + result[i].chname + '<span class=" am-fr am-margin-right"></span></a></li>');
            }
        });
        $.each(result, function (j, field) {
            if (result[j].lpath == "2" && result[j].first == "1") {
                $("#ul_" + result[j].parid).append('<li class="admin-parent"><a class="am-cf am-collapsed" data-am-collapse="{target: \'#ul_' + result[j].id + '\'}"><i class="am-icon-'+ result[j].ico + '"></i> ' + result[j].chname +'<span class="am-icon-angle-right am-fr am-margin-right" style="transform: rotate(0deg); transform-origin: 50% 50%;"></span></a><ul class="am-list admin-sidebar-sub am-collapse" id=\"ul_' + result[j].id + '\" style="height: 0px;">   </ul></li>');

            }
            else if (result[j].lpath == "2" && result[j].first == "0") {
                $("#ul_" + result[j].parid).append(' <li><a  class="am-cf am-c" id=\"path_' + result[j].id + '\"><i class="am-icon-' + result[j].ico + '"></i> ' + result[j].chname + '<span class=" am-fr am-margin-right"></span></a></li>');
            }
        })
        $.each(result, function (k, field) {
 
            if (result[k].lpath == "3") {
                $("#ul_" + result[k].parid).append(' <li><a  class="am-cf am-c" id=\"path_' + result[k].id +'\"><i class="am-icon-' + result[k].ico + '"></i> ' + result[k].chname + '<span class=" am-fr am-margin-right"></span></a></li>');
            }
        })
        $.each(result, function (i, field) {
            bindpath(result[i]);
      })


    })
}
//弹出窗口
function setDivCenter(div, title, width, height) {

    if (height != undefined && height != null) {
        var index = layer.open({
            type: 1, //page层
            area: [width + 'px', height+'px'],
            offset: ['100px', '200px'],
            title: title,
            maxmin: true,
            maxWidth: 800,
            scrollbar: false,
             skin: 'layui-layer-molv', //墨绿风格
            shade: 0, //遮罩透明度
            shift: 1, //0-6的动画形式，-1不开启
            content: $("#" + div),
            zIndex: layer.zIndex, //重点1
            moveOut: true,
            success: function (layero) {
                layer.setTop(layero); //重点2
            },
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
            zIndex: layer.zIndex, //重点1
            moveOut: true,
            success: function (layero) {
                layer.setTop(layero); //重点2
            },
            end: function () { $("#" + div).remove(); }
        });
        $("#" + div).attr("index", index);
    }
}
//退出系统
function exit() {
    var data = {
        action:"exit"
    }
    toAjaxCRUDCallBack(service, data, function (result) {
        $("#content").empty();
        $("#tab").empty();
        $("#master").hide();
        $("#zx_login").show();
        $("#login_pwd").val("");
    })
}//退出
//备份数据
function backup() {
    var data = {
        action: "backup"
    }
    toAjaxCRUDCallBack(service, data, function (result) {
      //  $.messager.alert('执行结果', "备份成功", 'info')
        layer.alert("备份成功", { title: "执行结果", icon: 1 });
    })
  
}//备份数据
function rules() {
    var data = {
        action: "rules"
    }
    toAjaxCRUDCallBack(service, data, function (result) {
        layer.alert("成功", { title: "执行结果", icon: 1 });
       // $.messager.alert('执行结果', "成功", 'info')
    })

}//备份数据
//还原数据
function restore() {
    var data = {
        action: "restore"
    }
    toAjaxCRUDCallBack(service, data, function (result) {
      //  $.messager.alert('执行结果', "还原成功", 'info')
        layer.alert("成功", { title: "执行结果", icon: 1 });
    })
    
}//还原数据


//获取随机id
function guid() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}//获取随机id
//根据选择值生成where条件
function sys_eq(eq, a, b) {
    var html = "";
    if (eq == undefined||eq=="") {
        html += a + " = '" + b + "' and ";
    }
    else {
        switch (eq) {
            case "include": html += a + " like '%" + b + "%' and "; break;
            case "ninclude": html += a + " not like '%" + b + "%' and "; break;
            case "equal": html += a + " = '" + b + "' and "; break;
            case "nequal": html += a + " != '" + b + "' and "; break;
            case "dayu": html += a + " > '" + b + "' and "; break;
            case "dayudengyu": html += a + " >= '" + b + "' and "; break;
            case "xiaoyu": html += a + " < '" + b + "' and "; break;
            case "xiaoyudengyu": html += a + " <= '" + b + "' and "; break;
            case "from2": html += a + " like '%" + b + "' and "; break;
            case "from1": html += a + " like '" + b + "%' and "; break;
            case "null": html += a + " is null and "; break;
            case "notnull": html += a + " is not null and "; break;
        }
    }
    return html;
}

$(document).mouseup(function (e) {
    var _con = $("#operlist_div");
    if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
        $("#operlist_div").remove();  // 功能代码
    }
})

function operlist(x, y, id, div) {

    $("#operlist_div").remove();
    let operlist_div = "<div id='operlist_div'  class='clearfix' ><menu id='operlist_div_menu'  class='u-menu u-menu-min z-show'></menu></div>";
    $("body").append(operlist_div);
    let operdata = getData(div, "listConfig").operation;
    if (operdata == "")
        return false;
    operdata.sort(function (a, b) { return a.lpos - b.lpos });
    $.each(operdata, function (i, data) {
        let hide = "";
        if (operdata[i].hide == 1 || operdata[i].batch == 1 ||  operdata[i].operatetype == "oper_type_open"|| operdata[i].operatetype == "5c0808d1f0df488daa96243fe89b2645") { hide = "style='display: none'" }
        $("#operlist_div_menu").append("<li " + hide + "  id='" + operdata[i].id + "'><a><i class='am-icon-" + operdata[i].ico + "'></i>  " + operdata[i].chname + "</a></li>");
        let uitype = operdata[i].uitype;
        if (uitype == "oper_type_ui_0" || uitype == "oper_type_ui_8" || uitype == "2dac247cfc425a6549305783293afc9b" || uitype == "oper_type_ui_4" ) {

            $("#operlist_div_menu [id='" + operdata[i].id + "']").bind('click', function () {
                runOper(operdata[i].id, id, div, uitype, operdata[i].operatetype,"list");
            });
        }
        else {
            $("#operlist_div_menu [id='" + operdata[i].id + "']").bind('click', function () {
                getOperConfig(operdata[i].id, id, div);
            });
        }
    });
    $('#operlist_div_menu').css({ position: 'absolute', top: y + 'px', left: x + 'px', cursor: 'pointer', "z-index": '99999999' });
    let h = $("#operlist_div_menu").outerHeight();
    let w = $(window).outerHeight() + $("body").scrollTop()
    if ((h + y) > w) {
        $('#operlist_div_menu').css({ top: y - h + 'px' })
    }

}


//缓存数据
function setData(div,key, data) {
    $("#" + div).removeData(key);
    $("#" + div).data(key, data);
}
//取出缓存的数据
function getData(div, key) {

    return $("#" + div).data(key) == undefined ? "" : $("#" + div).data(key);
}

function getOneRowById(data, key) {
    var html = "";
    $.each(data, function (i, field) {
        if (data[i].id== key)
             html= data[i];
    })
    return html;
}
function sys_f_analyse(localcard, anal_text) {
    var type = anal_text.substring(4, anal_text.indexOf("("));
    if (type == "val") {
        var val = anal_text.substring(anal_text.indexOf(",") + 1, anal_text.length - 1);
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(","));
        var count = val.lastIndexOf("sys_");
        while (count >= 0) {
            var text = val.substring(count, val.indexOf(")"));

            val = val.replace(text, sys_f_analyse(localcard, text));
            count = val.lastIndexOf("sys_");
        }
        $("#" + localcard + " [name = " + id + "]").val(val);

    }//自动填写某个字段
    else if (type == "index_of") {
        var val = anal_text.substring(anal_text.lastIndexOf(",") + 1, anal_text.length - 1);
        //  alert(val)

        var a = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(","));
        var b = anal_text.substring(anal_text.indexOf(",") + 1, anal_text.lastIndexOf(","));
        var count = val.lastIndexOf("sys_");
        while (count >= 0) {
            var text = val.substring(count, val.indexOf(")"));

            val = val.replace(text, sys_f_analyse(localcard, text));
            count = val.lastIndexOf("sys_");
        }
        return val.substring(a, b);

    }//取得指定长度的字符
    else if (type == "field") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        return $("#" + localcard + " [name = " + id + "]").val();
    }//返回字段的值
    else if (type == "now") {
        var format = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        if (format == "") {
            return laydate.now(0, 'YYYY-MM-DD hh:mm:ss');
        }
        else {
            return laydate.now(0, format);
        }
    }//返回时间
    else if (type == "today") {
        var today = new Date();
        today.setDate(today.getDate());
        return today.format("yyyy-MM-dd");
        /*
        var format = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        if (format == "") {
            return laydate.now(0, 'YYYY-MM-DD');
        }
        else {
            return laydate.now(0, format);
        }*/
    }//返回日期
    else if (type == "addtoday") {
        var format = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        if (format != "") {
            return laydate.now(format, 'YYYY-MM-DD');
        }

    }//返回日期
    else if (type == "date_elem") {
        var elem = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        return "elem:" + elem + ",";
    }
    else if (type == "grouphide") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        $("#" + localcard + id).hide();
    }//隐藏分组
    else if (type == "groupshow") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        $("#" + localcard + id).show();
    }//显示分组
    else if (type == "label") {
        var val = anal_text.substring(anal_text.indexOf(",") + 1, anal_text.length - 1);
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(","));
        $("#" + localcard + " [id = " + id + "]").textbox({ label:val})
    }//改变标签名称
    else if (type == "mustinput") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        $("#" + localcard + " [id = " + id + "]").textbox({ required: true});
    }//设置必填
    else if (type == "nomustinput") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        $("#" + localcard + " [id = " + id + "]").textbox({ required: false });
    }//取消必填
    else if (type == "nosubmit") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        $("#" + localcard + " [id = " + id + "]").textbox("disable");
       
    }//元素禁止
    else if (type == "yessubmit") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        $("#" + localcard + " [id = " + id + "]").textbox("enable");
    }//元素激活
    else if (type == "readonly") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        $("#" + localcard + " [id = " + id + "]").textbox("readonly", true);
    }//元素只读
    else if (type == "deletereadonly") {
        var id = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        $("#" + localcard + " [id = " + id + "]").textbox("readonly", false);
    }//只读取消
    else if (type == "control") {
        let ids = anal_text.substring(anal_text.indexOf("(") + 1, anal_text.indexOf(")"));
        let mid = ids.substring(0, ids.indexOf(","));
        let sid = ids.substring(ids.indexOf(",") + 1, ids.length);
        let group = getData(localcard, "operConfig").group;
        let enumData;
        $.each(group,function (i, d) {
            if (d.type == "group_0")
                $.each(d.field, function (j,fd) {
                    if (fd.id == mid) {
                        enumData = fd.field_enum;
                    }
                })
        })

        let t = $("#" + localcard + " [id=" + mid + "]");
        let newdata = [];
        $.each(enumData, function (i, d) {
            let v = d.value;
            if (v&&v.indexOf(sid) >-1)
                newdata.push(d);
        })
       
        t.combobox({ data: newdata, panelHeight: "auto" });
        t.combobox('readonly', true);
        t.combobox('readonly', false);
     
    }//只读取消
}

function createBtn(div, data)
{
    let classbtn = "am-btn";
    var id = data.id == undefined || data.id == null ? "" : data.id;
    var dataid = data.dataid == undefined || data.dataid == null ? "" : data.dataid;
    var text = data.text == undefined || data.text == null ? "" : data.text;
    var ico = data.ico == undefined || data.ico == null ? "" : data.ico;
   // var color = data.color == undefined || data.color == null ? "#f3f3f3" : data.color;
    if (data.ui == "oper_type_ui_8" || text.indexOf("删除") > -1) classbtn += " am-btn-danger ";
    else if (data.ui == "danger") classbtn += " am-btn-danger "
    else if (data.ui == "Save") classbtn += " am-btn-success "
    if (data.type == "tool") classbtn += " am-btn-xs am-btn-primary";
    else if (data.type == "search") classbtn += " am-btn-primary";
    else classbtn += " am-btn-xs am-btn-default";
    $("#" + div).append('<button  id="' + id + '" dataid="' + dataid + '"   class="' + classbtn + '"  ><i class="am-icon-' + ico + '"></i>' + text.substring(0, 2) + '</button >');
    if (text.length > 2) {
        $('#' + id).popover({
            content: text,
            trigger: 'hover'
        })
    }

}

function validate(div, obj, verify) {
    var erro = "";
    for (var i = 0; i < obj.length; i++) {
        let type = obj[i].type;
        if (type == "group_0") {
            let col = obj[i].field;
            for (var j = 0; j < col.length; j++) {
                if ($("#" + div + " [id='" + col[j].id + "']").attr("required"))
                    erro += $("#" + div + " [id='" + col[j].id + "']").val()!="" ?"": col[j].chname + "不能为空;";
            }
        } else if (type == "group_1") {
            let field = obj[i].field;
            let rowData = $("#" + div + i).datagrid("getRows");
            $.each(rowData, function (b, row) {
                $('#' + div + i).datagrid('endEdit', b);
            })
            let rowDatas = $("#" + div + i).datagrid("getRows");
            $.each(rowDatas, function (b, row) {
 
                $.each(field, function (a, d) {

                    if (d.lnull == 0 && row[d.id] == "")
                        erro += "第"+(b+1)+"行"+d.chname + "不能为空;";
                })
                
            })
        }

    }
     if (verify != undefined && verify != "") {
        $.each(verify, function (t, da) {
            var analyse = verify[t].program
            var count = analyse.indexOf("sys_");
            while (count != -1) {
                //analyse.replace(/\"/g, "")
                var anal_text_end = analyse.substring(0, analyse.indexOf(")") + 1);
                var anal_text = anal_text_end.substring(anal_text_end.lastIndexOf("sys_"), anal_text_end.length);
                var bbb = sys_f_analyse(div, anal_text);

                var analyse = analyse.replace(anal_text, bbb);

                count = analyse.indexOf("sys_");
                if (count == -1) {
                    var aaa = "\"" + analyse.substring(0, analyse.length - 1) + "\"";
                    if (aaa.indexOf("<=") == -1 && aaa.indexOf("<=") == -1) {
                        aaa = aaa.replace("==", "\"==\"").replace(">", "\">\"").replace("<", "\"<\"").replace("<>", "\"<>\"").replace("!=", "\"!=\"");

                    }
                    else {
                        aaa = aaa.replace("<=", "\"<=\"").replace(">=", "\">=\"");

                    }
                    if (eval(aaa)) {
                        hgwb = verify[t].chname + "\n";
                    } else {

                        bhgwb = verify[t].chname + "\n";
                    }
                }
            }
            if (bhgwb != "") {
                var cl = verify[t].notnorm;
                if (cl == "654b1ed30c889aebd66cd506679160e9") {
                    var r = confirm(bhgwb);
                    if (r == true) { bhgwb = ""; } else { b = 0 }
                }
                else if (cl == "769cb9b150afb848f522d34e62f476fa") {
                    alert(bhgwb); b = 0
                }
                else {
                    bhgwb = "";
                }
            }
            else if (hgwb != "") {
                var cl = verify[t].norm;
                if (cl == "654b1ed30c889aebd66cd506679160e9") {
                    var r = confirm(hgwb);
                    if (r == true) { hgwb = ""; } else { b = 0 }
                }
                else if (cl == "769cb9b150afb848f522d34e62f476fa") {
                    alert(hgwb); b = 0
                }
                else {
                    hgwb = "";
                }
            }
        })

    }
    if (erro == "")
        return true;
    else {
        layer.alert(erro, { title: "错误",icon: 2 });

        return false;
    }
}


function rgb() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var rgb = 'RGB(' + r + ',' + g + ',' + b + ')';
    return rgb;
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/********************************上传与导入***********************************************/
function updata(div, mulu,  regex,topDiv) {
 
    var filename = $("#t" + div).textbox('getValue');
    if (filename != "") {
        $("#i" + div).linkbutton('disable');
        var refer3 = filename.substring(filename.lastIndexOf("\\") < 0 ? 0 : (filename.lastIndexOf("\\") + 1), filename.length);
        var houzhui = refer3.substring(refer3.lastIndexOf("."), refer3.length);
        if (regex.indexOf(houzhui) != -1) {
            $("#" + div).append("<i id='ico" + div + "' class='am-icon-spinner fa-spin fa-lg'></i>");
            var fd = new FormData();
            fd.append("upload", 1);
            fd.append("upfile", $("#" + div + " [type='file']").get(0).files[0]);
            $.ajax({
                url: "Controler.ashx?action=updata&mulu=" + mulu +  "&rd=" + new Date().getTime(),
                type: "POST",
                processData: false,
                contentType: false,
                data: fd,
                success: function (d) {
                    if (dataAfter(d)) {
                        $("#ico" + div).remove();
                        let wc = $("#wc" + topDiv).text() == "" || $("#wc" + topDiv).text() == undefined ? 0 : $("#wc" + topDiv).text();
                        $("#wc" + topDiv).text(parseInt(wc) + 1);
                        $("#" + div).append("<i class='am-icon-check fa-lg'></i>");
                        $("#wcValue" + div).val(d.data);
                    }
                }
            });
        }
        else {
           // $.messager.alert('错误', "禁止上传此类文件", 'error') 
            layer.alert("禁止上传此类文件", { title: "错误", icon: 2 });
        }
    }
    else {
       // $.messager.alert('错误', "请选择文件", 'error') 
        layer.alert("请选择文件", { title: "错误", icon: 2 });

    }



}
function updataForInput(div, mulu, regex, topDiv, operId) {

    var filename = $("#t" + div).textbox('getValue');
    if (filename != "") {
        $("#i" + div).linkbutton('disable');
        var refer3 = filename.substring(filename.lastIndexOf("\\") < 0 ? 0 : (filename.lastIndexOf("\\") + 1), filename.length);
        var houzhui = refer3.substring(refer3.lastIndexOf("."), refer3.length);
        if (regex.indexOf(houzhui) != -1) {
            $("#" + div).append("<i id='ico" + div + "' class='am-icon-spinner fa-spin fa-lg'></i>");
            var fd = new FormData();
            fd.append("upload", 1);
            fd.append("upfile", $("#" + div + " [type='file']").get(0).files[0]);
            $.ajax({
                url: "Controler.ashx?action=updataForInput&mulu=" + mulu + "&opid=" + operId + "&rd=" + new Date().getTime(),
                type: "POST",
                processData: false,
                contentType: false,
                data: fd,
                success: function (d) {
                    if (dataAfter(d)) {
                        $("#ico" + div).remove();
                        let wc = $("#wc" + topDiv).text() == "" || $("#wc" + topDiv).text() == undefined ? 0 : $("#wc" + topDiv).text();
                        $("#wc" + topDiv).text(parseInt(wc) + 1);
                        $("#" + div).append("<i class='am-icon-check fa-lg'></i>");
                        $("#wcValue" + div).val(d.data);
                    }
                }
            });
        }
        else {
          //  $.messager.alert('错误', "禁止上传此类文件", 'error')
            layer.alert("禁止上传此类文件", { title: "错误", icon: 2 });
        }
    }
    else {
       // $.messager.alert('错误', "请选择文件", 'error')
        layer.alert("请选择文件", { title: "错误", icon: 2 });
    }



}
function imput(fileid, table, div) {
    var drbj = $("#impt_drbj").val(); var zx = 1;
    if (drbj == "") {
        var r = confirm("导入标记为空，确定导入吗？");
        if (r != true) { zx = 0; }
    }
    if (zx == 1) {
        if ($("#" + div).attr("wc") != 1 && $("#t" + div).val() != "") {
            var regex = $("#idiv_updata").attr("accept");

            var filename = $("#tdiv_updata").val();
            var refer3 = filename.substring(filename.lastIndexOf("\\") < 0 ? 0 : (filename.lastIndexOf("\\") + 1), filename.length);
            var houzhui = refer3.substring(refer3.lastIndexOf("."), refer3.length);

            if (regex.indexOf(houzhui) != -1) {
                $("#" + div).append("<i id='ico" + div + "' class='am-icon-spinner fa-spin fa-lg'></i>");
                var modelid = $("#updata_model").val();
                var fd = new FormData();
                fd.append("upload", 1);
                fd.append("upfile", $("#" + fileid).get(0).files[0]);
                $.ajax({
                    url: "Handler.ashx?action=imput&drbj=" + drbj + "&modelid=" + modelid + "&tablename=" + table + "&rd=" + new Date().getTime(),
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: fd,
                    success: function (d) {
                        if (dataafter(d)) {
                            $("#l" + div).hide();
                            $("#ico" + div).hide();
                            $("#" + div).attr("wc", 1);
                            $("#" + div).append("<i class='am-icon-check fa-lg'></i>");
                        }
                    }
                });
            }
            else {
                alert("禁止上传此类文件")
            }
        } else { alert("已导入成功，不必再次导入") }

    }



}
//导入
function updataFileForInput( mulu,div, regex,operId) {
    let tid = guid();
    let zb = $("#zb" + div).text() == "" || $("#zb" + div).text() == undefined ? 0 : $("#zb" + div).text();
    $("#zb" + div).text(parseInt(zb) + 1);
    $("#" + div).append("<div id='" + tid + "'><input  class='text' id=\"t" + tid + "\" /><input type='hidden' id='wcValue" + tid + "' ></div>");
    let upDataBtn = {
        id: "i" + tid,
        ico: "upload",
        color: "#f3f3f3",//"#1E9FFF",
        text: "导入"
    }
    createBtn(tid, upDataBtn);
    $("#i" + tid).bind('click', function () {
        updataForInput(tid, mulu, regex, div, operId);

    });
   
    $("#" + tid + " [id=t" + tid + "]").filebox({
        buttonText: "选择文件",
        buttonIcon: 'am-icon-folder-open-o',
        buttonAlign: 'left',
        accept: regex,
        width: '70%',

    })
}
//文件上传 lx=1 多文件上传 lx=0单文件上传2导入 
function updata_file(lx, fanhuiid, mulu, id, table, div, regex) {
    let newWindow = guid();
    //构建div
    $("body").append("<div id='" + newWindow + "' ></div>");
    if (lx == 1) {
        let upAdd = {
            id: "upAdd" + newWindow,
            ico: "plus",
            color: "#f3f3f3",//"#1E9FFF",
            text: "添加"
        }
        createBtn(newWindow, upAdd);
        let upSave = {
            id: "upSave" + newWindow,
            ico: "save",
            color: "#f3f3f3",//"#1E9FFF",
            text: "确定"
        }
        createBtn(newWindow, upSave);
   
            $("#upSave" + newWindow).after("<span>准备上传:</span><span  id='zbupAdd" + newWindow + "' /></span><span>  已完成:</span><span id='wcupAdd" + newWindow + "' /></span>");
            $("#upAdd" + newWindow).bind('click', function () {
                updata_add( mulu, "upAdd"+newWindow, regex);
            });
            $("#upSave" + newWindow).bind('click', function () {
                let zb = $("#zbupAdd" + newWindow).text() == "" || $("#zbupAdd" + newWindow).text() == undefined ? 0 : $("#zbupAdd" + newWindow).text();
                let wc = $("#wcupAdd" + newWindow).text() == "" || $("#wcupAdd" + newWindow).text() == undefined ? 0 : $("#wcupAdd" + newWindow).text();
                if (wc == zb && wc > 0) {
                    let arrShow = [];
                    $("#" + newWindow).find(":input[type=hidden]").each(function () {
                        if ($(this).val() != "")
                            arrShow.push($(this).val());
                    })
                    goBackToInputUpdata(div, fanhuiid, arrShow, newWindow);
                } else {

                   // $.messager.alert('错误', "有未上传文件不能保存", 'error');
                    layer.alert("有未上传文件不能保存", { title: "错误", icon: 2 });
                }

            });
            updata_add( mulu, "upAdd" +newWindow, regex);
            setDivCenter(newWindow, "上传文件", 500)

    } else if (lx == 0) {
        let upAdd = {
            id: "upAdd" + newWindow,
            ico: "plus",
            color: "#f3f3f3",//"#1E9FFF",
            text: "添加"
        }
        createBtn(newWindow, upAdd);
        $("#upAdd" + newWindow).hide();
        updata_add( mulu, "upAdd" +newWindow, regex);
        setDivCenter(newWindow, "上传文件", 500)
    }


}
function updata_add( mulu, div, regex) {
    let tid = guid();
    let zb = $("#zb" + div).text() == "" || $("#zb" + div).text() == undefined ? 0 : $("#zb" + div).text();
    $("#zb" + div).text(parseInt(zb) + 1) ;
    $("#" + div).after("<div id='" + tid + "'><input  class='text' id=\"t" + tid + "\" /><input type='hidden' id='wcValue" + tid + "' ></div>");
    let upDataBtn = {
        id: "i" + tid,
        ico: "upload",
        color: "#f3f3f3",//"#1E9FFF",
        text: "上传"
    }
    createBtn(tid, upDataBtn);
    $("#i" + tid).bind('click', function () {
        updata( tid, mulu,  regex,div);
        
    });
    let delUpDataBtn = {
        id: "d" + tid,
        ico: "times-circle-o",
        color: "#f3f3f3",//"#1E9FFF",
        text: "删除"
    }
    createBtn(tid, delUpDataBtn);
    $("#d" + tid).bind('click', function () {
       
        zb = $("#zb" + div).text() == "" || $("#zb" + div).text() == undefined ? 0 : $("#zb" + div).text();
        $("#zb" + div).text(parseInt(zb) - 1);
        let wc = $("#wc" + div).text() == "" || $("#wc" + div).text() == undefined ? 0 : $("#wc" + div).text();
        if ($("#wcValue" + tid).val() != undefined && $("#wcValue" + tid).val() != "") $("#wc" + div).text(parseInt(wc) - 1);
        $("#" + tid).remove();
    });
    $("#" + tid + " [id=t" + tid + "]").filebox({
        buttonText: "选择文件",
        buttonIcon: 'am-icon-folder-open-o',
        buttonAlign: 'left',
        accept: regex,
        width: '70%',

    })
}
function downfile(path, name) {
    var curWwwPath = window.document.location.href
    var path1 = curWwwPath.substring(0, curWwwPath.indexOf(window.document.location.pathname));
    window.open(path1 + "/" + path.replace(/\#/g, "/") + name)
}
function openurl(container,name) {
    let curWwwPath = window.document.location.href;
    curWwwPath = curWwwPath.substring(0, curWwwPath.indexOf("index"));
    let url = curWwwPath.replace(/\#/g, "") + "consys/html/" + name;
    $("#" + container).panel({
        modal: true,
        content: "<iframe scrolling='auto' frameborder='0' src='" + url+"' style='width:100%; height:100%; display:block;'></iframe>"
    });  // 打开panel
 

}
function click_one(id, div) {

    $("#" + div + " [id='" + id + "']").click();
}

function editpwd(newWindow) {
    if (!newWindow) {
        newWindow = guid();
        $("body").append('<div id="' + newWindow + '" style="text-align:center"></div>');
        $("#" + newWindow).append('<input class="am-form-field" type="Password" placeholder="输入新密码" id="pwd1" style="margin: 10px;" ><input class="am-form-field" type="Password" placeholder="再次输入新密码" id="pwd2" style="margin: 10px;">');
        $("#" + newWindow).append('<a  href="#" class="am-btn am-btn-lg am-btn-primary" onclick=editpwd("' + newWindow + '") >修改密码</a>');
        setDivCenter(newWindow, "修改密码", 460);
       
    } else {
       
        let pwd1=$("#" + newWindow + " [id=pwd1]").val();
        let pwd2 = $("#" + newWindow + " [id=pwd2]").val();
        if (pwd1 == "" || pwd2 == "") {
            //$.messager.alert('错误', "密码不能为空", 'error');
            layer.alert("密码不能为空", { title: "错误", icon: 2 });
            return false;
        }
        if (pwd1 != pwd2) {
          //  $.messager.alert('错误', "两次输入的密码不一致", 'error');
            layer.alert("两次输入的密码不一致", { title: "错误", icon: 2 });

            return false;
        }
        else {
            let data = {
                action: "editpwd",

                pwd: $("#" + newWindow + " [id=pwd1]").val()
    
            }

            toAjaxCRUDCallBack(service, data, function (result) {
              //  $.messager.alert('执行结果', "修改成功", 'info');
                layer.alert("修改成功", { title: "执行结果", icon: 1 });
                layer.close($("#" + newWindow).attr("index"));
              //  $("#" + newWindow ).close('destroy');//销毁
            })
        }
    }
 
}

function isFatField(type) {
    return type == "string1" || type == "string2" || type == "9053dbd845b67d7d15b10c2f482e4723" || type == "ebe653a2e0281e795959923808216446" ? true : false;
}

function goBackToInputUpdata(div, fanhuiid, arrShow, newWindow) {
    let t = $("#" + div + " [id='" + fanhuiid + "']");
    let pathLoad=t.tagbox("options").pathLoad;
    t.tagbox({
        value: arrShow,
        tagFormatter: function (value, row) {
            let fileName = value.substring(value.indexOf("$") + 1, value.length);
            let urlFile = value.substring(0, value.indexOf("$")) + fileName.substring(fileName.indexOf("."), fileName.length);
            return fileName + "<i class='am-icon-download' onclick=\"downfile('" + pathLoad.substring(0, pathLoad.length - 1) + "','" + urlFile + "')\"></i>"
        }
    });
    $("#" + newWindow).window('destroy');
}

var getDataComplay = false;
function createCalendar(r) {
    let carryondiv = $("#tab").tabs("getSelected").attr("id"); 
    let div = $("#" + carryondiv).attr("calendarId");
    let id = $("#" + carryondiv).attr("calendarOperid")
    if (getDataComplay||r) {
        getDataComplay = false;
        let where = "";
        if (!r) {
            let title = $("#" + div + " .calendar-title .calendar-text").html();
            let nian = title.substring(title.indexOf(" ") + 1);
            let yue = getMonthForListWhere(title.substring(0, title.indexOf(" ")));
             where = nian + yue;
        }
        let postData = {
            action: "getStableData",
            opid: id,
            where: where
        }
        toAjaxCRUDCallBack(service, postData, function (result) {
            let data = result.data;
            let obj = result.calendar;
            $("#" + div + " .event-count-top").remove();
            $("#" + div + " .event-count-bottom").remove();

            $.each(data, function (i, d) {
                let v = d[obj.stateId];
                let nyr = d[obj.idField];
                let n = nyr.substring(0, 4), y = nyr.substring(nyr.indexOf("-") + 1, nyr.lastIndexOf("-")), r = nyr.substring(nyr.lastIndexOf("-") + 1);
                let attr = n + "," + Number(y) + "," + Number(r);
                if (v == obj.topValue) {
                    $("#" + div + " [abbr='" + attr + "'] ").prepend("<a class='event-count-top'>" + d["c"] + "</a>");
                } else if (v == obj.botValue) {
                    $("#" + div + " [abbr='" + attr + "'] ").append("<a class='event-count-bottom'>" + d["c"] + "</a>");
                }

            })
            getDataComplay = true;
            calendarId = id;
        })
    }


}

function stable(operid,div) {
    let postData = {
        action: "stableConfig",
        opid: operid
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
   
            let stable = result.stable,stablemx = result.stablemx; 
            stablemx.sort(function (a, b) { return a.lpos - b.lpos });
        var zk = 0; var zl = 0; var left = 0; var nleft = 0;
     
        let program = stable.program, sub_c = stable.subIdForC; subid = stable.subId;
   
            $.each(stablemx, function (i, d) {
                if (stablemx[i].width != 0 && stablemx[i].height != 0) {
                    var wwidth = $(window).width(); var wheight = $(window).height();
                    var width = stablemx[i].width * 100 / stable.width
                    var high = stablemx[i].height * 100 / stable.height
                    var height = (parseInt(wheight) - 100) * stablemx[i].height / stable.height;
                    var position = "";
                    left = nleft;

                    if (i == 0) { zl = high }
                    if (width + zk < 100) {
                        position = "absolute";  nleft = (parseInt(wwidth) - 200) * (width + zk) / 100; zk += width; zl = (zl > high) ? zl : high;
                    }
                    else { position = "relative"; zk = 0; if (high < zl) { nleft = left; zl = 0; } else { nleft = 0 } }
                    let html = '<div id="' + div + i + '" style="float: left";left:' + left + 'px;position:' + position + ';><div  class="easyui-panel" title="' + d.chname + '" data-options="collapsible:true,collapsed:true" style="width:100%;height:auto;padding:10px;">'
                    html += "<div id='f" + div + i + "'></div></div><div  id='c" + div + i + "' style='width: " + (parseInt(wwidth) - 200) * width * 0.01 + "px; height: " + height + "px; border: 1px solid #EBEBEB' ></div></div>"
                    $("#" + div).append(html)
                    if (sub_c.indexOf(d.id) != -1) {
                        switch (d.deskenum) {
                            case "f2c698f5fa10fcf4ada373a1e4f3f239": createListForStable(d.operid, div + i, ""); break;
                            case "c76161b0507a0b4cb8cc32c354a17125": getOperConfig(d.operid, program, div + i); break;
                            case "12f953a5141eefe744ca0ccc5a95ad8b": report(d.operid, obj.chname, div + i); break;
                            case "d32e70e41411645d937b1c76a7475256": createchart(d.operid, obj.chname, div + i); break;
                                
                            case "6b7deb0524044f3498e4f32b185d87ee":
                                let newId = guid();
                                let programArry = program.split(";");
                                $("#" + div).attr("calendarId", "c" + div + i);
                                $("#" + div).attr("calendarOperid", d.id);
                                $("#" + "c" + div + i).append("<div id='" + newId + "' class='easyui-calendar' data-options='fit:true,forTable:true'></div>")
                                $("#" + newId).calendar({
                                    onSelect: function (date) {
                                        for (let a=0; a < programArry.length; a++) {
                                            if (programArry[a] != "") {
                                                let prog = programArry[a];
                                                let c = prog.substring(prog.indexOf("index:")+6);
                                                let tablemxForC = stablemx[c];
                                                let fieldName = prog.substring(10, prog.indexOf("index:")-1);
                                                let where = " convert(char(10),v." + fieldName + ",120)='"+new Date(date).format("yyyy-MM-dd")+"'"; 
                                                switch (tablemxForC.deskenum) {
                                                    case "f2c698f5fa10fcf4ada373a1e4f3f239": createListForStable(tablemxForC.operid, div + c, where); break;
                                                }
                                            }
                                        }
                                    }
                                })
                                createCalendar(true);
                                break;
                        }
                    }
 


                }

            }

        )
        $.parser.parse($("#" + div));

        
    })

}
function getTabId() {
    return $("#tab").tabs("getSelected").attr("id"); 
}
function getMonthForListWhere(yue) {
    switch (yue) {
        case "一月": return "-01-01";
        case "二月": return "-02-01";
        case "三月": return "-03-01";
        case "四月": return "-04-01";
        case "五月": return "-05-01";
        case "六月": return "-06-01";
        case "七月": return "-07-01";
        case "八月": return "-08-01";
        case "九月": return "-09-01";
        case "十月": return "-10-01";
        case "十一月": return "-11-01";
        case "十二月": return "-12-01";
    }
  
}

function bindpath(obj) {
    $("#path_" + obj.id).bind("click", function () {
        if (obj.em != "path_type_2")
            var container = addTab(obj.chname, obj.em, obj.ico);
            switch (obj.em) {
                case "path_type_1": createList(obj.operid, container, ""); break;
                case "path_type_2": getOperConfig(obj.operid, "", ""); break;
                case "path_type_3": report(obj.operid, container, ""); break;
                case "path_type_10": tubiao_ui(obj.operid, container); break;
                case "path_type_11": stable(obj.operid, container); break;
                case "path_type_4": stable(obj.operid, container); break;
                case "path_type_5": $("#" + container).empty().append(obj.link).show(); break;
                case "cc145ef607e142f2bf15c1468e08eb67": openurl(container, obj.link); break;
            }

        

    });
}//绑定导航单击事件


    var tabCounter = 0;


function addTab(name, em, ico) {
    let id = guid();
    let html = "";
    switch (em) {
        case "path_type_1":
            html += '<div class="admin-content-body" >'
            html += "<div  class='am-g am-form-inline'  ><div  class='am-u-md-4 am-btn-toolbar' id='t" + id + "'></div><div id='f" + id + "'  class='am-u-md-8' style='width: auto; float: right;'></div></div><div  id='c" + id + "'>	<table width='100%'     class='am-table am-table-striped am-table-hover table-main am-text-nowrap'  id = 'table"+id+"' ></table ></div></div>"
            break;
        case "path_type_11":
            html = "<div  id='" + id + "' style = 'float:left;'  ></div>"
            break;
        case "path_type_2":
            html += '<div  id="f' + id + '"  class="am-btn-toolbar" style="width:100%;height:auto;margin-bottom: 5px;"> </div><div  class="am-panel-group" id="c' + id + '"></div>';
            break;
        case "path_type_3":
            html += '<div   style="width:100%;height:auto;"><div title="搜索栏"  style="overflow:auto;padding:10px;">'
            html += "<div id='f" + id + "'  ></div></div></div><div  id='c" + id + "'></div>"
            break;
        case "path_type_5":
            html = "<div  id='c" + id + "' ></div>";
            break;
        case "cc145ef607e142f2bf15c1468e08eb67":
            html = "<div  id='c" + id + "' ></div>";
            break;
        default:
            html = "<div  id='c" + id + "' ></div>";
            break;

    }
    
    var $tab = $('#doc-tab-demo-1');
    var $nav = $tab.find('.am-tabs-nav');
    var $bd = $tab.find('.am-tabs-bd');
    var nav = '<li><span class="am-icon-close" id="close'+id+'"></span><a href="javascript: void(0)"><i class="am-icon-'+ico+'"></i> ' + name + '</a></li>';
    var content = '<div class="am-tab-panel" id="' + id + '" >' + html +'</div>';

        $nav.append(nav);
    $bd.append(content);
   
    $tab.tabs('refresh');
    $tab.tabs('open', $('#doc-tab-demo-1 .am-tabs-nav > li').size()-1);
    // 移除标签页
    $nav.on('click', '#close'+id, function () {
        var $item = $(this).closest('li');
        var index = $nav.children('li').index($item);

        $item.remove();
        $bd.find('.am-tab-panel').eq(index).remove();

        $tab.tabs('open', index > 0 ? index - 1 : index + 1);
        $tab.tabs('refresh');
    });
    return id;
    }

// 初始化表格
function initializeTable(id, aoColumns, fnRowCallback, sAjaxSource,
    listDiv, listId, otherKey, fnInitComplete, fnDrawCallback, row, bInfo) {
    //console.log(3)
    var DefaltaoColumns = [{// 此列必须有 且隐藏 否则打乱排序
        "sClass": "am-hide-sm-only",
        "sDefaultContent": "",// 此列默认值为""，以防数据中没有此值，DataTables加载数据的时候报错
        "bSortable": false,
        "visible": false
    }];
    // 合并数组
    aoColumns = DefaltaoColumns.concat(aoColumns);
    //默认不能排序
    $.each(aoColumns, function (idx, item) {
        if (typeof (item.bSortable) == "undefined") {
            item.bSortable = false;
        }
    });
    var tb = $('#' + id).DataTable({
        "responsive": true,
        "searching": false,// 取消显示搜索\
        //"bSort" : false,
        "iDisplayLength": (null == row ? 10 : row),
        "bInfo": (null == bInfo ? true : bInfo),
        // "bProcessing" : true,//
        // 以指定当正在处理数据的时候，是否显示“正在处理”这个提示信息
        "bLengthChange": false,// 是否显示一个每页长度的选择条（需要分页器支持）
        "aLengthMenu": [10, 30, 50, 100, 200],
        "bServerSide": true, // 是否启动服务器端数据导入
        // "bAutoWidth" : true, // 是否自适应宽度
        "columnDefs": [{
            type: 'chinese-string',
            targets: '_all'
        }],
        "aoColumns": aoColumns,
        "fnRowCallback": fnRowCallback,
        "sAjaxSource": sAjaxSource,// 指定要从哪个URL获取数据
        "fnServerParams": function (aoData) {
            var where = getWhere(listDiv);
            aoData.push(
                {
                    "name": "action",
                    "value": "getListData",

                },
                {
                    "name": "opid",
                    "value": listId,

                },
                {
                    "name": "where",
                    "value": where,

                },

                {
                    "name": "otherKey",
                    "value": otherKey,

                },
                {
                    "name": "order",
                    "value": "",


                });
        },
        "fnInitComplete": fnInitComplete,
        "fnDrawCallback": function (table) {
            if (fnDrawCallback)
                fnDrawCallback();
            else {
                $("#" + id + "_previous").before("<li id='" + id + "PageChange'>跳到第 <input type='text' id='" + id + "changePage' class='input-text' style='width:30px;height:26px;border:1px solid #DDDDDD;color:black;'> 页  <a style='border:none;display:inline-table' href='javascript:void(0);' id='" + id + "dataTable-btn' >跳转</a></li>");

                var oTable = $("#" + id).dataTable();
                $('#' + id + 'dataTable-btn').click(function (e) {
                    $("#" + id + "PageChange").hide();
                    if ($("#" + id + "changePage").val() && $("#" + id + "changePage").val() > 0) {
                        var redirectpage = $("#" + id + "changePage").val() - 1;
                    } else {
                        var redirectpage = 0;
                    }
                    oTable.fnPageChange(redirectpage);
                });
            }
        },
        // 服务器端，数据回调处理
        "fnServerData": function (sSource, aDataSet, fnCallback) {
            $.ajax({
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": aDataSet,
                "success": fnCallback
            });
        },
        "fnInfoCallback": function (settings, start, end, max, total, out) {
            if (total > settings.oAjaxData.iDisplayLength) {
                $("#" + settings.sTableId + "_wrapper").find(".am-datatable-footer").show();
                return out;
            }
            else {
                $("#" + settings.sTableId + "_wrapper").find(".am-datatable-footer").hide();
                return "";
                //am-datatable-footer
            }
        }
    });
    return tb;
}
$(function () {
   
    var store = $.AMUI.store;
    $("#admin-offcanvas").on(
        "click",
        ".am-cf.am-c",
        function () {
            //store.set('menuId', this.id);admin-offcanvas
            $("#admin-offcanvas").find(".am-cf.am-c").css("color",
                "#5c5c5c");
            $(this).css("color", "#0e90d2");
            store.set('hisMenus_his', $("#admin-offcanvas").html());
        });
    /* $("#admin-offcanvas").on("click", ".admin-sidebar-list", function() {
        $(this).children("li").find("a").addClass("am-collapsed");
        $(this).children("li").find("ul").removeClass("am-in");
        $("#admin-offcanvas").find(".am-cf.am-c").css("color", "#5c5c5c");
        $(this).css("color", "#0e90d2"); 
    }); */
    $("#admin-offcanvas").on("click", ".admin-parent", function () {
        var obj = $(this);
        var next = $(this).nextAll();
        var prev = $(this).prevAll();
        $(this).siblings().find("a").addClass("am-collapsed");
        $(this).siblings().find("ul").removeClass("am-in");
        $('.admin-sidebar-sub').on('open.collapse.amui', function () {
            var span = $(this).prev().find(".am-icon-angle-right");
            $(span).rotate({
                animateTo: 90
            });

        }).on('close.collapse.amui', function () {
            var span = $(this).prev().find(".am-icon-angle-right");
            $(span).rotate({
                animateTo: 0
            });
        });

    });

    $("#btnLeftMenu").click(function () {
        $('#side_menu').toggle(300);

        setTimeout(function () {
          
        }, 500)

    });


    $(window).resize(function () {
        var w = $(window).width();
        if (w <= 640 && $('#side_menu').is(':visible')) {
            $('#side_menu').hide();
        }
    });
    $(function () {
  

        var deg = 0;
        $("#iconMenu").rotate({
            bind: {
                click: function () {
                    deg = deg == 90 ? 0 : 90;
                    ;
                    $(this).rotate({
                        animateTo: deg
                    })
                }
            }
        });



    });



});

function selectIco(id, l_fieldv) {
    let rw = $("#" + l_fieldv + " :input[id='" + id + "']").attr("readonly");

    if (rw == "readonly") { return false; } else {
        $("body").append("<div id='ico1e6f860fbcd16cafc124f35e7b86fa88'></div>")
        let html = ""; 
        $.get("amazeui/Scripts/ico.js", function (r) {
            let objdata = JSON.parse(r);
            let j = 0;
            for (let i = 0; i < objdata.length; i++) {
                if (j == 0) {
                    html += "<tr>";
                }
                else if (j == 30) {
                    html += "</tr><tr>";
                    j = 0;
                }
                if (i == objdata.length - 1) {
                    html += "</tr>";
                    $("#ico1e6f860fbcd16cafc124f35e7b86fa88").append(html);
                }

                html += "<td onclick=select_ico_x('" + id + "','" + l_fieldv + "','" + objdata[i].id + "')><i class='fa fa-lg fa-" + objdata[i].id + "'></td>  ";
                j++;
            }
        })

            
        setDivCenter("ico1e6f860fbcd16cafc124f35e7b86fa88", "选择图标", 800);
    }
}//选择图标
function select_ico_x(id,div, value) {
    $("#" + div + " :input[id='" + id + "']").val(value);
    layer.close($("#ico1e6f860fbcd16cafc124f35e7b86fa88").attr("index"));

}

function checkIsOpenList(carrOnDiv, opId, obId, row) {
    let div = carrOnDiv + row;
    let rw = $("#" + div + " :input[id='" + obId + "_show']").attr("readonly");

    if (rw == "readonly") { openCardFromCard(div, obId); } else {
        openList(carrOnDiv, opId, obId, row);
    }
}