function getOperConfig(opId, id, div) {
     let postData = {
        action: "getOperConfig",
        opid: opId,
        id: id,
        ignoreWarn:0
    }
    toAjaxCRUDCallBack(service, postData, function (result) {

        let operation = result.operation;
        let uitype = operation.uitype;

        if (uitype == 'oper_type_ui_5') {
            getLpos(opId, id, guid(), result.data);
        }
        else if (uitype == 'oper_type_ui_6') {
            let newId = addTab(operation.chname, "path_type_2", operation.ico);
            $("#" + newId).append("<div  id='" + newId + 0 + "'></div>");
            insertList(opId, id, newId, result,0);
        }
        else if (uitype == '11748d5871d2476c9d20dfdf23bba126') {
            $.each(result.data, function (i, da) {
                if ((da.where_1 != "" && da.where_1 != "id") || (da.where_3 != "" && da.where_2 != "")) {
                    where = "v." + da.where_0 + "='" + da.where_1 + "' and v." + da.where_2 + "='" + da.where_3 + "'"
                } else { where = "v." + da.where_0 + "='" + id + "'"; }
                let newWindow = guid();
                $("body").append('<div id="' + newWindow + '" class="am-g am-form-inline" ><div id="f' + newWindow + '"  class="am-u-md-8" style="width: auto; float: right;"></div><div id="c' + newWindow + '"><table width="100%"     class="am-table am-table-striped am-table-hover table-main am-text-nowrap"  id = "table' + newWindow + '" ></table ></div><div id="p' + newWindow + '"></div></div>');
                setData(newWindow, "hold_where", where);
                operCheckList(da.listid, newWindow, where);
                setDivCenter(newWindow, "列表查看", 800);
            })
        }
        else if (uitype == '2dac247cfc425a6549305783293afc9b') 
        {
            let newId = addTab(operation.chname, "path_type_2", operation.ico);
            updataFileForInput('0d62b33e5c52e88bf3257a3fe3f62223', newId, '.xlsx', opId);
          
            }
       else {
            if (operation.operatetype == 'oper_type_edit' || operation.operatetype =='efa7661f851f4c861571952a0136af85') {
                let newWindow = guid();
                $("body").append('<div id="' + newWindow + '"><div id="f' + newWindow + '"  ></div><div  class="am-panel-group" id="c' + newWindow + '"></div><div class="am-btn-toolbar" style="width:100%;height:auto;margin-bottom: 5px;text-align: center;" id="p' + newWindow + '"></div></div>');
                createCard(result, newWindow, id, opId, div, function (data) {
                    setDivCenter(newWindow, operation.chname, 800);
                });
               

            }
            else { 
                let newId = addTab(operation.chname, "path_type_2", operation.ico);
            createCard(result, newId, id, opId, div, function (data) {
             
            });
        }
        }

    })
}
function runOper(opId, id, div, uitype, operatetype,fromType) {
    $("#operlist_div").remove();
           
            let message = "确认执行吗？"
    if (uitype == "oper_type_ui_0" || uitype == "oper_type_ui_8" || uitype == "93ea8dc637c5fba7db193ff9cf45ff3f") {
        $.messager.confirm('Confirm', message, function (r) {
            if (r) {

                let postData = {
                    action: "runOper",
                    opid: opId,
                    id: id,
                }
                toAjaxCRUDCallBack(service, postData, function (result) {



                    if (operatetype == "oper_type_del" || operatetype == "031d3d8ffd0d8e1636e43002ce109172" || operatetype == "089a0f17d9db45771f114cd372083efc" || operatetype == "77b0b9dbdf07f223da65b8031f5fa772" || operatetype == "301c6a6ad4e45945495228454ff19402") {
                        if (fromType == "card") {
                            let tab = $("#tab").tabs("getSelected"); //获取当前选中的tab对象
                            let index = $("#tab").tabs("getTabIndex", tab);  //获取当前tab的索引
                            $("#tab").tabs("close", index);
                            //$('#' + div).tabs("close");
                        } else if (fromType == "insertList") {
                            let selectrow = $('#' + div).datagrid('getChecked')[0];
                            let index = $('#' + div).datagrid('getRowIndex', selectrow);
                            $('#' + div).datagrid('deleteRow', index);
                        }
                        else
                            $('#p' + div).pagination('select');
                        if (uitype != 'oper_type_ui_4')
                            $.messager.alert('执行结果', "成功", 'info')
                    }

                })

            }
        });
    }
    else {

        let postData = {
            action: "runOper",
            opid: opId,
            id: id,
        }
        toAjaxCRUDCallBack(service, postData, function (result) {



            if (operatetype == "oper_type_del" || operatetype == "031d3d8ffd0d8e1636e43002ce109172" || operatetype == "089a0f17d9db45771f114cd372083efc" || operatetype == "77b0b9dbdf07f223da65b8031f5fa772" || operatetype == "301c6a6ad4e45945495228454ff19402") {
                if (fromType == "card") {
                    let tab = $("#tab").tabs("getSelected"); //获取当前选中的tab对象
                    let index = $("#tab").tabs("getTabIndex", tab);  //获取当前tab的索引
                    $("#tab").tabs("close", index);
                    //$('#' + div).tabs("close");
                }
                else
                    $('#p' + div).pagination('select');
                if (uitype != 'oper_type_ui_4')
                    $.messager.alert('执行结果', "成功", 'info')
            }

        })

    }
        

  
}

function createCard(result, div, id, opId, carryOnDiv, callback) {
    setData(div, "operConfig", result);
    let operation = result.operation;
    let uitype = operation.uitype;
    let operatetype = operation.operatetype;
    let cardhtml = $("#c" + div);

   
    //普通界面，明细界面
    if (uitype == "oper_type_ui_1" || uitype == "oper_type_ui_7" ) {
        let group = result.group;
        group.sort(function (a, b) { return a.lpos - b.lpos });
        let related = false;
        $.each(group, function (i, field1) {
            if (group[i].type == "group_0" && operatetype != 'oper_type_check') {
                cardhtml.append("<div   class='am-panel am-panel-default'><div class='am-panel-hd'><h4 class='am-panel-title' data-am-collapse=\"{target:\'#" + div + i + "\' }\">" + group[i].chname + "</h4> </div><div id=\'" + div + i + "\' class='am-panel-collapse am-collapse am-in'></div></div>");
                createGroup0FieldForNew(group[i].field, group[i].ls, div , i);//创建分组字段
            }
            else if (group[i].type == "group_0" && operatetype == 'oper_type_check') {
              //  cardhtml.append("<div  id='" + div + i + "'><fieldset> <legend>" + group[i].chname + " <i class='am-icon-edit fa-lg' id='btn_" + div + i + "' onclick=group_edit('" + div +"',"+ i + ")></i><i class='am-icon-check fa-lg' id='save" + div + i + "' style='display: none;' onclick=group_save('" + div + "','" + opId + "','" + id + "','" + i + "')></i><i class='am-icon-close fa-lg' id='cancel" + div + i + "' style='display: none;' onclick=group_cancel('" + div+"'," + i + ")></i></legend> </fieldset></div>");
                cardhtml.append("<div   class='am-panel am-panel-default'><div class='am-panel-hd'><h4 class='am-panel-title' data-am-collapse=\"{target:\'#" + div + i + "\' }\">" + group[i].chname + "</h4> </div><div id=\'" + div + i + "\' class='am-panel-collapse am-collapse am-in'></div></div>");
                createGroup0FieldForData(group[i].field, group[i].ls, div, i);//创建分组字段
            }
            if (group[i].type == "group_1" || group[i].type == "group_2") related = true;
        });
        if (related) {

            $.each(group, function (i, field1) {
                if ((group[i].type == "group_1" || group[i].type == "group_2") && operatetype == 'oper_type_check') {
                   // let html = '<div id="group' + div + i + '"  data-options="selected:false" class="easyui-accordion" style="width:100%;height:auto;"><div title="' + group[i].chname + '"  style="overflow:auto;"><div id="group_1' + div + i + '"  ></div></div></div>';
                   // cardhtml.append(html);
                    cardhtml.append("<div   class='am-panel am-panel-default'><div class='am-panel-hd' ><h4 id=\'group_H" + div + i + "\' class='am-panel-title' data-am-collapse=\"{target:\'#group_1" + div + i + "\' }\">" + group[i].chname + "</h4> </div><div id=\'group_1" + div + i + "\' class='am-panel-collapse am-collapse am-in'></div></div>");
                  //  $('#group_H' + div + i).bind('click', function () {
                        //alert(1);
                            //if ($('#group_1' + div + i).html() == "") {
                                let newWindow = div+i;
                    $('#group_1' + div + i).append('<div id="' + newWindow + '" carryOnDiv="' + div + '"  ><div  class="am-u-md-4 am-btn-toolbar" id="t' + newWindow + '"></div><table width="100%"      class="am-table am-table-striped am-table-hover table-main am-text-nowrap"  id = "table' + newWindow +'" ></table ><div id="p' + newWindow + '"></div><div style="display: none;" id="f' + newWindow + '"></div></div>');
                                let where = "v." + group[i].object_field + "='" + id + "'";
                                $("#" + div).attr("realId", id);
                                $("#" + div).attr("opId", opId);
                                createList(group[i].typeui, newWindow, where);
                                setData(newWindow, "hold_where", where);
                                $('#group_H' + div + i).click();
                           // }


                        
                   // }) 
            
                }
                else if ((group[i].type == "group_1" || group[i].type == "group_2") && operatetype != 'oper_type_check') {
                    let html = "<div  id='group_1" + div + i + "'><fieldset><legend>" + group[i].chname + "</legend> </fieldset></div>";
                    cardhtml.append(html);
                   // let newWindow = guid();
                    $('#group_1' + div + i).append('<div id="' + div + i + '"></div>');
                    createListForEdit(div, i);
                
                }
                // if (group[i].type == "group_1") createGroup1Field(group[i].field, group[i].ls, div + i, div);//创建分组字段
            });
        }

            if (operatetype == 'oper_type_check') {

                //获取一条数据
                getOneData(opId, id, div, carryOnDiv);
                $("#f" + div).show();
            }
            else if (operatetype == 'oper_type_edit') {
                getOneDataForEdit(opId, id, div, carryOnDiv);
            }
            else if (operatetype == 'efa7661f851f4c861571952a0136af85') {//如果是从sap导入数据
                let saveBtn = {
                    id: "save" + div,
                    ico: "save",
                    ui: "Save",
                    text: "获取数据"
                }

                createBtn(div, saveBtn);

                $('#save' + div).bind('click', function () {
                    if (validate(div, group, result.verify))
                        saveSap(div, opId, group, operation.listid, carryOnDiv);
                });
            }
            else if (operatetype == 'oper_type_new') {
                let oldDiv = $("#" + carryOnDiv).attr("carryOnDiv");
                if (oldDiv) {
                    let oldData = getData(oldDiv, "oneData").data;
                    let idFeild = getData(oldDiv, "oneData").idfield;
                    let obId = getData(oldDiv, "obId");
                    let mapping = getData(div, "operConfig").mapping;
                    for (let i = 0; i < mapping.length; i++) {
                        let wj = mapping[i].field_wj;
                        let chnameId = mapping[i].chnameId;
                        let chnameText = oldData[chnameId];
                        let t = $("#" + div + " [id='" + wj + "']");
                        t.val('setValue', obId);
                        $("#" + div + " [id='" + wj + "_show']").val( chnameText);
                        let tMapping = mapping[i].mapping;

                        for (let j = 0; j < tMapping.length; j++) {
                            let newkey = tMapping[j].idto;
                            let key = tMapping[j].idfrom;
                            let t = $("#" + div + " [id='" + newkey + "']");
                            let type = "", tshow="";
                            for (let k = 0; k < idFeild.length; k++) {
                                if (idFeild[k].id == key)
                                    type = idFeild[k].fieldui;
                            }
                            switch (type) {
                                case "enum0":
                                    t.val(oldData[key]);
                                    break
                                case "refer0":
                                    t.val(oldData[key]);
                                    tshow = oldData[key + "_show"];
                                    $("#" + div + " [id='" + newkey + "_show']").val( tshow);
                                    break;

                                case "refer3":
                                    t.val(oldData[key]);
                                    tshow = oldData[key + "_show"];
                                    $("#" + div + " [id='" + newkey + "_show']").val(tshow);
                                    break;

                                case "bool":
                                    t.val(oldData[key]);
                                    break;
                                default:
                                    t.val(oldData[key]);
                                    break;
                            }
                        }
                    }

                }
                let saveBtn = {
                    id: "save" + div,
                    ico: "save",
                      ui: "Save",
                    text: "保存"
                }
                let cancelBtn = {
                    id: "cancel" + div,
                    ico: "close",
                    ui: "danger",
                    text: "取消"
                }
                createBtn("f" + div, saveBtn);
                createBtn("f" + div, cancelBtn);
                $('#save' + div).bind('click', function () {
                    if (validate(div, group, result.verify))
                        save(div, opId, group, '');
                });
                $('#cancel' + div).bind('click', function () {
                    $('#close' + div).click();
                //  layer.close(  $("#" + div).attr("index"));
                });
            }
        
       
    }
    callback(1);
}
//新增时字段生成
function createGroup0FieldForNew(obj, c, carryOnDiv,divrow) {
    let Default = "", ls = 0, row = 0;
    let div = carryOnDiv + divrow;
    let labLength = c == 2 ? 2 : 1;
    let width = 0;
    if (c == 2) width = 96;
    else if (c == 3) width = 97.5;
    //布局
    $.each(obj, function (i, field1) {
        if (i == 0) {
            $("#" + div).append('<div id="' + div + row + '" class="am-g  am-form-icon am-form-feedback" ></div>');
            if (isFatField(obj[i].fieldui))
                ls = c - 1;
            else
                ls = 0;
        }
        else if ((i > 0 && ls == c - 1) || isFatField(obj[i].fieldui)) {
            row++;
            $("#" + div).append('<div id="' + div + row + '" class="am-g am-form-icon am-form-feedback"></div>');
            if (isFatField(obj[i].fieldui))
                ls = c - 1;
            else
                ls = 0;
        }
        else {
            ls++;
        }
        if (obj[i].Default1.indexOf("sys_") != -1) { Default = sys_f_analyse(div, obj[i].Default1); } else { Default = obj[i].Default1; }
        let required = obj[i].lnull == 1 ? "" : "required";
        switch (obj[i].fieldui) {
            case "string1":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-12"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field" type="text" id="' + obj[i].id + '" value="' + Default+'" '+required+'></div></div>');

                break;
            case "string2":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-12"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><textarea style="height:150px;" class="am-form-field" type="text" id="' + obj[i].id + '" ' + required + '>' + Default +'</textarea></div></div>');
               break;
            case "refer0":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"   type="text" id="' + obj[i].id + '_show" ' + required + ' value="' + Default + '"><input  type="hidden" id="' + obj[i].id + '" ' + required + '><i class="am-icon-search" onclick=checkIsOpenList("' + carryOnDiv + '","' + obj[i].list + '","' + obj[i].id + '","' + divrow+'") ></i></div></div>');
                break;
        case "bool":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><select  class="am-form-field"  id="' + obj[i].id + '" ' + required +'><option value=""></option><option value="1">是</option><option value="0">否</option></select><i class="am-icon-caret-down"></i></div></div>');
                $("#" + div + " :input[id='" + obj[i].id + "']").selected({ btnWidth: '100%' });
               // $('#' + obj[i].id).selected({ btnWidth: '100%' });
                break;
  
            case "enum0":
               // $("#" + div + row).append('<div style="margin-top:1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><select  class="am-form-field"  id="' + obj[i].id + '" ></select><i class="am-icon-caret-down"></i></div></div>');
                let enumData = obj[i].field_enum.sort(function (a, b) { return a.lpos - b.lpos });
                let html = "";
                for (let i1 = 0; i1 < enumData.length; i1++) {
                    html += "<option value='" + enumData[i1].id + "'>" + enumData[i1].chname + "</option>";
                };
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><select  class="am-form-field"  id="' + obj[i].id + '" data-am-selected  ' + required +'>'+html+'</select></div></div>');
                $("#" + div + " :input[id='" + obj[i].id + "']").selected({ btnWidth: '100%' });
                break;
            case "refer3": //复合参照
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"   type="text" id="' + obj[i].id + '_show" ' + required + '><input  type="hidden" id="' + obj[i].id + '" ' + required +'><i class="am-icon-search"></i></div></div>');
                break;
            case "ebe653a2e0281e795959923808216446"://多选参照
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"   type="text" id="' + obj[i].id + '_show" ' + required + '><input  type="hidden" id="' + obj[i].id + '" ' + required +'><i class="am-icon-search"></i></div></div>');
               
                break;
            case "field_type_sdate_ui":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm" ><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"  type="text" id="' + obj[i].id + '" ' + required +'></div></div>');
                $("#" + div + " [id=" + obj[i].id + "]").datepicker({ format: 'yyyy-mm-dd' });
              break;
                
            case "field_type_ldate_ui":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm" ><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"  type="text" id="' + obj[i].id + '" ' + required +'></div></div>');
               $("#" + div + " [id=" + obj[i].id + "]").datepicker({ format: 'yyyy-mm-dd' });
                break;
            case "1e6f860fbcd16cafc124f35e7b86fa88"://图标选择
                  
                        $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field" type="text" id="' + obj[i].id + '" value="' + Default + '" ' + required + '><i class="am-icon-search" onclick=selectIco("' + obj[i].id + '","' + div + '") ></i></div></div>');    
                
                  break;
              case "9053dbd845b67d7d15b10c2f482e4723"://文件下载或上传
                $("#" + div + row).append('<td   class="am-form-field" colspan="' + c + '"><input type="text"  id=\"' + obj[i].id + '\" ' + required +'></td>');
                break; 
            default:
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field" type="text" id="' + obj[i].id + '" value="' + Default +'" ' + required +'></div></div>');
                break;

        }
    });
 


    } 
//创建卡片字段
//查看时字段生成
function createGroup0FieldForData(obj, c, carryOnDiv, divrow) {
    let ls = 0, row = 0, div = carryOnDiv + divrow;
    //布局
    $.each(obj, function (i, field1) {
        if (i == 0) {
            $("#" + div).append('<div id="' + div + row + '" class="am-g am-form-icon am-form-feedback"></div>');
            if (isFatField(obj[i].fieldui))
                ls = c - 1;
            else
                ls = 0;
        }
        else if ((i > 0 && ls == c - 1)|| isFatField(obj[i].fieldui))  {
            row++;
              $("#" + div).append('<div id="' + div + row + '" class="am-g am-form-icon am-form-feedback"></div>');
            if (isFatField(obj[i].fieldui) )
                ls = c - 1;
            else
                ls = 0;
        }
        else {
            ls++;
        }
        let required = obj[i].lnull == 1 ? "" : "required";
        switch (obj[i].fieldui) {
            case "string1":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-12"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field" type="text" id="' + obj[i].id + '" ' + required+'></div></div>');

                break;
            case "string2":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-12"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><textarea style="height:150px;" class="am-form-field" type="text" id="' + obj[i].id + '" ' + required +'></textarea></div></div>');
                break;
            case "bool":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><select  class="am-form-field"  id="' + obj[i].id + '" ' + required +'><option value=""></option><option value="1">是</option><option value="0">否</option></select></div></div>');
              //  $('#' + obj[i].id).selected({ btnWidth: '100%' });
                break;

            case "enum0":
                let enumData = obj[i].field_enum.sort(function (a, b) { return a.lpos - b.lpos });
                let html = "";
                for (let i1 = 0; i1 < enumData.length; i1++) {
                    html += "<option value='" + enumData[i1].id + "'>" + enumData[i1].chname + "</option>";
                };
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><select  class="am-form-field"  id="' + obj[i].id + '" data-am-selected  ' + required +'>' + html + '</select></div></div>');
                $('#' + obj[i].id).selected({ btnWidth: '100%'});
                break;
            case "refer0":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"   type="text" id="' + obj[i].id + '_show" ' + required + '><input  type="hidden" id="' + obj[i].id + '" ><i class="am-icon-search"  onclick=checkIsOpenList("' + carryOnDiv + '","' + obj[i].list + '","' + obj[i].id + '","' + divrow +'") ></i></div></div>');
                break;
            case "refer3": //复合参照
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"   type="text" id="' + obj[i].id + '_show" ' + required +'><input  type="hidden" id="' + obj[i].id + '" ><i class="am-icon-search"></i></div></div>');
                break;
            case "ebe653a2e0281e795959923808216446"://多选参照
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"   type="text" id="' + obj[i].id + '_show" ' + required +'><input type="hidden" id="' + obj[i].id + '" ><i class="am-icon-search"></i></div></div>');
                break;
            case "field_type_sdate_ui":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm" ><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"  type="text" id="' + obj[i].id + '" ' + required +'></div></div>');
                $("#" + div + " [id=" + obj[i].id + "]").datepicker({ format: 'yyyy-mm-dd' }); break;

            case "field_type_ldate_ui":
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm" ><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field"  type="text" id="' + obj[i].id + '" ' + required +'></div></div>');
                $("#" + div + " [id=" + obj[i].id + "]").datepicker({ format: 'yyyy-mm-dd' });
              break;
            case "1e6f860fbcd16cafc124f35e7b86fa88"://图标选择
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field" type="text" id="' + obj[i].id + '"   ' + required + '><i class="am-icon-search" onclick=selectIco("' + obj[i].id + '","' + div + '") ></i></div></div>');

                break;
            /* case "9053dbd845b67d7d15b10c2f482e4723"://文件下载或上传
                $("#" + div + row).append('<td colspan="' + c + '"><input type="text"  id=\"' + obj[i].id + '\" ></td>');
                $("#" + div + " [id=" + obj[i].id + "]").tagbox({
                    label: obj[i].chname,
                    labelAlign: "right",
                    labelPosition: 'before',
                    width: '100%',
                    required: obj[i].lnull == 1 ? false : true,
                    buttonIcon: 'am-icon-upload',
                    iconAlign: 'right',
                    onClickButton: function () {
                        updata_file(1, obj[i].id, obj[i].list, "", "", div, obj[i].Regex);
                    },
                }); break; */
            default:
                $("#" + div + row).append('<div style="margin-top:1px;padding-left: 1px;padding-right: 1px;" class="am-u-sm-' + (12 / c) + '"><div class="am-input-group am-input-group-sm"><span class="am-input-group-label">' + obj[i].chname + '</span><input class="am-form-field" type="text" id="' + obj[i].id + '" ' + required +'></div></div>');

                break;

        }
    });



}
//创建卡片字段
function save(div, opId,obj,id) {
    $("#save" + div).attr('disable', 'disable');
  
    let groupData = {};
    for (let i = 0; i < obj.length; i++) {
        let col = obj[i].field;
        let type = obj[i].type;
        if (type == "group_0") {
            for (let j = 0; j < col.length; j++) {
                let key = col[j].id;
                let t = $("#" + div + " [id=" + col[j].id + "]");
                let type = col[j].fieldui;
                switch (type) {

                    case "bool":
                        if (t.val() == 1)
                            groupData[key] = "1";
                        else
                            groupData[key] = "0";
                        break;
                    case "enum0":
                        groupData[key] = t.val();
                        break;
                    case "refer0":
                        groupData[key] = t.val();
                        break;
                    case "ebe653a2e0281e795959923808216446":
                        groupData[key] = t.val();
                        break;
                    case "refer3":
                        groupData[key] = t.val();
                        break;
                    case "9053dbd845b67d7d15b10c2f482e4723":
                        let v = t.val(), val = "";
                        for (let k = 0; k < v.length; k++) {
                            val += v[k].substring(0, v[k].indexOf("$")) + ";"
                        };
                        groupData[key] = val;
                        break;
                    default:
                        groupData[key] = t.val();
                        break;
                }





            }

        } else if (type == "group_1") {
    
            let rowData = $("#" + div + i).datagrid("getRows");
            groupData[obj[i].idfieldgroup] = rowData;
        }
  

    }
    let postData = {
        action: "save",
        opid: opId,
        data: JSON.stringify(groupData),
        id:id
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
        if (id == "") {
            //$.messager.alert('执行结果', '保存成功', 'info');
            let tab = $("#tab").tabs("getSelected"); //获取当前选中的tab对象
            let index = $("#tab").tabs("getTabIndex", tab);  //获取当前tab的索引
            $("#tab").tabs("close", index);
        }
        else {
            let carryOnDiv = getData(div, "carryOnDiv");
            $("#p" + carryOnDiv).pagination('select');
            $("#" + div).window("close");
        }
       
    })

}
//创建卡片字段
function saveSap(div, opId, obj, listid, carryOnDiv) {
    $("#save" + div).attr('disable', 'disable');

    let groupData = {};
    for (let i = 0; i < obj.length; i++) {
        let col = obj[i].field;
        let type = obj[i].type;
        if (type == "group_0") {
            for (let j = 0; j < col.length; j++) {
                let key = col[j].id;
                let t = $("#" + div + " [id=" + col[j].id + "]");
                let type = col[j].fieldui;
                switch (type) {

                    case "bool":
                        if (t.switchbutton("options").checked == true)
                            groupData[key] = "1";
                        else
                            groupData[key] = "0";
                        break;
                    case "enum0":
                        groupData[key] = t.combobox('getValue');
                        break;
                    case "refer0":
                        groupData[key] = t.textbox('getValue');
                        break;
                    case "ebe653a2e0281e795959923808216446":
                        groupData[key] = t.textbox('getValue');
                        break;
                    case "refer3":
                        groupData[key] = t.textbox('getValue');
                        break;
                    case "9053dbd845b67d7d15b10c2f482e4723":
                        let v = t.tagbox("getValues"), val = "";
                        for (let k = 0; k < v.length; k++) {
                            val += v[k].substring(0, v[k].indexOf("$")) + ";"
                        };
                        groupData[key] = val;
                        break;
                    default:
                        groupData[key] = t.textbox('getText');
                        break;
                }





            }

        } else if (type == "group_1") {

            let rowData = $("#" + div + i).datagrid("getRows");
            groupData[obj[i].idfieldgroup] = rowData;
        }


    }
    let postData = {
        action: "sapinput",
        opid: opId,
        data: JSON.stringify(groupData).replace('%0D%0A', '\\r\\n')
     }
    toAjaxCRUDCallBack(service, postData, function (result) {

          if(listid!="")
            $('#c' + carryOnDiv).datagrid({
                data: result.data,
            });
        $("#" + div).window("close");

           
    

    })

}
function getOneData(opId, id, div,carryOnDiv) {
    let postData = {
        action: "getOneData",
        opid: opId,
        id: id,
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
        let op = result.operation;
        let group = getData(div, "operConfig").group;
        let opRemove = result.removeoper;
        let data = result.data;
        setData(div, "oneData", result);
        setData(div, "obId", id);
        setData(div, "carryOnDiv", carryOnDiv);
        op.sort(function (a, b) { return a.lpos - b.lpos });
        for(let i = 0; i < op.length; i++) {
            if (op[i].batch != 1 && op[i].id != opId && op[i].hide != 1 && opRemove.indexOf(op[i].id) == -1 && op[i].operatetype != "oper_type_open" && op[i].operatetype != "oper_type_ui_9" ) {
                btn = {
                    dataid:id,
                    id: op[i].id,
                    ico: op[i].ico,
                    text: op[i].chname
                }
                createBtn("f" + div, btn);
                if (op[i].operatetype == "oper_type_del" || op[i].operatetype == "031d3d8ffd0d8e1636e43002ce109172" || op[i].operatetype == "089a0f17d9db45771f114cd372083efc" || op[i].operatetype == "77b0b9dbdf07f223da65b8031f5fa772")
                     $("#f" + div + " [id='"+op[i].id+"']").bind('click', function () {
                         runOper(op[i].id, id, div, op[i].uitype , op[i].operatetype,"card");
                });
                 else
                     $("#f" + div + " [id='" + op[i].id + "']").bind('click', function () {
                         getOperConfig(this.id, $(this).attr('dataid'), div)
                     });
            }

        }
        for (let j = 0; j < group.length; j++) {
            if (group[j].type == "group_0") {
                let fieldData = group[j].field
                $.each(fieldData, function (i, da) {
                    let key = fieldData[i].id;
                    setvalue(fieldData[i].fieldui, key, data, div);
                })
            }

        }



    })
}
function getOneDataForEdit(opId, id, div, carryOnDiv) {
    let postData = {
        action: "getOneData",
        opid: opId,
        id: id,
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
        let op = result.operation;
        let group = getData(div, "operConfig").group;
        let opRemove = result.removeoper;
        let data = result.data;
        setData(div, "oneData", result);
        setData(div, "obId", id);
        setData(div, "carryOnDiv", carryOnDiv);
        
        for (let j = 0; j < group.length; j++) {
            let fieldData = group[j].field
            $.each(fieldData, function (i, da) {
                let key = fieldData[i].id;
                let type = fieldData[i].fieldui;
                 let t = $("#" + div + " [id='" + key + "']");
                let tshow = "";
                switch (type) {

                    case "enum0":
                        t.val(data[key]);
                        t.selected({ btnWidth: '100%' });
                       // t.selected('disable');
                        break;
                    case "refer0":
                        tshow = data[key + "_show"];
                        t.val(data[key]);
                        $("#" + div + " [id='" + key + "_show']").val(tshow);
                        break;
                    case "ebe653a2e0281e795959923808216446":
                        tshow = data[key + "_show"];
                        t.val(data[key]);
                        $("#" + div + " [id='" + key + "_show']").val(tshow);
                        break;
                    case "refer3":
                        tshow = data[key + "_show"];
                        t.val(data[key]);
                        $("#" + div + " [id='" + key + "_show']").val(tshow);
                        break
                    case "bool":
                        t.val(data[key] == "" ? 0 : data[key]);
                        t.selected({ btnWidth: '100%' })
                        break;
                    case "1e6f860fbcd16cafc124f35e7b86fa88":
                        t.val(data[key]);
                        break
                   /* case "9053dbd845b67d7d15b10c2f482e4723"://文件类型
                        tshow = data[key + "_show"];
                        let arrShow = tshow.split(";");
                        let pathLoad = arrShow[arrShow.length - 1];
                        arrShow.pop();
                        t.tagbox({
                            value: arrShow,
                            pathLoad: pathLoad,
                            tagFormatter: function (value, row) {
                                let fileName = value.substring(value.indexOf("$") + 1, value.length);
                                let urlFile = value.substring(0, value.indexOf("$")) + fileName.substring(fileName.indexOf("."), fileName.length);
                                return fileName + "<i class='am-icon-download' onclick=\"downfile('" + pathLoad.substring(0, pathLoad.length - 1) + "','" + urlFile + "')\"></i>"
                            }
                        });
                        break*/
                    default:
                        t.val(data[key]);

                        break;
                }
            })
        }
        let saveBtn = {
            id: "save" + div,
            ico: "save",
            ui: "Save",
            text: "保存"
        }
        let cancelBtn = {
            id: "cancel" + div,
            ico: "close",
            ui: "danger",
            text: "取消"
        }
      //  $("#" + div).append('<div  id = "saveTool' + div + '"  class="am-btn-toolbar" style = "width:100%;height:auto;display:none;margin-bottom: 5px;" > </div >').createBtn("saveTool" + div, saveBtn).createBtn("saveTool" + div, cancelBtn);

        createBtn("p"+div, saveBtn);
        createBtn("p"+div, cancelBtn);
        $('#save' + div).bind('click', function () {
            if (validate(div, group, result.verify))
                save(div, opId, group, id);
        });
        $('#cancel' + div).bind('click', function () {
            layer.close($("#" + div).attr("index"));
        });


    })
}

function deleteOneData(opId, id, div, type) {
    let postData = {
        action: "delete",
        opid: opId,
        id: id,
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
        

        $.messager.alert('执行结果', "删除成功", 'info')
        if (type == "card") {
            $('#' + div).tabs("close");
        }
        else
            $('#p' + div).pagination('select');
           
    })
}
function setvalue(type, key,data,div) {
    let t = $("#" + div + " [id='" + key + "']");
    let tshow = "";
    switch (type) {
       
        case "enum0":
            t.val(data[key]);
            t.selected('disable');

            break;
        case "refer0":
            tshow = data[key + "_show"];
            t.val(data[key]);
            $("#" + div + " [id='" + key + "_show']").val(tshow);
            $("#" + div + " [id='" + key + "_show']").attr('readonly', true);
            break; 
        case "ebe653a2e0281e795959923808216446":
            tshow = data[key + "_show"];
            t.val(data[key]);
            $("#" + div + " [id='" + key + "_show']").val(tshow);
            $("#" + div + " [id='" + key + "_show']").attr('readonly', true);
            break; 
        case "refer3":
            tshow = data[key + "_show"];
            t.val(data[key]);
            $("#" + div + " [id='" + key + "_show']").val(tshow);
            $("#" + div + " [id='" + key + "_show']").attr('readonly', true);
            break;
        case "bool":
            t.val(data[key] == "" ? 0 : data[key]);
            t.selected({ btnWidth: '100%' })
            t.selected('disable');
            break;
        case "1e6f860fbcd16cafc124f35e7b86fa88":
            t.val(data[key]);
            t.attr('readonly', true);
            break;
      /*  case "9053dbd845b67d7d15b10c2f482e4723"://文件类型

            break */
        default:
            t.val( data[key]);
            t.attr('readonly',true);
            break;
    }
}
function getLpos(opId, id, newId, result) {

        $("#" + newId).remove();
        let h = ""; let aaa = result;
        aaa.sort(function (a, b) { return a.lpos - b.lpos });
        $.each(aaa, function (i, d) { h += "  <option value=" + aaa[i].id + " title='" + aaa[i].chname + "'>" + aaa[i].chname + "</option>" })
    let html = "<div id='" + newId + "' style='margin: 13px;' ><table><tr><td><select id='select_lops" + newId + "' multiple='multiple'   style='width:200px;' size='10' name='select_lops'>" + h + "</select></td><td><div> <input  type='image' onclick=goto_td('t','select_lops" + newId + "',0) src=\"images/top2.png\"></div><div> <input  type='image' onclick=goto_td('t','select_lops" + newId + "',1) src=\"images/top.png\"></div><div> <input  type='image' onclick=goto_td('d','select_lops" + newId + "',1) src=\"images/down.png\"></div><div> <input  type='image' onclick=goto_td('d','select_lops" + newId + "',0) src=\"images/down2.png\"></div></td></tr><tr><td><button id=\"save" + newId + "\" class=\"am-btn am-btn-success  am-btn-xs am-btn-default\" onclick=\"saveLpos('" + newId + "','" + id + "','" + opId + "')\"><i class='am-icon-save'></i>保存</button> <button id='close" + newId + "' class=\"am-btn am-btn-danger   am-btn-xs am-btn-default\"  ><i class='am-icon-close'></i>取消</button></td></tr></table></div>";
        $("#master").append(html);
    setDivCenter(newId, "排序", 260, 300);
   
    $("#close" + newId).click(function () { layer.close($("#" + newId).attr("index")); });
  
}
function goto_lr(lr, div, n) {
    if (n == 0) {
        if (lr == "l") {
            $("#" + div + "l").find("option:selected").appendTo("#" + div + "r")
        } else if (lr == "r") { $("#" + div + "r").find("option:selected").appendTo("#" + div + "l") }
    }
    else if (n == 1) {
        if (lr == "l") {
            $("#" + div + "l").find("option").appendTo("#" + div + "r")
        } else if (lr == "r") { $("#" + div + "r").find("option").appendTo("#" + div + "l") }
    }
}
function goto_td(td, div, n) {
    if (n == 0) {
        if (td == "t") {
            //$("#" + div).find("option:selected").appendTo("#" + div)
            //  alert($("#" + div + " option:selected"))
            // let a = $("#" + div + " option:selected");
            $("#" + div).prepend($("#" + div + " option:selected"));
        } else if (td == "d") { $("#" + div + " option:selected").appendTo($("#" + div)); }
    }
    else if (n == 1) {
        if (td == "t") {
            $("#" + div + " option:selected").insertBefore($("#" + div + " option:selected").first().prev());
        } else if (td == "d") { $("#" + div + " option:selected").insertAfter($("#" + div + " option:selected").last().next()); }
    }
}
function saveLpos(div,id, opId) {
    $("#save" + div).attr('disable','disable');
    let data = '';
    $("#select_lops"+div).find('option').each(function () { data += $(this).val() + ';'; });
    data = data.substring(0, data.length - 1);
    let postData = {
        action: "saveLpos",
        opid: opId,
        data: JSON.stringify(data),
        id: id
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
        $("#close" + div).click();
    })

}

function openCardFromCard(div, obId) {
    let id = $("#" + div + " [id='" + obId + "']").val();
    if (id == "") return false;
    let opChname = $("#" + div + " [id='" + obId + "_show']").val();
    let postData = {
        action: "getOneDataFromCard",
        opid: obId,
        id: id
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
        let operation = result.operation;
        let newId = addTab(opChname, "path_type_2", "search");
        createCard(result, newId, id, operation.id, div, function (data) {
           // $.parser.parse($("#" + newId));
        });
    })
}
function openCardFromList( obId,id,opChname) {
    if (id == "") return false;
    let postData = {
        action: "getOneDataFromCard",
        opid: obId,
        id: id
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
        let operation = result.operation;
        let newId = addTab(opChname, "path_type_2", "search");
        createCard(result, newId, id, operation.id, "", function (data) {
           /// $.parser.parse($("#" + newId));
        });
    })
}
function select_ico() {

    $.get("amazeui/Scripts/ico.js", function (r) {
        let objdata = JSON.parse(r);
        let html = "";
        for (let i = 0; i < objdata.length; i++) {
            html += "<option value='" + objdata[i].id + "'><a><i class='am-icon-" + objdata[i].id + "'></i></a>" + objdata[i].id+"</option>  "; 
        }
        return html;

    })

}//选择图标

function insertList(opId, id, carrOnDiv, resultAll,row) {
    setData(carrOnDiv, "operConfig", resultAll);
    let da = [];
    $.each(resultAll.data, function (i, d) {
        da[i] = d;
    });
    let div = carrOnDiv + row;
    let result = resultAll.group[0];

    let columns = [[]];
    let colCount = result.col.length;
    let firstCol = {
        field: "id",
        width: 40,
        align: 'center',
        checkbox: true
    }

    let nullRow = {};
    columns[0].push(firstCol);
    $.each(result.col, function (i, field) {
        let editor = {};
        let Default = "";
        $.each(result.field, function (j, fd) {
            let uiType = "";
  
                if (fd.id == result.col[i].idfield) {
                    if (fd.Default1.indexOf("sys_") != -1) { Default = sys_f_analyse(div, fd.Default1); } else { Default = fd.Default1; }
                    uiType = fd.fieldui;
                    switch (uiType) {
                        case "bool":
                            editor = {
                                type: 'checkbox', //复选框类型
                                options: {
                                    on: '1', //选中时所代表的值
                                    off: '0',//未选中时所代表的值
                                }
                            }
                            break;
                        case "refer0":
                            editor = {
                                type: 'refer0', //扩展类型
                                options: {
                                    buttonIcon: 'am-icon-search',
                                    iconAlign: 'right',
                                    width: '100%',
                                    required: fd.lnull == 1 ? false : true,
                                    onClickButton: function () {
                                        var index = getRowIndex(this);
                                        $('#' + div).datagrid("selectRow", index);
                                        openListForInsertList(carrOnDiv, fd.id);
                                    }
                                }
                            }
                            break;
                        case "enum0":
                            let enumData = fd.field_enum.sort(function (a, b) { return a.lpos - b.lpos });
                            if (fd.lnull == 1) enumData.unshift({ id: "", chname: "选择" + fd.chname });
                            editor = {
                                type: 'combobox', //扩展类型
                                options: {
                                    valueField: 'chname',
                                    textField: 'chname',
                                    panelHeight: fd.field_enum.length > 10 ? "250" : "auto",
                                    data: enumData,
                                    width: '100%',
                                    editable: false,
                                    required: fd.lnull == 1 ? false : true,
                                    onSelect: function (r) {
                                        var index = getRowIndex(this);
                                        $('#' + div).datagrid("selectRow", index);
                                        let selectrow = $('#' + div).datagrid("getSelected");
                                        selectrow[fd.id] = r.id;
                                        selectrow[fd.id + "_show"] = r.chname;
                                        $('#' + div).datagrid("updateRow", { index: index, selectrow});
                                    }
                                }
                            }
                            break;

                        default: editor = {
                            type: 'text', //复选框类型
                        }

                            break;

                    }
                    if (fd.fieldtype == "field_type_refer" || fd.fieldtype == "field_type_enum") {
                        let obj2 = {
                            field: result.col[i].idfield,
                            title: result.col[i].chname,
                            width: 200,
                            align: 'center',
                            // editor: editor,
                            hidden: true
                        }
                        columns[0].push(obj2);
                        nullRow[result.col[i].idfield] = "";
                        let obj = {
                            field: result.col[i].idfield + "_show",
                            title: result.col[i].chname,
                            width: 200,
                            align: 'center',
                            editor: editor,


                        }
                        columns[0].push(obj);
                        nullRow[result.col[i].idfield + "_show"] = "";
                    } else {
                        let obj = {
                            field: result.col[i].idfield,
                            title: result.col[i].chname,
                            width: 200,
                            align: 'center',
                            editor: editor,

                        }
                        columns[0].push(obj);
                        nullRow[result.col[i].idfield] = Default;
                    }




                }
            

        })

    })

    let operation = resultAll.operation.operations
    let toolbar = [];
    for (let i = 0; i < operation.length; i++) {
        let oper = operation[i];
        if (oper.hide != 1 && oper.operatetype == "oper_type_del") {
            toolbar.push({
                text: oper.chname,
                iconCls: 'am-icon-' + oper.ico,
                style: ' background: "green"; color: "white"',

                handler: function () {
                    let selectrow = $('#' + div).datagrid('getChecked')[0];

                    if (!selectrow) {
                        $.messager.alert('提示', '请选中一行', 'warning');
                    } else {
                        let t = false;
                        $.each(da, function (i, row) {
                           
                            if (row.id == selectrow.id) {
                                t = true;
                                runOper(oper.id, row.id, div, oper.uitype, oper.operatetype, "insertList");
                            }
                            if (i == da.length-1 && !t) {
                                let selectrow = $('#' + div).datagrid('getChecked')[0];
                                let index = $('#' + div).datagrid('getRowIndex', selectrow);
                                $('#' + div).datagrid('deleteRow', index);
                                endIndex = undefined;
                            }
                        })


                    }
                }
            })
        }
    }
    //定义工具栏
    let toolbar2 = [{
        text: "添加",
        iconCls: 'am-icon-plus',
        style: ' background: "green"; color: "white"',

        handler: function () {
            let newNullRow = {};
            for (let k in nullRow) {
                newNullRow[k] = "";
            }
            let id = guid();

            newNullRow["id"] = id;
            $('#' + div).datagrid('appendRow', newNullRow);

            let index = $('#' + div).datagrid('getRows').length - 1;

            $('#' + div).datagrid('selectRow', index);
        }
    }, {
            text: "取消修改",
            iconCls: 'am-icon-minus',
            style: ' background: "green"; color: "white"',

            handler: function () {
                let selectrow = $('#' + div).datagrid('getChecked')[0];
                if (!selectrow) {
                    $.messager.alert('提示', '请选中一行', 'warning');
                } else {
                    let index = $('#' + div).datagrid('getRowIndex', selectrow);
                    $('#' + div).datagrid('cancelEdit', index);
                }
            }
        },

    ];
    let endIndex;
    $('#' + div).datagrid({
        toolbar: toolbar2.concat(toolbar),
        columns: columns,
        rownumbers: true,
        singleSelect: true,
        selectOnCheck: true,
        checkOnSelect: true,
        fitColumns: colCount > 4 ? true : false,
        data: resultAll.data,
        height: 500,
        onSelect: function (index, field, value) {
            if (index != endIndex && endIndex != undefined) {
                if ($('#' + div).datagrid('validateRow', endIndex)) {
                    
                    let saveRow = resultAll.data[endIndex];


                        $('#' + div).datagrid('endEdit', endIndex);
                    let t = false;
                    if (da.length > 0) {
                        $.each(da, function (i, row) {
                            if (row.id == saveRow.id) {
                                t = true;
                            }
                            if (i == da.length - 1) {
                                let rowforsave = {}
                                $.each(result.field, function (j, fd) {
                                    rowforsave[fd.id] = saveRow[fd.id];
                                })
                                rowforsave["id"] = saveRow["id"];
                                rowforsave["object_Id"] = id;
                                let postData = {
                                    action: "saveForInsertList",
                                    opid: opId,
                                    data: JSON.stringify(rowforsave),
                                    id: t ? row.id : ""
                                }
                                $.ajax({
                                    cache: true,
                                    type: "POST",
                                    url: service,
                                    data: postData,
                                    async: true,
                                    success: function (result) {
                                        if (dataAfter(result)) {
                                            endIndex = index;
                                            $('#' + div).datagrid('beginEdit', index);

                                        } else {
                                            $('#' + div).datagrid('selectRow', endIndex);
                                        }
                                    }
                                });
                            }
                        })
                    }
                    else {
                        let rowforsave = {}
                        $.each(result.field, function (j, fd) {
                            rowforsave[fd.id] = saveRow[fd.id];
                        })
                        rowforsave["id"] = saveRow["id"];
                        rowforsave["object_Id"] = id;
                        let postData = {
                            action: "saveForInsertList",
                            opid: opId,
                            data: JSON.stringify(rowforsave),
                            id:  ""
                        }
                        $.ajax({
                            cache: true,
                            type: "POST",
                            url: service,
                            data: postData,
                            async: true,
                            success: function (result) {
                                if (dataAfter(result)) {
                                    endIndex = index;
                                    $('#' + div).datagrid('beginEdit', index);

                                } else {
                                    $('#' + div).datagrid('selectRow', endIndex);
                                }
                            }
                        });
                    }
                      


                     
                } else {
                    $('#' + div).datagrid('selectRow', endIndex);
                }
            } else {
                $('#' + div).datagrid('beginEdit', index);
                endIndex = index;
            }

        }
    })


}

function openListForInsertList(carrOnDiv, obId) {
    let div = carrOnDiv + 0;
    let group = getData(carrOnDiv, "operConfig").group;
    let opId;
    $.each(group[0].field, function (i, d) {
        if (d.id == obId) opId = d.list;
    })
    let valueText = "", where = "";
    let newWindow = guid();
    let selectrow = $("#" + div).datagrid("getSelections");//点击的行
        if (selectrow == null) return false;

        let index = $('#' + div).datagrid('getRowIndex', selectrow);
        $('#' + div).datagrid('endEdit', index);
        $('#' + div).datagrid('beginEdit', index);
        selectrow = $("#" + div).datagrid("getSelected");//点击的行
        newWindow = selectrow["id"];
        $("#" + div).append('<div id="' + newWindow + '"><div id="f' + newWindow + '"></div><div id="c' + newWindow + '"></div><div id="p' + newWindow + '"></div></div>');

        valueText = selectrow[obId + "_show"] == undefined ? selectrow[obId] : selectrow[obId + "_show"];
  
    if (valueText != "") {
        let refer = "chname"; //外键关联显示的字段,默认chname
        for (let i = 0; i < group.length; i++) {
            if (group[i].type == "group_0") {
                let feildData = group[i].field;
                for (let j = 0; j < feildData.length; j++) {
                    if (feildData[j].id == obId) {
                        refer = feildData[j].refer;
                        break;
                    }

                }
            }
        }
        where = "v." + refer + " like '%" + valueText + "%'";
    }

    /*约束实现开始*/
    let hold_where = "";
    let sys_hold = getData(carrOnDiv, "operConfig").sys_hold_sub;
    if (sys_hold.length > 0) {
        for (let i = 0; i < sys_hold.length; i++) {
            let holdfrom = sys_hold[i].holdfrom;
            let holdto = sys_hold[i].holdto;
            let holdeq = sys_hold[i].holdeq;
            let idfield = sys_hold[i].idfield;
            if (holdto == obId) {
                let holdfromvalue = selectrow[holdfrom];//约束值
                if (holdfromvalue != "")
                    hold_where += sys_eq(holdeq, " v." + idfield, holdfromvalue);
            }


        }
    }
    if (hold_where != "" || where != "") {
        where = where == "" ? hold_where + " 1=1 " : where + " and " + hold_where + " 1=1 ";
        setData(newWindow, "hold_where", where);
    }


    /*约束实现结束*/
        createSelectList(opId, newWindow, obId, carrOnDiv, where,0);
        setDivCenter(newWindow, "查找", 800);


}
