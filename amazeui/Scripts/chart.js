var My = {}; chardata = {};
function createchart(id,div){
//	alert(id)
	   loadJS('../Scripts/highcharts.js',function (){
	       loadJS('../Scripts/highcharts-more.js',function (){
	        loadJS('../Scripts/highcharts-3d.js',function (){
	            loadJS('../Scripts/exporting.js',function (){
	         	   //alert(id);
	               createdesktop(id,div)  
		        });
	        });
	       });
	    });

}

function createdesktop(id,div){
	 $.ajax({
         type: "post",
         url: "../bi/selectDesktop.action",
         data:  {id:id},
         async: true,//取消异步
         success: function (result) {
             if (result) { 
             var stable=	result.desk[0];
             var stablemx= result.desksub;
             var chart=result.chart;
             stablemx.sort(function (a, b) { return a.lpos - b.lpos });
             $.each(stablemx, function (i, d) {
            	 var chart=stablemx[i].chart.chart[0];
            	 var report=stablemx[i].report;
                 if (stablemx[i].width != 0 && stablemx[i].height != 0) {
                     var wwidth = $(window).width(); var wheight = $(window).height();
                     var width = Math.floor(stablemx[i].width * 100 / stable.width);
                     var high = Math.floor(stablemx[i].height * 100 / stable.height);
                     var height = (parseInt(wheight) - 100) * stablemx[i].height / stable.height;
                     var zk = 0; var zl = 0; var left = 0; var nleft = 0;        left = nleft;
                     if (stable.lpath == 1) { width = (width > 200) ? 200 : width; height = (height > 75) ? 75 : height; }
                     if (i == 0) { zl = high }
                     if (width + zk < 100) {
                        left = left + 10; nleft = (parseInt(wwidth) - 200) * (width + zk) / 100; zk += width; zl = (zl > high) ? zl : high;
                     }
                     else { position = "relative"; zk = 0; if (high < zl) { nleft = left; zl = 0; } else { nleft = 0 } }
                    
                      $("#" + div).append("<div id='l" + div + i + "' ><div id='s" + div + i + "'></div></div>");//插入绘图用div
                      $("#s" + div+i).append("<div style = 'display: none'   id='f" + div + i + "'></div>");//插入查询条件div
                      $("#s" + div+i).append(" <div class='operdesktop'  style = 'display: none' id='o" + div + i + "'></div>");//插入操作排序div
                      //$("#l" + div+i).append(" <div id='" + div + i + "'  style=\" width: " + (parseInt(wwidth) - 200) * width * 0.01 + "px; height:" + height + "px;left:" + left + "px;float:left; \" > </div>")//插入生成图表用的div
                      $("#l" + div+i).append(" <div id='" + div + i + "'  style=\" width: "+ width  + "%; height:auto;left:" + left + "px;float:left; \" > </div>")//插入生成图表用的div
                      $("#" + div+i).data("report",report);
                      $("#" + div+i).data("chart",chart);
                      $("#f" + div+i).append (get_divfind(report, div + i));

                      $("#" + div+i).attr("reportname",chart.chname);
                      $("#o" +div+i ).empty();
                      $("#o" +div+i ).append(createoper(report, chart.type, div+i));
                      get_divoperate( div + i,chart);
                      $("#f"+ div+i  + "_bt_cx").click();
                 }});
             return true;
             }
             else{alert("构建桌面失败！");return false;}
             }
         })
}
function get_divfind(report, div) {
     var divfind =  "f"+div;    var html = ""; var w = ""; var ls = 0;var count=3;
    $("#" + divfind).empty();
    var finddata=report.where;
    if (finddata[0] != null&&finddata[0]!=undefined) {
    	
    	finddata.sort(function (a, b) { return a.lpos - b.lpos });
    	    $.each(finddata, function (i, field1) {
    	        if (report.report[0].type ==1) {
    	            if (ls >= count) {
    	                html += "<br/>"; ls = 0; html += "<span  class=\"findpath\"> " + finddata[i].chname + "</span><select sname=\"" + i + "\">";
    	                html += select_eq(); html += "<input id='" + div+"_" + i + "' wd=\"" + finddata[i].report_field_name + "\" type=\"text\" name=\"" + i + "\">"
    	            } else {
    	                html += "<span  class=\"findpath\"> " + finddata[i].chname + "</span><select sname=\"" + i + "\">"; html += select_eq(); html += "<input  id='" + div +"_"+ i + "' wd=\"" + finddata[i].report_field_name + "\"type=\"text\" where ='1' name=\"" + i + "\">"
    	            }; ls += 1; w = "";
    	        }
    	        else{
    	            if (ls >= count) {
    	                html += "<br/>"; ls = 0; html += "<span  class=\"findpath\"> " + finddata[i].chname + "</span>";
    	                html += "<input id='" + div +"_"+ i + "' wd=\"" + finddata[i].report_field_name + "\" type=\"text\" name=\"" + i + "\">"
    	            } else {
    	                html += "<span  class=\"findpath\"> " + finddata[i].chname + "</span>"; html += "<input  id='" + div +"_"+ i + "' wd=\"" + finddata[i].report_field_name + "\"type=\"text\" where ='1' name=\"" + i + "\">"
    	            }; ls += 1; w = "";
    	        }
    	    });
     }
    return html;
}//填充divfind



function select_eq(fieldtype) {
    switch (fieldtype) {
        default: var html = "<option value=\"include\" selected='selected'>包含</option><option value=\"ninclude\">不包含</option><option value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "field_type_refer": var html = "<option value=\"include\">包含</option><option value=\"ninclude\">不包含</option><option selected='selected' value=\"equal\">=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option>"; break;
        case "field_type_enum": var html = "<option value=\"include\">包含</option><option value=\"ninclude\">不包含</option><option selected='selected' value=\"equal\">=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option>"; break;
        case "7f10c0e0584d05f4061393dc0c0d5527": var html = "<option selected='selected' value=\"include\">包含</option><option value=\"ninclude\">不包含</option><option  value=\"equal\">=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option>"; break;
}
    return html;
}//添加比较操作符返回html
function get_divfind_select(obj, div, x, y) {
    var yop = ""; var xop = ""; var html = ""; var wd = obj.group; var vl = obj.vl;
    wd.sort(function (a, b) { return a.lpos - b.lpos });
    vl.sort(function (a, b) { return a.lpos - b.lpos });
    $.each(vl, function (i, field1) { yop += "<option value=\"" + vl[i].report_field_name + "\">" + vl[i].chname + "</option>" });
    $.each(wd, function (i, field1) { xop += "<option value=\"" + wd[i].report_field_name + "\">" + wd[i].chname + "</option>" });
    for (var i = 0; i < x; i++) {
        if (i == 0) { var a = i + 1; html += "<span>第" + a + "维度</span><select id=\"select_X" + div + "\"><option></option>" + xop + "</select>"; }
        else { var a = i + 1; html += "<span>第" + a + "维度</span><select id=\"select_X" + a + div + "\"><option></option>" + xop + "</select>"; }
    }
    for (var i = 0; i < y; i++) {
        if (i == 0) { var a = i + 1; html += "<span>第" + a + "指标</span><select id=\"select_Y" + div + "\"><option></option>" + yop + "</select>"; }
        else { var a = i + 1; html += "<span>第" + a + "指标</span><select id=\"select_Y" + a + div + "\"><option></option>" + yop + "</select>"; }
    }
    html += "<span>依照</span><select id=\"select_PX" + div + "\"><option></option><option>指标</option><option>维度</option></select><span>排序</span><select id=\"select_SJ" + div + "\"><option></option><option>升序</option><option>降序</option></select>";
    return html;
}

function createoper(obj, c, div) {
    // alert(JSON.stringify(obj[2].vl[0].report_field_name));
    var html = "";
    var divfind = ""; var operate = "";
    divfind = "f"+div ; operate = "o"+div 

    switch (c) {
        case "3b9b279f90b889f6b38460acc34b86d2"://比较分析
            html = get_divfind_select(obj, div, 1, 1);
            html += "<a id=\"" + divfind + "_bt_cx\" onclick=\"get_divwd(20,'" + div + "')\" find class=\"u-btn u-btn-sm\"> 查询</a><a id=\"" + divfind + "_bt_col\" class=\"u-btn u-btn-sm\" onclick=\"chart_zx('','','','','column')\" >柱状图</a><a id=\"" + divfind + "_bt_line\" onclick=\"chart_zx('','','','','line')\" class=\"u-btn u-btn-sm\" >折线图</a><a id=\"" + divfind + "_bt_spline\" onclick=\"chart_zx('','','','','spline')\" class=\"u-btn u-btn-sm\" >曲线图 </a><span>查询数据删除图表</span><input id=\"" + divfind + "_bt_check\" checked='checked'  type=\"checkbox\" />";
            break;
        case "8ff644cb38d5bc737b0c5b003bda6cb5":   //占比分析   
            html = get_divfind_select(obj, div, 2, 1);
            html += "<a id=\"" + divfind + "_bt_cx\" onclick=\"chart_bt('" + div + "')\" find class=\"u-btn u-btn-sm\"> 绘图</a>";
            break;
        case "443d1e1e37aa6f5523d6089577e25178":  //双指标对比 
            html = get_divfind_select(obj, div, 1, 2);
            html += "</select><a id=\"" + divfind + "_bt_cx\" onclick=\"chart_2y('" + div + "')\" find class=\"u-btn u-btn-sm\"> 绘图</a>";
            break;
        case "63fbd3a670d5f3c05b8a545b3a491893": //气泡
            html = get_divfind_select(obj, div, 1, 3);
            html += "</select><a id=\"" + divfind + "_bt_cx\" onclick=\"chart_qp('" + div + "')\" find class=\"u-btn u-btn-sm\"> 绘图</a>";
            break;
        case "f28b502343c4cc446fdc70ba6ab2a37f":  //3指标对比
            html = get_divfind_select(obj, div, 1, 3);
            html += "</select><a id=\"" + divfind + "_bt_cx\" onclick=\"chart_3y('" + div + "')\" find class=\"u-btn u-btn-sm\"> 绘图</a>"; break;
        case "84b3f8c8ba7146ff6edd247e40a4a882":  //指标百分比柱形图
            html = get_divfind_select(obj, div, 1, 2);
            html += "</select><a id=\"" + divfind + "_bt_cx\" onclick=\"chart_Stacked('" + div + "')\" find class=\"u-btn u-btn-sm\"> 绘图</a>"; break;
        case "e427c5ddb1ba705b59ff847ba79cd17a":  //维度百分比柱形图
            html = get_divfind_select(obj, div, 2, 1);
            html += "</select><a id=\"" + divfind + "_bt_cx\" onclick=\"chart_Stacked2('" + div + "')\" find class=\"u-btn u-btn-sm\"> 绘图</a>"; break;
        case "f98e1784776091b80de74b59ba11ae08":  //透视表
            html = get_divfind_select(obj, div, 3, 0);
            html += "</select><a id=\"" + divfind + "_bt_cx\" onclick=\"chart_tsb('" + div + "')\" find class=\"u-btn u-btn-sm\"> 绘图</a><a id ='downtsb" + div + "' onclick=\"chart_tsb_down('" + div + "')\" style = 'display: none'  class=\"u-btn u-btn-sm\"> 下载</a>"; break;
        default:  //基础图表
            html = get_divfind_select(obj, div, 1, 1);
            html += "</select><a id=\"" + divfind + "_bt_cx\" onclick=\"chart_jc('" + div + "','" + c + "')\"  find class=\"u-btn u-btn-sm\"> 绘图</a>"; break;
    }
    return html;

}//创建图表操作div
function get_divoperate( div, oper) {
    var operate ="o"+ div ; var divfind = "f"+div;
   // $("#" + div).data("oper", oper);
      
        //$("#" + operate).after("<img id='" + operate + "_ss' class='tboperate_ss' onclick=\"group_1_zkss('" + operate + "','" + operate + "_ss','" + operate + "_zk','ss')\" style=\"display: none;\" src=\"images/ss2.png\" ><img id='" + divfind + "_ss' class='tboperate' onclick=\"group_1_zkss('" + divfind + "','" + divfind + "_ss','" + divfind + "_zk','ss')\" style=\"display: none;\" src=\"images/ss.png\" >");

        if (oper != undefined) {
            $("#select_Y" + div).val(oper.select_y); $("#select_Y2" + div).val(oper.select_y2); $("#select_Y3" + div).val(oper.select_y3);
            $("#select_X" + div).val(oper.select_x); $("#select_X2" + div).val(oper.select_x2); $("#select_X3" + div).val(oper.select_x3);
            oper.where1vl=oper.where1vl==null?"":oper.where1vl;
            oper.where2vl=oper.where2vl==null?"":oper.where2vl;
            oper.where3vl=oper.where3vl==null?"":oper.where3vl;
            if (oper.where1vl.indexOf("$sys") == -1) { $("#" + divfind + " [wd='" + oper.where1 + "']").val(oper.where1vl); }
            else { $("#" + divfind + " [wd='" + oper.where1 + "']").val(sys_f_analyse("", oper.where1vl)); }
            if (oper.where2vl.indexOf("$sys") == -1) { $("#" + divfind + " [wd='" + oper.where2 + "']").val(oper.where2vl); }
            else { $("#" + divfind + " [wd='" + oper.where2 + "']").val(sys_f_analyse("", oper.where2vl)); }
            if (oper.where3vl.indexOf("$sys") == -1) { $("#" + divfind + " [wd='" + oper.where3 + "']").val(oper.where3vl); }
            else { $("#" + divfind + " [wd='" + oper.where3 + "']").val(sys_f_analyse("", oper.where3vl)); }

        }
    
}//填充divoper


function chart_wdchange(wd, wdz, div, lx) {//lx==0 联动，lx==1下钻 lx==2还原
    var wdid = "";var clc = "";
    if (wd == 0) { wdid = $("#select_X" + div).val(); }
    else if (wd == 1 || wd == 2) {
        wd = parseInt(wd) + 1;
        wdid = $("#select_X" + wd + div).val();
    }
    else {
        wdid = wd;
    }
    divfind ="f"+ div ; operate = "o"+div ; clc = div; 
    if (lx == 1) {
        $("#" + divfind).find("input[wd=\"" + wdid + "\"]").each(function () {
            
             var aaa = $(this).attr("id").substring(0, $(this).attr("id").indexOf("_"));
            if (aaa == div) {
                $(this).val(wdz)
                var v = $("#select_X" + div).find("option:selected").next().val();
                $("#select_X" + div).val(v);
            }

        });
        $("#f" + clc + "_bt_cx").click();
    } else if (lx == 2) {
        var oper = $("#" + div).data("chart");


        $("#" + divfind).find("input[wd]").each(function () {
            $(this).val("");
            var aaa = $(this).attr("id").substring(0, $(this).attr("id").indexOf("_"));
            if (aaa == div) {

                var v = $("#select_X" + div).find("option:first").val();
                $("#select_X" + div).val(v);
            }

        });
        if (oper != undefined) {
            $("#select_Y" + div).val(oper.select_y); $("#select_Y2" + div).val(oper.select_y2); $("#select_Y3" + div).val(oper.select_y3);
            $("#select_X" + div).val(oper.select_x); $("#select_X2" + div).val(oper.select_x2); $("#select_X3" + div).val(oper.select_x3);
            $("#" + divfind + " [wd='" + oper.where1 + "']").val(sys_f_analyse("", oper.where1vl));
            $("#" + divfind + " [wd='" + oper.where2 + "']").val(sys_f_analyse("", oper.where2vl));
            $("#" + divfind + " [wd='" + oper.where3 + "']").val(sys_f_analyse("", oper.where3vl));
        }
        $("#f" + clc + "_bt_cx").click();
    }
    else if (lx == 4) {

        $("#" + divfind).find("input[wd]").each(function () {
            $(this).val("");
             var aaa = $(this).attr("id").substring(0, $(this).attr("id").indexOf("_"));
            if (aaa == div) {

                var v = $("#select_X" + div).find("option:first").val();
                $("#select_X" + div).val(v);
            }

        });

        $("#f" + clc + "_bt_cx").click();
    }
    else if (lx == 0) {

        $("#"+div).find("input[wd=\"" + wdid + "\"]").each(function () {
             var aaa = $(this).attr("id").substring(0, $(this).attr("id").indexOf("_"));
            if (aaa != div) {
                $(this).val(wdz)
            }

        });
        $("#"+div).find("[find]").each(function () {
             var aaa = $(this).attr("id").substring(0, $(this).attr("id").indexOf("_"));
            if (aaa != div) {
                $(this).click();
            }
        })
        //  $("#" + div + "divfind_bt_cx").click()
    }
}//维度变更

function get_finddata(opid, divfind,isjump) {
	
	var con= divfind.substr(1, divfind.length-2);
    var newdata = new Array();
    var obj =   $("#" + con).data(opid);
    var report =   $("#" + divfind.substr(1,divfind.length-1)).data("report");
    var where = zx_eq_list(divfind, report.report[0].type);
        if ((obj != undefined&&isjump==1)||(obj != undefined&& $("#" + con).data("where")==where)||(obj != undefined&& "243daf74b10e29399ef7c815cf4772b0"==report.report[0].report_type)) {

            $.each(obj, function (i, field1) {
                if (zx_eq(obj[i], divfind)) { newdata.push(obj[i]) }
            });
        }

    else {
       if (where == $("#" + con).data("where") && obj != ""&& obj != null) {
            newdata = obj;
        } else {
            $.ajax({
                type: "get",
                url: "../bi/getReportData.action?where=" + encodeURI(where) + "&id=" + opid,

                async: false,//取消异步
                success: function (result) {
                    if (result) {


                        $("#" + con).removeData(opid);
                        $("#" + con).data(opid,  result.data);
                        $("#" + con).data("where", where);
                        newdata = result.data;
                    }
                },
                error: function () {
                  alert("取数据错误！")
                }
            })
        }
    }
    //排序
    
    var px = "";
    if ($("#select_PX" + divfind.substr(1,divfind.length-1)).val() == "指标") {
        px = $("#select_Y" + divfind.substr(1,divfind.length-1)).val();
        
        if ($("#select_SJ" + divfind.substr(1,divfind.length-1)).val() == "降序") {
        	newdata.sort(function (a, b) { return b[px] - a[px] });
       } else if($("#select_SJ" + divfind.substr(1,divfind.length-1)).val() == "升序") {
    	   newdata.sort(function (a, b) { return a[px] - b[px] });
       }

    } else if ($("#select_PX" + divfind.substr(1,divfind.length-1)).val() == "维度") {
        px = $("#select_X" + divfind.substr(1,divfind.length-1)).val();
        if ($("#select_SJ" + divfind.substr(1,divfind.length-1)).val() == "降序") {
       	 newdata.sort(createComparisonFunction(px,1));
       } else if($("#select_SJ" + divfind.substr(1,divfind.length-1)).val() == "升序") {
       	 newdata.sort(createComparisonFunction(px,0));
       }
    }

   
    return newdata;

}


function sys_eq(eq, a, b) {
    var html = "";
    
    switch (eq) {
        case "include": html += a + " like '%" + b + "%' and "; break;
        case "ninclude": html += a + " not like '%" + b + "%' and "; break;
        case "equal": html += a + " = '" + b + "' and "; break;
        case "nequal": html += a + " != '" + b + "' and "; break;
        case "dayu": html += a + " > '" + b + "' and "; break;
        case "dayudengyu": html += a + " >= " + b + "' and "; break;
        case "xiaoyu": html += a + " < '" + b + "' and "; break;
        case "xiaoyudengyu": html += a + " <= '" + b + "' and "; break;
        case "from2": html += a + " like '%" + b + "' and "; break;
        case "from1": html += a + " like '" + b + "%' and "; break;
        case "null": html += a + " is null and "; break;
        case "notnull": html += a + " is not null and "; break;
    }
    return html;
}

function zx_eq_list(div, lx) {
    var html = ""; 
   
  if(lx==0){//如果是后台控制
	  $("#" + div).find("[where='1']").each(function () {
          if ($(this).val() != "") {
              var a = $(this).attr("wd");
              var b = $(this).val();
              html +=  a+":"+b+",";
          }
      })
  }else{//否则前台控制
        $("#" + div).find("[where='1']").each(function () {
            if ($(this).val() != "") {
                var a = $(this).attr("wd");
                var b = $(this).val();
                html += sys_eq($("#" + div).find("select[sname=\"" + $(this).attr("name") + "\"]").val(), "v." + a, b);
            }
        })
  html+=" 1=1 ";      
  }
   
    return html;

}//比较某个div下所有input元素非空的值,生成where条件

function get_char_data(xdata, vl, finddata, x_wd, type) {
    vl.sort(function (a, b) { return a.lpos - b.lpos });
    var mydata = {};
    $.each(xdata, function (n, vldata) {
        var js = 0;
        $.each(finddata, function (i, filed) {
            if (xdata[n] == finddata[i][x_wd]) {

                $.each(vl, function (j, da) {
                    if (n == 0 && js == 0) { mydata[vl[j].report_field_name] = new Array(); }
               
                    var y=	get_chart_fl(mydata[vl[j].report_field_name][n], finddata[i][vl[j].report_field_name], vl[j].vl_type==null?"":vl[j].vl_type)
                    mydata[vl[j].report_field_name][n] =y;
                });
                js++
            }
            if (i == finddata.length - 1) {
                $.each(vl, function (t, da) {
                    if ( vl[t].prog != ""&& vl[t].prog!=null) {
                        mydata[vl[t].report_field_name][n] = adddw(get_chart_js(mydata,vl[t].prog, n), vl[t].vl_dw);
                    } else {
                        if (vl[t].vl_type == "report_vl_type_1" && js > 0) {
                            mydata[vl[t].report_field_name][n] = adddw(mydata[vl[t].report_field_name][n] / js, vl[t].vl_dw);
                        }
                        else { mydata[vl[t].report_field_name][n] = adddw(mydata[vl[t].report_field_name][n], vl[t].vl_dw) }
                    }

                })
                if (type == "pie") {
                    $.each(vl, function (t1, da) {
                        mydata[vl[t1].report_field_name][n] = [xdata[n], mydata[vl[t1].report_field_name][n]]
                    })

                }
            }
        });


    })
    
    return mydata;
}

function get_chart_js(obj, str, n) {
    var a = str.length;
    var newstr = str.replace(/#/g, '');
    var i = str.length - newstr.length;

    // var newstr;
    for (j = 0; j < i; j++) {
        var r = str.substring(str.indexOf("$"), str.indexOf("#") + 1);
        var wd = str.substring(str.indexOf("$") + 1, str.indexOf("#"));
        var v = obj[wd][n]
        str = str.replace(r, v).replace("--", "+")
    }
    if (str.indexOf("\\0") != -1) { return "0"; } else { return eval(str); }

}
function get_chart_fl(y, yy, vl_type) {
    if (y == null || y == undefined || y == "") { y = 0; }
    switch (vl_type) {
        default: y += Number(yy); break;//zhexiantu
        case "report_vl_type_1": y += Number(yy); break;//zhu
        case "report_vl_type_2": y++; break;//zhu
        case "report_vl_type_3": y = (y >= Number(yy) ? y : Number(yy)); break;//zhu
        case "report_vl_type_4": y = (y <= Number(yy)) ? y : Number(yy); break;//zhu

    }
    return y;
}


function adddw(aaa, dw) {
    if (dw.indexOf("万") != -1) {
        aaa = Math.round(parseFloat(aaa) * 0.0001);
        //aaa = addCommas(aaa)
    }
    else if (dw.indexOf("千") != -1) {
        aaa = Math.round(parseFloat(aaa) * 0.001);
        //aaa = addCommas(aaa)
    }
    else if (dw.indexOf("百") != -1) {
        aaa = Math.round(parseFloat(aaa) * 0.01);
        //aaa = addCommas(aaa)
    }
    else if (dw.indexOf("%") != -1) {
        aaa = parseFloat(aaa.toFixed(2));
        //aaa = addCommas(aaa)
    }

    return aaa;
}//单位转化
function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function zx_eq(obj, div) {
    var t = 0;
    // alert(JSON.stringify(obj["bm"]));
    $("#" + div).find("input[type='text']").each(function () {

        if ($(this).val() != "") {
            // var c = $(this).attr("wd").replace(/(^\s+)|(\s+$)/g, "")
            var a = obj[$(this).attr("wd")].replace(/(^\s+)|(\s+$)/g, "");
            var b = $(this).val().replace(/(^\s+)|(\s+$)/g, "");
            if (checkint(a) && checkint(b)) { var a = parseFloat(a); var b = parseFloat(b) }
            //   if (parseFloat(b) != "NaN" && parseFloat(a) != "NaN") { var e = parseFloat(b) } else { e = b; }
            //alert(a); alert(b); alert(c);
            switch ($("#" + div).find("select[sname=\"" + $(this).attr("name") + "\"]").val()) {
                case "include": if (a.indexOf(b) >= 0) { } else { t++ }; break;
                case "ninclude": if (a.indexOf(b) >= 0) { t++ } else { }; break;
                case "equal": if (a == b) { } else { t++ }; break;
                case "nequal": if (a == b) { t++ } else { }; break;
                case "dayu": if (a > b) { } else { t++ }; break;
                case "dayudengyu": if (a >= b) { } else { t++ }; break;
                case "xiaoyu": if (a < b) { } else { t++ }; break;
                case "xiaoyudengyu": if (a <= b) { } else { t++ }; break;
            }

        }
    })
    return (t == 0) ? true : false;
}//比较某个div下所有input元素非空的值
////图表生成 div=绘图div lx=图表类型 isjump=是不是跳转过来的 如果是 不会重新抓数据
function chart_jc(div, lx,isjump) {
var divfind ="f"+div; ; var type = "";
var report = $("#" + div).data("report");
var finddata = isjump == undefined ? get_finddata(report.report[0].id, divfind, 0) : get_finddata(report.report[0].id, divfind, isjump);
var pointFormat = "";
var data = new Array(); var xx = 0; d3d = false; var depth = 0;
var xdata = new Array(); var data_sub = new Array(); var x_wd = $("#select_X" + div).val(); var y_wd = $("#select_Y" + div).val();
var dw = "";
var vllx;
if(x_wd!=""&&y_wd!=""){
$.each(report.vl, function (i, field1) {
    //  alter(obj)
    if (report.vl[i].report_field_name == y_wd) { vllx = report.vl[i]; dw = report.vl[i].vl_dw }
});
switch (lx) {
    case "12054cfbbacff41f92b6115d0c530271": type = 'line'; pointFormat = "{series.name}: <b>{point.y}</b>"; break;//zhexiantu
    case "539cc0d7bd62612929b857cb46b4b17f": type = 'column'; pointFormat = "{series.name}: <b>{point.y}</b>"; break;//zhu
    case "71bed3c228a6159655a363fa68fbd95b": type = 'scatter'; pointFormat = "{series.name}: <b>{point.y}</b>"; break;//san
    case "d133dcac137596fccda2d1253478951a": type = 'pie'; pointFormat = "{series.name}: <b>{point.percentage:.1f}%</b>"; break;//bing
    case "2d4587529db006dab90e59e6b7bdb9f1": type = 'spline'; pointFormat = "{series.name}: <b>{point.y}</b>"; break;
    case "5f7d4733a42f79c8311b9d1bf11c6d40": type = 'area'; pointFormat = "{series.name}: <b>{point.y}</b>"; break;
    case "bfb4caff284f23cbee5196a660e4236a": type = 'areaspline'; pointFormat = "{series.name}: <b>{point.y}</b>"; break;
    case "5eb97d7d33c53f2c3b26dfb5ae0b0845": type = 'bar'; pointFormat = "{series.name}: <b>{point.y}</b>"; break;
    case "e99d94f812d57e82ed0ab9199ff4a5c4": type = 'column'; pointFormat = "{series.name}: <b>{point.y}</b>"; d3d = true; depth = 50; break;
    case "fe390018e04121f48c8a28a32eb45486": type = 'pie'; pointFormat = "{series.name}: <b>{point.percentage:.1f}%</b>"; d3d = true; break;//bing

}
$.each(finddata, function (j, field1) {
    //  alter(obj)
    if ($.inArray(finddata[j][x_wd], xdata) == -1) { xdata.push(finddata[j][x_wd]) }

});
//  //xdata.sort();
var mydata = get_char_data(xdata, report.vl, finddata, x_wd, type);
data.push({ _colorIndex: Math.ceil(Math.random() * 10) - 1, _symbolIndex: Math.ceil(Math.random() * 5) - 1, name: $("#select_Y" + div).find("option:selected").text(), data: mydata[y_wd] });

var mychart = {
    chart: {
        type: type,
        options3d: {
            enabled: d3d,
            alpha: 30,
            beta: 15,
            depth: depth
        }
    },
    title: {
        text:$("#"+div ).attr("reportname")
    },
    tooltip: {
        formatter: function () {
            if (type == "pie") {
                return '<b>' + this.series.name + ':</b>: ' + Highcharts.numberFormat(this.percentage, 1) + '%';
            }
            else {
                return '<b>' + this.series.name + ':</b>' + this.y + dw;
            }
        }
    },

    xAxis:
{
 title: {
     text: $("#select_X" + div).find("option:selected").text()
 },
 categories: xdata
},
    yAxis: {
        title: {
            text: $("#select_Y" + div).find("option:selected").text()
        }
    }, credits: { enabled: false },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}',


            }
            // showInLegend: true
        },
        series: {
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var wdz = "";
                    if (type == "pie") { wdz = event.point.name; } else { wdz = event.point.category; }

                    if (event.ctrlKey == true) {
                        //alert(1);

                        chart_wdchange(0, wdz, div, 0);
                    }
                    else if (event.altKey == true) { chart_wdchange(0, wdz, div, 1); }
                    else if (event.shiftKey == true) {
                        chart_wdchange(0, wdz, div, 2);
                    }
                }
            }
        }
    },
    exporting: {
    	enabled:true,
        buttons: {
        	aButton:{
                text: '操作栏',
                onclick: function () {
                	chart_show_find(div)
                }},
        	contextButton: {
                menuItems: [
                	
                	{
                    text: '折线图',
                    onclick: function () {
                        chart_jc(div, "12054cfbbacff41f92b6115d0c530271",1)
                    }
                },
                {
                    text: '曲线图',
                    onclick: function () {
                        //chart_change("spline", "type", div)
                        chart_jc(div, "2d4587529db006dab90e59e6b7bdb9f1", 1)
                    }
                },
                    {
                        text: '饼状图',
                        onclick: function () {
                            chart_jc(div, "d133dcac137596fccda2d1253478951a", 1);
                        }
                    },
                    {
                        text: '柱状图',
                        onclick: function () {
                            //chart_change("column", "type", div)
                            chart_jc(div, "539cc0d7bd62612929b857cb46b4b17f", 1);
                        }
                    },
                   {
                       text: '面积图',
                       onclick: function () {
                           // chart_change("area", "type", div)
                           chart_jc(div, "5f7d4733a42f79c8311b9d1bf11c6d40", 1);
                       }
                   },
                   {
                       text: '曲线面积图',
                       onclick: function () {
                           // chart_change("areaspline", "type", div)
                           chart_jc(div, "bfb4caff284f23cbee5196a660e4236a", 1);
                       }
                   },
                  {
                      text: '散点图',
                      onclick: function () {
                          // chart_change("scatter", "type", div)
                          chart_jc(div, "71bed3c228a6159655a363fa68fbd95b", 1);
                      }
                  },
                 {
                     text: '条形图',
                     onclick: function () {
                         //chart_change("bar", "type", div)
                         chart_jc(div, "5eb97d7d33c53f2c3b26dfb5ae0b0845", 1);
                     }
                 },
                 {
                     separator: true
                 },

                {
                     text: '打印',// 修改文案
                         onclick: function () {
                         this.print();
                     }
                 },
                 {
                     text: '下载图表',// 修改文案
                         onclick: function () {
                        	 this.exportChart({
                        		
                        				type: 'application/pdf',
                        				filename: $("#"+div ).attr("reportname")
           
                        	 }) ;
                     }
                 },
                 {
                     separator: true
                 }
                ].concat([{
                    text: '3d柱状图',
                    onclick: function () {

                        chart_jc(div, "e99d94f812d57e82ed0ab9199ff4a5c4",1);
                    }
                }, {
                    text: '3d饼图',
                    onclick: function () {
                        chart_jc(div, "fe390018e04121f48c8a28a32eb45486",1);
                    }
                }])


            }

        }
    },
    series: data
}

//$("#" + div).data("chart", mychart);
$('#' + div).highcharts(mychart);
$('#getcsv').click(function () {
    alert(chart.getCSV());
});}
}
function loadJS(url, success) {
    var domScript = document.createElement('script');
    domScript.src = url;
    success = success || function(){};
    domScript.onload = domScript.onreadystatechange = function() {
      if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
        success();
        this.onload = this.onreadystatechange = null;
        this.parentNode.removeChild(this);
      }
    }
    document.getElementsByTagName('head')[0].appendChild(domScript);
  }
function createComparisonFunction(propertyName,i){   
	
	return function(object1,object2){        
		var value1=object1[propertyName];             var value2=object2[propertyName];    
		
	if(value1<value2){            return i==0? -1 :1            }
	else if(value1>value2){                 return i==0? 1:-1;             }
	else{                 return 0;             }
	}   

	
}
function checkint(str) {
    //如果为空，则通过校验
    if (str == "")
        return true;
    if (/^(\-?)(\d+)$/.test(str))
        return true;
    else
        return false;
}

function chart_qp(div) {
    var divfind = ""; var operate = "";
     divfind = "f"+div ; operate = "o"+div
    //var dataid = ($("#" + div).attr("data") == undefined) ? 0 : parseInt($("#" + div).attr("data"));
  // var quanju_data = ($("#" + div).attr("data") != undefined) ? $("#" + div.substring(0, div.length - 1)).data("data")[dataid] : $("#" + div).data("data")[dataid];
   // var finddata = get_finddata(quanju_data, divfind);
     var report = $("#" + div).data("report");
    var finddata = get_finddata(report.report[0].id, divfind, 0);
   // $("#" + div + "oper_js").remove();
    //$("#" + operate).append("<span id='" + div + "oper_js'>【" + finddata.length + "/" + quanju_data.data.length + "】</span>");

    //var data = "";
    var data = new Array();
    var xdata = new Array(); 
    var x_wd = $("#select_X" + div).val(); 
    var y_wd3 = $("#select_Y3" + div).val();
    var y_wd2 = $("#select_Y2" + div).val();
    var y_wd = $("#select_Y" + div).val();
    // if (mychart == null) {
    $.each(finddata, function (j, field1) {
        //  alter(obj)
        if ($.inArray(finddata[j][x_wd], xdata) == -1) { xdata.push(finddata[j][x_wd]) }

    })
    var dw = "";

    $.each(report.vl, function (i, field1) {
        //  alter(obj)
        if (report.vl[i].report_field_name == y_wd) { dw = report.vl[i].vl_dw }
    });
 
    var mydata = get_char_data(xdata, report.vl, finddata, x_wd);
    $.each(xdata, function (n, vl) {

        data.push({ "name": xdata[n], data: [[mydata[y_wd2][n], mydata[y_wd][n], mydata[y_wd3][n]]] });

    })
    // var datajson = eval(data);

    var MyYou = {


        chart: {
            type: 'bubble',
            zoomType: 'yx'
        },

        legend: {
            enabled: false
        },
        xAxis: {
            title: {
                text: $("#select_Y2" + div).find("option:selected").text()
            },
            // 加这个试试
            gridLineWidth: 1
        },

        yAxis: {
            title: {
                text: $("#select_Y" + div).find("option:selected").text()
            },
            startOnTick: false,
            endOnTick: false
            // 加这个试试
        }, credits: { enabled: false },

        title: {
            text: $("#" + div).attr("reportname")
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                events: {
                    click: function (event) {
                        var wdz = event.point.series.name;
                        if (event.ctrlKey == true) {


                            chart_wdchange(0, wdz, div, 0);
                        }
                        else if (event.altKey == true) { chart_wdchange(0, wdz, div, 1); }
                        else if (event.shiftKey == true) {
                            chart_wdchange(0, wdz, div, 2);
                        }
                    }
                }
            }
        },
        series: data

    }

    $('#' + div).highcharts(MyYou)
    $('#getcsv').click(function () {
        alert(chart.getCSV());
    });


}//绘制气泡图表

function get_divwd(count, div) {
    var divfind =  "f"+div;
   var report = $("#" + div).data("report");
  var finddata = get_finddata(report.report[0].id, divfind, 0);

    
    if ($("#" + divfind + "_bt_check").attr("checked") == "checked") { $("#" + div).empty();$("#" + div).removeData("chart");}
    $.each(report.group, function (i, field) {

        if (report.group[i].report_field_name != $("#select_X" + div).val()) {
            var html = ""; var newdata = new Array();
            html += "<fieldset><legend>" + report.group[i].chname;
            $.each(finddata, function (j, field1) {

                if ($.inArray(finddata[j][report.group[i].report_field_name], newdata) == -1 && report.group[i].report_field_name != $("#select_Y" + div).val() && report.group[i].report_field_name != $("#select_X" + div).val()) {
                    newdata.push(finddata[j][report.group[i].report_field_name])
                }

                if (newdata.length >= count) { return false; }
            })
            //alert(newdata);
            newdata.sort();
            $.each(newdata, function (n, vl) { html += "</legend><input onclick=\" chart_zx($(this).prop('checked'), $(this).attr('name'),  $(this).attr('wd'), $(this).attr('value'),'','"+div+"')\" type=\"checkbox\" wd=\"" + report.group[i].report_field_name + "\"name=\"" + report.group[i].chname + "\" value=\"" + newdata[n] + "\" /> <span>" + newdata[n] + "</span>" })
            html += "</fieldset>";
        }
        $("#"+div).append(html);

    })


}//填充divdw,加个数限制


function chart_zx(ck, name, wd, val, type, div) {
    //chart_zx("container", $("#container").attr("reportname"), $("#select_X").text(), xdata, $("#select_Y").text(), "元", data);

    var data = new Array(); if (type == undefined || type == "") { type = "column"; }
    var xdata = new Array(); var data_sub = new Array(); var x_wd = $("#select_X" + div).val(); var y_wd = $("#select_Y" + div).val();
    var divfind ="f"+div; 
    var report = $("#" + div).data("report");
    var chardata=$("#" + div).data("chart");
    var finddata = get_finddata(report.report[0].id, divfind, 0);
    var dw = "";
    $("#"+div).append("<div id='w"+div+"'></div>")
    $.each(report.vl, function (i, field1) {
        //  alter(obj)
        if (report.vl[i].report_field_name == y_wd) { dw = report.vl[i].vl_dw }
    });
    if (!chardata ) {
        $.each(finddata, function (j, field1) {
            //  alter(obj)
            if ($.inArray(finddata[j][x_wd], xdata) == -1) { xdata.push(finddata[j][x_wd]) }

        })
        //xdata.sort();
        if (ck == true) {
            //$.each(xdata, function (n, vl) { var y = 0; $.each(finddata, function (i, filed) { if (finddata[i][wd] == val && xdata[n] == finddata[i][x_wd]) { y += Number(finddata[i][y_wd]) } }); data_sub.push(adddw( Math.floor(y),dw)); })
            var mydata = get_char_data(xdata, report.vl, finddata, x_wd, type);
            data.push({ _colorIndex: Math.ceil(Math.random() * 10) - 1, _symbolIndex: Math.ceil(Math.random() * 5) - 1, name: val + wd, data: mydata[y_wd] });
          
            	chardata = {
                chart: {

                    type: type,
                    margin: 75,
                    options3d: {
                        enabled: false,
                        alpha: 10,
                        beta: 25,
                        depth: 70
                    }

                },
                title: {
                    text: $("#"+div).attr("reportname")

                }, credits: { enabled: false },

                xAxis:
                {
                    title: {
                        text: $("#select_X" + div).find("option:selected").text()
                    },
                    categories: xdata
                },
                yAxis: {
                    title: {
                        text: $("#select_Y" + div).find("option:selected").text()
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                plotOptions: {
                    column: {
                        depth: 25
                    }
                },
                tooltip: {
                    //formatter: function () {

                    //    return '<b>' + this.series.name + ':</b>' + adddw(this.y, dw)+dw;

                    //}
                    shared: true,
                    valueSuffix: dw
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    //  borderWidth: 0
                },
                series: data
            }

        }
        else {
            $.each(data, function (n, vl) { if (data[n].name == val + wd) { data.splice(n, 1); return false; } });
        }
    }
    else {
        if (ck == true) {

            $.each(chardata.xAxis.categories, function (n, vl) { var y = 0; $.each(finddata, function (i1, filed) { if (finddata[i1][wd] == val && chardata.xAxis.categories[n] == finddata[i1][x_wd]) { y += Number(finddata[i1][y_wd]) } }); data_sub.push(Math.floor(y)); });

            chardata.series.push({ _colorIndex: Math.ceil(Math.random() * 10) - 1, _symbolIndex: Math.ceil(Math.random() * 5) - 1, name: val + wd, data: data_sub });

        }
        else { $.each(chardata.series, function (n, vl) { if (chardata.series[n].name == val + wd) { chardata.series.splice(n, 1); return false; } }); }
        chardata.chart.type = type;
    }
    $("#w"+div).highcharts(chardata);
    $("#" + div).data("chart",chardata);

}//绘制折线图表


function chart_bt(div) {
    //chart_zx("container", $("#container").attr("reportname"), $("#select_X").text(), xdata, $("#select_Y").text(), "元", data);
    var divfind ="f"+div ; 
    //var dataid = ($("#" + div).attr("data") == undefined) ? 0 : parseInt($("#" + div).attr("data"));
  // var quanju_data = ($("#" + div).attr("data") != undefined) ? $("#" + div.substring(0, div.length - 1)).data("data")[dataid] : $("#" + div).data("data")[dataid];
    var report = $("#" + div).data("report");
   // var chardata=$("#" + div).data("chart");
    var finddata = get_finddata(report.report[0].id, divfind, 0);
   // var finddata = get_finddata(quanju_data, divfind);
    var data = new Array(); var colors = Highcharts.getOptions().colors
    var xdata = new Array(); var data_sub = new Array(); var categories = new Array(); x_wd = $("#select_X" + div).val(); x_wd2 = $("#select_X2" + div).val(); var y_wd = $("#select_Y" + div).val(); var huizong = 0;

    $.each(finddata, function (j, field1) {
        huizong += Number(finddata[j][y_wd]); var y = 0;
        if ($.inArray(finddata[j][x_wd], xdata) == -1) { xdata.push(finddata[j][x_wd]) }

    })
    //xdata.sort();

    $.each(xdata, function (n, vl) {
        categories = []; var n1 = n; if (n > 9) { n1 = Math.round(n / 9) * n - 9 }
        $.each(finddata, function (j, field1) {
            if ($.inArray(finddata[j][x_wd2], categories) == -1 && finddata[j][x_wd] == xdata[n]) { categories.push(finddata[j][x_wd2]) }

        })
        categories.sort(); var yy = 0; data_sub = [];
        $.each(categories, function (i1, filed) {
            var y = 0;
            $.each(finddata, function (a, b) {
                if (categories[i1] == finddata[a][x_wd2] && xdata[n] == finddata[a][x_wd]) { y += Number(finddata[a][y_wd]) }

            });
            data_sub.push(Math.round(y * 10000 / huizong) / 100);
            yy += y;
        });
        data.push({
            y: Math.round(yy * 10000 / huizong) / 100, color: colors[n1], drilldown: { categories: categories, data: data_sub, color: colors[n] }
        });

    })




    // Build the data arrays
    var browserData = [];
    var versionsData = [];
    for (var i = 0; i < data.length; i++) {

        // add browser data
        browserData.push({
            name: xdata[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        for (var j = 0; j < data[i].drilldown.data.length; j++) {
            var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    // Create the chart
    var MyYou = {
        chart: {
            type: 'pie'
        },
        title: {
            text: $("#" + div).attr("reportname")
        },
        yAxis: {
            title: {
                text: $("#select_Y" + div).find("option:selected").text()
            }
        },

        tooltip: {
            valueSuffix: '%'
        }, credits: { enabled: false },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }, showInLegend: true,
            series: {
                cursor: 'pointer',
                events: {
                    click: function (event) {
                        // alert(event.point.category);

                        //alert(this.name + ' clicked\n' +
                        //      'Alt: ' + event.altKey + '\n' +
                        //      'Control: ' + event.ctrlKey + '\n' +
                        //      'Shift: ' + event.shiftKey + '\n');
                        var wdz = event.point.name;
                        var wd = event.point.series.index;
                        if (event.ctrlKey == true) {
                            chart_wdchange(wd, wdz, div, 0);
                        }
                        else if (event.altKey == true) {


                            chart_wdchange(wd, wdz, div, 1);
                        }
                        else if (event.shiftKey == true) {
                            chart_wdchange(wd, wdz, div, 2);
                        }
                    },
                    dblick: function (event) {
                        alert(1)
                    }
                }
            }
        },
        series: [{
            name: $("#select_X" + div).find("option:selected").text(),
            data: browserData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: 'white',
                distance: -30
            }
        }, {
            name: $("#select_X2" + div).find("option:selected").text(),
            data: versionsData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1

                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                }
            }
        }]
    }
    $('#' + div).highcharts(MyYou);
    $('#getcsv').click(function () {
        alert(chart.getCSV());
    });
}//绘制饼图图表

function chart_2y(div) {
    var divfind = "f"+div ; 
    var report = $("#" + div).data("report");
   // var chardata=$("#" + div).data("chart");
    var finddata = get_finddata(report.report[0].id, divfind, 0);
    var data = new Array(); var data2 = new Array();
    var xdata = new Array(); var data_sub = new Array(); var categories = new Array(); x_wd = $("#select_X" + div).val(); y_wd2 = $("#select_Y2" + div).val(); var y_wd = $("#select_Y" + div).val();
    // if (mychart == null) {
    $.each(finddata, function (j, field1) {
        //  alter(obj)
        if ($.inArray(finddata[j][x_wd], xdata) == -1) { xdata.push(finddata[j][x_wd]) }

    })
    //xdata.sort();
    var dw = "";
    $.each(report.vl, function (i, field1) {
        //  alter(obj)
        if (report.vl[i].report_field_name == y_wd) { dw = report.vl[i].vl_dw }
    });
    var mydata = get_char_data(xdata, report.vl, finddata, x_wd);

    var MyYou = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: "<i class=\"fa fa-gears\"></i>" + $("#" + div).attr("reportname")
        },
        xAxis: [{
            categories: xdata
        }], credits: { enabled: false },
        yAxis: [{ // Primary yAxis

            title: {
                text: $("#select_Y" + div).find("option:selected").text(),

            }
        }, { // Secondary yAxis
            title: {
                text: $("#select_Y2" + div).find("option:selected").text(),

            },

            opposite: true
        }],
        tooltip: {
            shared: true,
            valueSuffix: dw
        },

        plotOptions: {
            series: {
                cursor: 'pointer',
                events: {
                    click: function (event) {
                        var wdz = event.point.category;
                        if (event.ctrlKey == true) {


                            chart_wdchange(0, wdz, div, 0);
                        }
                        else if (event.altKey == true) { chart_wdchange(0, wdz, div, 1); }
                        else if (event.shiftKey == true) {
                            chart_wdchange(0, wdz, div, 2);
                        }
                    }
                }
            }
        },
        series: [{
            name: $("#select_Y" + div).find("option:selected").text(),
            color: '#4572A7',
            type: 'column',
            yAxis: 0,
            data: mydata[y_wd]


        }, {
            name: $("#select_Y2" + div).find("option:selected").text(),
            color: '#89A54E',
            type: 'spline',
            data: mydata[y_wd2]

        }]
    }
    $('#' + div).highcharts(MyYou);
    $('#getcsv').click(function () {
        alert(chart.getCSV());
    });
}//绘制2y图表


function chart_Stacked(div) {
    var divfind = "f"+div; 
    //var dataid = ($("#" + div).attr("data") == undefined) ? 0 : parseInt($("#" + div).attr("data"));
    var report = $("#" + div).data("report");
   // var chardata=$("#" + div).data("chart");
    var finddata = get_finddata(report.report[0].id, divfind, 0);
    var data = new Array(); var data2 = new Array();
    var xdata = new Array(); var data_sub = new Array(); var categories = new Array(); x_wd = $("#select_X" + div).val(); y_wd2 = $("#select_Y2" + div).val(); var y_wd = $("#select_Y" + div).val();
    // if (mychart == null) {
    $.each(finddata, function (j, field1) {
        //  alter(obj)
        if ($.inArray(finddata[j][x_wd], xdata) == -1) { xdata.push(finddata[j][x_wd]) }

    });
    var dw = "";
    $.each(report.vl, function (i, field1) {
        //  alter(obj)
        if (report.vl[i].report_field_name == y_wd) { dw = report.vl[i].vl_dw }
    });
    //xdata.sort();
    var mydata = get_char_data(xdata, report.vl, finddata, x_wd);

    var MyYou = {
        chart: {
            type: 'column'
        },
        title: {
            text: $("#" + div).attr("reportname")
        },
        xAxis: {
            categories: xdata
        }, credits: { enabled: false },
        yAxis: { // Primary yAxis
            title: {
                text: '按指标堆叠'
            },
            opposite: true
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true,
            valueSuffix: dw
            //formatter: function () {

            //        return '<b>' + this.series.name + ':</b> ' + adddw(this.y, dw)+dw+" " + Highcharts.numberFormat(this.percentage, 1) + '%';

            //}
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            },
            series: {

                cursor: 'pointer',
                events: {
                    click: function (event) {
                        var wdz = event.point.category;
                        if (event.ctrlKey == true) {


                            chart_wdchange(0, wdz, div, 0);
                        }
                        else if (event.altKey == true) { chart_wdchange(0, wdz, div, 1); }
                        else if (event.shiftKey == true) {
                            chart_wdchange(0, wdz, div, 2);
                        }
                    }
                }
            }
        },
        series: [{
            name: $("#select_Y" + div).find("option:selected").text(),
            color: '#4572A7',

            data: mydata[y_wd]


        }, {
            name: $("#select_Y2" + div).find("option:selected").text(),
            color: '#89A54E',

            data: mydata[y_wd2]

        }]
    }
    $('#' + div).highcharts(MyYou);
    $('#getcsv').click(function () {
        alert(chart.getCSV());
    });
}//百分比柱形图


function chart_Stacked2(div) {
    var divfind = "f"+div ; 
    var report = $("#" + div).data("report");
    var finddata = get_finddata(report.report[0].id, divfind, 0);
    var data = new Array(); var xdata2 = new Array();
    var xdata = new Array(); var data_sub = new Array(); var categories = new Array();var x_wd = $("#select_X" + div).val();var x_wd2 = $("#select_X2" + div).val(); var y_wd = $("#select_Y" + div).val();
    // if (mychart == null) {
    $.each(finddata, function (j, field1) {
        //  alter(obj)
        if ($.inArray(finddata[j][x_wd], xdata) == -1) { xdata.push(finddata[j][x_wd]) }
        if ($.inArray(finddata[j][x_wd2], xdata2) == -1) { xdata2.push(finddata[j][x_wd2]) }

    })
    //xdata.sort();
    var mydata = get_char_data(xdata, report.vl, finddata, x_wd);
    var mydata2 = get_char_data(xdata2, report.vl, finddata, x_wd2);
  var MyYou = {
        chart: {
            type: 'column'
        },
        title: {
            text: $("#" + div).attr("reportname")
        },
        xAxis: {
            categories: xdata
        }, credits: { enabled: false },
        yAxis: { // Primary yAxis
            title: {
                text: 'Total fruit consumption'
            },
            opposite: true
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true,
            valueSuffix: report.vl[0].vl_dw
        },

        plotOptions: {
            column: {
                stacking: 'percent'
            },
            series: {

                cursor: 'pointer',
                events: {
                    click: function (event) {
                        var wdz = event.point.category;
                        if (event.ctrlKey == true) {


                            chart_wdchange(0, wdz, div, 0);
                        }
                        else if (event.altKey == true) { chart_wdchange(0, wdz, div, 1); }
                        else if (event.shiftKey == true) {
                            chart_wdchange(0, wdz, div, 2);
                        }
                    }
                }
            }
        },
        series: [{
            name: $("#select_Y" + div).find("option:selected").text(),
            color: '#4572A7',

            data: mydata[y_wd]


        }, {
            name: $("#select_Y2" + div).find("option:selected").text(),
            color: '#89A54E',

            data: mydata2[y_wd]

        }]
    }
    $('#' + div).highcharts(MyYou);
    $('#getcsv').click(function () {
        alert(chart.getCSV());
    });
}//维度百分比柱形图

function chart_3y(div) {
    var divfind = "f"+div;
    var report = $("#" + div).data("report");
    var finddata = get_finddata(report.report[0].id, divfind, 0);
    var data = new Array(); var data2 = new Array(); var data3 = new Array();
    var xdata = new Array(); var data_sub = new Array(); var categories = new Array();var x_wd = $("#select_X" + div).val();
    var  y_wd2 = $("#select_Y2" + div).val(); var y_wd = $("#select_Y" + div).val(); var y_wd3 = $("#select_Y3" + div).val();
    $.each(finddata, function (j, field1) {
        if ($.inArray(finddata[j][x_wd], xdata) == -1) { xdata.push(finddata[j][x_wd]) }

    })
    var y1dw = ""; var y2dw = ""; var y3dw = "";
    $.each(report.vl, function (i, field1) {
        //  alter(obj)
        if (report.vl[i].report_field_name == y_wd) { y1dw = report.vl[i].vl_dw }
        if (report.vl[i].report_field_name == y_wd2) { y2dw = report.vl[i].vl_dw }
        if (report.vl[i].report_field_name == y_wd3) { y3dw = report.vl[i].vl_dw }
    });
    //xdata.sort();
    var mydata = get_char_data(xdata, report.vl, finddata, x_wd);
 var MyYou = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: $("#" + div).attr("reportname")
        },
        xAxis: [{
            categories: xdata
        }], credits: { enabled: false },
        yAxis: [
            { // Secondary yAxis
                title: {
                    text: $("#select_Y3" + div).find("option:selected").text(),

                },
                // min: 0,
                labels: {
                    format: '{value}'+y3dw
                },

                opposite: true
            }, { // Primary yAxis

                title: {
                    text: $("#select_Y" + div).find("option:selected").text(),

                },
                labels: {
                    format: '{value} ' + y1dw
                }
            }, { // Secondary yAxis
                title: {
                    text: $("#select_Y2" + div).find("option:selected").text(),

                },

                opposite: true
            }],
        tooltip: {
            shared: true,
            valueSuffix: y1dw
        }, credits: { enabled: false },
        plotOptions: {
            series: {
                cursor: 'pointer',
                events: {
                    click: function (event) {
                        var z = event.point.category;
                        if (event.ctrlKey == true) {
                            chart_wdchange(0, z, div, 0);
                        }
                        else if (event.altKey == true) {
                            chart_wdchange(0, z, div, 1);
                        }
                        else if (event.shiftKey == true) {
                            chart_wdchange(0, z, div, 2);
                        }
                    }
                }
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: '显示查询',
                        onclick: function () {
                            chart_show_find(div)
                        }
                    }
                    ]


                }
            }
        },
        series: [{
            name: $("#select_Y" + div).find("option:selected").text(),
            color: '#4572A7',
            type: 'column',
            yAxis: 1,
            data: mydata[y_wd],
            tooltip: {
                valueSuffix: y1dw
            }



        }, {
            name: $("#select_Y2" + div).find("option:selected").text(),
            color: '#89A54E',
            type: 'column',
            yAxis: 1,
            data: mydata[y_wd2],
            tooltip: {
                valueSuffix: y2dw
            }

        }, {
            name: $("#select_Y3" + div).find("option:selected").text(),
            color: '#606060',
            type: 'spline',
            yAxis: 0,
            data: mydata[y_wd3],
            tooltip: {
                valueSuffix: y3dw
            }
        }]
    }
    $('#' + div).highcharts(MyYou);
    $('#getcsv').click(function () {
        alert(chart.getCSV());
    });
}//绘制3y图表


function chart_tsb(div) {
    //$("#downtsb" + div).show();
    $("#"+div).append("<div id='downtsb"+div+"'></div>");
    $("#"+div).empty();
    var divfind = "f"+div; var ls = 1; var thl = ""; var thr = ""; var wtr; var wth = "";
    var wdarr = new Array(); var xdata = new Array(); var ydata = new Array(); var newdata = new Array(); var new_data = new Array();
  
    var report = $("#" + div).data("report");
    var finddata = get_finddata(report.report[0].id, divfind, 0);
    $("#" + div).append("<table class='tsb_table' style = 'display: none'  id='table_" + div + "'></table>");
    var wd = report.group; var vl = report.vl;
    wd.sort(function (a, b) { return a.lpos - b.lpos });
    if ($("#select_X" + div).val() != "") {
        ls++;
        $.each(wd, function (j, field1) { if (wd[j].report_field_name == $("#select_X" + div).val()) { wd.push(wd.splice(j, 1)[0]) } })
    }
    if ($("#select_X2" + div).val() != "") {
        ls++;
        $.each(wd, function (j, field1) { if (wd[j].report_field_name == $("#select_X2" + div).val()) { wd.push(wd.splice(j, 1)[0]) } })
    }
    if ($("#select_X3" + div).val() != "") {
        ls++;
        $.each(wd, function (j, field1) { if (wd[j].report_field_name == $("#select_X3" + div).val()) { wd.push(wd.splice(j, 1)[0]) } })
    }

    if (ls > 1) {
        $.each(wd, function (j, field1) {
            wdarr[j] = new Array();
            var x_wd = wd[j].report_field_name;
            $.each(finddata, function (j1, field1) {
                var w = (finddata[j1][x_wd] == "" || finddata[j1][x_wd] == undefined) ? "" : finddata[j1][x_wd];

                if (j == 0) { finddata[j1]["zx_lpos"] = ""; }
                var zx_lpos = finddata[j1]["zx_lpos"];
                if ($.inArray(w, wdarr[j]) == -1) { finddata[j1]["zx_lpos"] = zx_lpos + wdarr[j].length + "-"; wdarr[j].push(w); }
                else { finddata[j1]["zx_lpos"] = zx_lpos + arrindexof(wdarr[j], w) + "-" }

                if (j == wd.length - 1) {
                    var n = findchar(finddata[j1]["zx_lpos"].substring(0, finddata[j1]["zx_lpos"].length - 1), "-", wd.length - ls + 1)
                    if ($.inArray(finddata[j1]["zx_lpos"].substring(0, n), xdata) == -1) {
                        xdata.push(finddata[j1]["zx_lpos"].substring(0, n))
                    }
                    if ($.inArray(finddata[j1]["zx_lpos"], new_data) == -1) {
                        new_data.push(finddata[j1]["zx_lpos"])
                        var aa = { "zx_lpos": finddata[j1].zx_lpos }
                        $.each(vl, function (c, dat) { aa[vl[c].report_field_name] = 0 })
                        newdata.push(aa)
                    }
                    if ($.inArray(finddata[j1]["zx_lpos"].substring(n + 1, finddata[j1]["zx_lpos"].length - 1), ydata) == -1 && ls > 1)
                    { ydata.push(finddata[j1]["zx_lpos"].substring(n + 1, finddata[j1]["zx_lpos"].length - 1)) }

                }
            })
        })
    }
    else {
        $.each(finddata, function (j1, field1) {
            var zx_lpos = finddata[j1]["zx_lpos"];
            finddata[j1]["zx_lpos"] = zx_lpos + "-";

            var n = findchar(finddata[j1]["zx_lpos"].substring(0, finddata[j1]["zx_lpos"].length - 1), "-", 1)
            if ($.inArray(finddata[j1]["zx_lpos"].substring(0, n), xdata) == -1) {
                xdata.push(finddata[j1]["zx_lpos"].substring(0, n))
            }
            if ($.inArray(finddata[j1]["zx_lpos"], new_data) == -1) {
                new_data.push(finddata[j1]["zx_lpos"])
                var aa = { "zx_lpos": finddata[j1].zx_lpos }
                $.each(vl, function (c, dat) { aa[vl[c].report_field_name] = 0 })
                newdata.push(aa)
            }
        })
    }
    $.each(newdata, function (t, da) {
        $.each(finddata, function (j2, fil) {
            if (finddata[j2].zx_lpos == newdata[t].zx_lpos) {
                $.each(vl, function (c, dat) {

                    var vv = vl[c].report_field_name;
                    newdata[t][vv] = parseFloat(finddata[j2][vv]) + parseFloat(newdata[t][vv])

                })
            }
        })
    })

    for (var i = xdata.length - 1; i >= 0; i--) {
        var chararr = xdata[i].split("-");
        var td = "";
        if (i < xdata.length - 1) {
            var wtrarr = wtr.split("-"); var js = 0; var zk = 0;
            for (var t = 0; t < chararr.length; t++) {

                if (chararr[t] == wtrarr[t]) {

                    if (js == 0) {
                        var row = 1 + parseInt($("#" + wtr).children("td").eq(t - zk).attr("rowspan"));
                        $("#" + wtr).children("td").eq(t - zk).remove();
                        td += "<td tsb rowspan='" + row + "'>" + wdarr[t][parseInt(chararr[t])] + "</td>";
                        zk++;
                    } else {
                        td += "<td tsb rowspan='1'>" + wdarr[t][parseInt(chararr[t])] + "</td>";
                    }


                } else {

                    td += "<td tsb rowspan='1'>" + wdarr[t][parseInt(chararr[t])] + "</td>";
                    js++;
                }
            }
        } else {
            for (var t = 0; t < chararr.length; t++) {
                thl += "<th  rowspan='" + ls + "'>" + wd[t].chname + "</th>";
                td += "<td tsb rowspan='1'>" + wdarr[t][parseInt(chararr[t])] + "</td>";

            }

        }
        $.each(ydata, function (j, da) {
            $.each(vl, function (t, data) {

                td += "<td  id='" + div + xdata[i] + "-" + ydata[j] + "-" + vl[t].report_field_name + "'></td>";
            })

        })

        wtr = xdata[i];
        $("#table_" + div).prepend("<tr id='" + wtr + "'>" + td + "</tr>")
    }

    //  var colrow=wd
    for (var t = 0; t < ls; t++) {

        if (t == 0) {
            $.each(ydata, function (i, da) {
                $.each(vl, function (t, data) { thr += "<th>" + vl[t].chname + "</th>" })
            })
            $("#table_" + div).prepend("<tr>" + thr + "</tr>")
        }
        else {
            thr = ""; var js = 0;
            $.each(ydata, function (i, da) {
                var warr = ""; var ii = parseInt(wd.length) - parseInt(ls) + parseInt(t); var iiname; var iiname_next
                var chararr = ydata[i].substring(findchar(ydata[i], "-", t - 1) + 1, ydata[i].length)//.split("-");
                warr = wth.substring(findchar(wth, "-", t - 1) + 1, wth.length)//.split("-"); }
                if (t == ls - 1) {
                    iiname = wdarr[ii][parseInt(ydata[i].substring(findchar(ydata[i], "-", t - 1) + 1, ydata[i].length))]
                    iiname_next = wdarr[ii][parseInt(wth.substring(findchar(wth, "-", t - 1) + 1, wth.length))]
                } else {

                    iiname = wdarr[ii][parseInt(ydata[i].substring(findchar(ydata[i], "-", t - 1) + 1, findchar(ydata[i], "-", t)))]
                    iiname_next = wdarr[ii][parseInt(wth.substring(findchar(wth, "-", t - 1) + 1, findchar(wth, "-", t)))]
                }

                if (t == 1) {
                    if (chararr != warr) {
                        thr += "<th colspan='" + (js + 1) * vl.length + "'>" + iiname + "</th>"

                        js = 0
                    }
                    else {
                        js++
                    }
                }
                else if (t > 1) {
                    if (chararr != warr && i != 0 && i != ydata.length - 1) {
                        thr += "<th colspan='" + (js + 1) * vl.length + "'>" + iiname_next + "</th>"

                        js = 0
                    }
                    else if (i == ydata.length - 1) {
                        if (chararr == warr) { js++ } else { thr += "<th colspan='" + (js + 1) * vl.length + "'>" + iiname_next + "</th>" }
                        thr += "<th colspan='" + (js + 1) * vl.length + "'>" + iiname + "</th>"
                    }
                    else if (i == 0) { js = 0 }
                    else {
                        js++
                    }
                }

                wth = ydata[i];
            })
            if (t == ls - 1) {
                $("#table_" + div).prepend("<tr>" + thl + thr + "</tr>")
            }
            else { $("#table_" + div).prepend("<tr>" + thr + "</tr>") }
        }





    }


    $.each(newdata, function (i, da) {
        var zx_lpos = newdata[i].zx_lpos
        $.each(vl, function (t, data) {
            var valname = vl[t].report_field_name;
            var dw = vl[t].vl_dw
            var aaa = newdata[i][valname];
            if (dw.indexOf("万") != -1) { aaa = Math.round(parseFloat(aaa) * 0.0001); aaa = addCommas(aaa) + dw }
            else if (dw.indexOf("千") != -1) { aaa = Math.round(parseFloat(aaa) * 0.001); aaa = addCommas(aaa) + dw }
            else if (dw.indexOf("百") != -1) { aaa = Math.round(parseFloat(aaa) * 0.01); aaa = addCommas(aaa) + dw }
            else { aaa = aaa + dw }
            $("#" + div + zx_lpos + valname).text(aaa);
        })

    })

    $("#table_" + div).show()

}

function chart_tsb_down(div) {

    var html = $("#table_" + div).html()
    html = html.replace(/\"/g, "'");
    var htm = {
        text: html
    }
    var reportname = $("#" + div).attr("reportname");
    $.post("Handler.ashx?action=chart_tsb_down&id=" + reportname, htm, function (result) {
        if (result) {
            var curWwwPath = window.document.location.href
            var path = curWwwPath.substring(0, curWwwPath.indexOf(window.document.location.pathname));
            window.open(path + "\\consys\\templet\\" + result)
        }
    })
}
function arrindexof(a, value) {
    // var a = this;//为了增加方法扩展适应性。我这稍微修改了下
    for (var i = 0; i < a.length; i++) {
        if (a[i] == value)
        { return i; }
    }
    return -1;
}
function findchar(str, b, n) {
    var t = -1;
    if (n < (str.length - str.replace(b, "").length)) { return -1; }
    else {
        for (var i = 0; i < n; i++) {
            t = str.indexOf(b, t + 1);
        }
    }
    return t;
}
function chart_show_find(div) {
    $("#f" + div ).show(); $("#o" + div ).show();
    var index = layer.open({
        type: 1, //page层
        area: ['750px', '200px'],
        title: "查询筛选："+$("#" + div).attr("reportname"),
        shade: false, //遮罩透明度
     //   shift: 1, //0-6的动画形式，-1不开启
        // closeBtn: true,
        // closeBtn: false,
        content: $("#s" + div)
    });

}