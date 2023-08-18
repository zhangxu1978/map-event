var  listIdnew = "";

// 每行的回调 生成自定义td
function fnRowCallback(nRow, aData, iDisplayIndex) {
    return nRow;
}


function getBtnFromList(obj,id,div) {
    var content = "";
    obj.sort(function (a, b) {
        return a.lpos - b.lpos;
    });
        if (obj.length > 3) {
        content = '<div class="am-dropdown" data-am-dropdown><button onclick="amdropdowntoggle($(this))"  class="am-btn am-btn-default am-btn-xs am-dropdown-toggle" butid=\'' + id + '\' data-am-dropdown-toggle><span class="am-icon-cog"></span><span class="am-icon-caret-down"></span></button>';
        content += '<ul class="am-dropdown-content" isShow="false" ulSet="ulSet" ulShow=\'ulShow_' + id + '\' ulid=\'' + id + '\'>';
            for (a in obj) {
                if (obj[a].hide == 1 || obj[a].batch == 1 || obj[a].operatetype == "oper_type_open" || obj[a].operatetype == "5c0808d1f0df488daa96243fe89b2645") { }
                else {
                    let uitype = obj[a].uitype;
                    if (uitype == "oper_type_ui_0" || uitype == "oper_type_ui_8" || uitype == "2dac247cfc425a6549305783293afc9b" || uitype == "oper_type_ui_4") {
                        content += '<li><a href="javascript:void(0);" onclick="runOper(\'' + obj[a].id + '\', \'' + id + '\', \'' + div + '\',\'' + uitype + '\',\'' + obj[a].operatetype + '\', \'list\')"><i class=\'am-icon-' + obj[a].ico + '\' ></i> ' + obj[a].chname + '</a></li>';

                    }
                    else {
                        content += '<li><a href="javascript:void(0);" onclick="getOperConfig(\'' + obj[a].id + '\', \'' + id + '\', \'' + div + '\')"><i class=\'am-icon-' + obj[a].ico + '\' ></i> ' + obj[a].chname + '</a></li>';
                    }
                }

         
        }
        content += '</ul></div>';
    }
    else {
            content = '<div class="am-btn-toolbar"><div class="am-btn-group am-btn-group-xs">';
           
           
           // if (obj[a].type == "tool") classbtn += " am-btn-xs am-btn-default";
            for (a in obj) {
                let classbtn = " am-btn am-btn-default";
                if (obj[a].uitype == "oper_type_ui_8" || obj[a].chname.indexOf("删除") > -1) classbtn += " am-text-danger ";
                else classbtn += " am-text-primary ";
                if (obj[a].hide == 1 || obj[a].batch == 1 || obj[a].operatetype == "oper_type_open" || obj[a].operatetype == "5c0808d1f0df488daa96243fe89b2645") { }
                else {
                    let uitype = obj[a].uitype;

                    if (uitype == "oper_type_ui_0" || uitype == "oper_type_ui_8" || uitype == "2dac247cfc425a6549305783293afc9b" || uitype == "oper_type_ui_4") {
                        content += '<button class="' + classbtn+' "  title="' + obj[a].chname + '"   onclick="runOper(\'' + obj[a].id + '\', \'' + id + '\', \'' + div + '\',\'' + uitype + '\',\'' + obj[a].operatetype + '\', \'list\')"> <i class=\'am-icon-' + obj[a].ico + '\' ></i>' + obj[a].chname.substring(0, 2) + '</button>';

                    }
                    else {
                        content += '<button class="' + classbtn +' " title="' + obj[a].chname + '" onclick="getOperConfig(\'' + obj[a].id + '\', \'' + id + '\', \'' + div + '\')"> <i class=\'am-icon-' + obj[a].ico + '\' ></i> ' + obj[a].chname.substring(0, 2)  + '</button>';
                    }
                }
        }
        content += '</div></div>';
    }
   

    return content;
}
function createList(listId, div, where) {

    let postdata = {
        action: "getListConfig",
        opid: listId
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {

        //批量操作
        var obj = result.operation;
        for (a in obj) {
            if (obj[a].hide != 1 && obj[a].batch == 1)
            {
                let toolBtn = {
                    id: obj[a].id,
                    ico: obj[a].ico,
                    color: "#f3f3f3",//"#1E9FFF",
                    text: obj[a].chname,
                    type: "tool",
                    ui: obj[a].uitype
                }
                createBtn("t" + div, toolBtn);
                let uitype = obj[a].uitype;
                let opid = obj[a].id;
                let operatetype=obj[a].operatetype;
                if (uitype == "oper_type_ui_0" || uitype == "oper_type_ui_8" || uitype == "2dac247cfc425a6549305783293afc9b" || uitype == "oper_type_ui_4") {
                    $("#t" + div + " [id='" + obj[a].id + "']").bind("click", function () {
                        runOper(opid, "", div, uitype, operatetype, "list");
                    })

                } else {
                    $("#t" + div + " [id='" + obj[a].id + "']").bind("click", function () {
                        getOperConfig(opid, "", div);
                    })
                }

    }
        }
       
        //定义列头
        let columns = [];

        result.col.sort(function (a, b) {
            return a.lpos - b.lpos;
        });
        setData(div, "listConfig", result);
     /*   let firstCol = {
            "sClass": "table-check",
            "sTitle": "<input type=\"checkbox\" class=\"checkAll\"/>",
            "mDataProp": "id",
            "render": function (oObj, sVal) {
                return '<input type="checkbox" id="' + oObj + '"  />';
            },
            "sDefaultContent": "",
            "bSortable": false,
            "sWidth": "1%"
        }

        columns.push(firstCol); */
        $.each(result.col, function (i, field) {
            let f = result.col[i].fieldtype == "field_type_refer" ? result.col[i].idfield + "_show" : result.col[i].idfield;
            let idfield = result.col[i].idfield;
          //  let id = result.col[i].id;
            let obj = {
                mDataProp: f,
                sTitle: result.col[i].chname,
                bSortable: false,
                sWidth: 100,
                render: function (value, cellmeta, row, index) {
                    let typeField = result.col[i].fieldtype;
                    if (value != "") {
                        switch (typeField) {
                            case "field_type_bool":
                                return value == "1" ? "是" : "否";
                            case "field_type_refer":
                                return value + '<a  class="am-icon-search" onclick =\'openCardFromList("' + idfield + '","' + row[idfield] + '","' + value + '")\'> </a>';
                            case "field_type_doc":
                                let updataFile = getData(div, "updataFile");
                                let arryValue = value.split(";");
                                let vv = "";
                                $.each(updataFile, function (n, ud) {
                                    if (ud[idfield]) {
                                        let pathLoad = ud["mulu" + idfield];
                                        let a = ud[idfield];

                                        $.each(arryValue, function (j, d) {
                                            $.each(a, function (j, ddd) {
                                                if (d == ddd.id) {
                                                    let fileName = ddd.chname;
                                                    let urlFile = d + fileName.substring(fileName.indexOf("."), fileName.length);
                                                    vv += fileName + "<i class='am-icon-download' onclick=\"downfile('" + pathLoad.substring(0, pathLoad.length) + "','" + urlFile + "')\"></i><br>"
                                                }
                                            })
                                        })

                                    }
                                })
                                return vv;
                            default:
                                return value;
                        }
                    }
                    else return value;
                }
            }
            columns.push(obj);
        });
        let lastCol = {
            "mDataProp": "id",
            "sTitle": "操作",
            "sDefaultContent": "",// 此列默认值为""，以防报错
            "bSortable": false,
            "render": function (oObj, sVal, aData) {
                var c= getBtnFromList(result.operation, oObj, div);
          
                return c;
             
            },
            "sWidth": 150
        }
        columns.push(lastCol);


        //添加数据
        // let data = []
        //创建list

        if (where == "" || where == undefined) createSearch(result.seachData, div);
        initializeTable("table" + div, columns, fnRowCallback, "Controler.ashx", div,listId);
        $("#" + div + " .am-dropdown-toggle").bind("click", function () {

            var ulid = $(this).attr("butid");
            $("[ulSet='ulSet']").each(function () {
                var ulId = $(this).attr("ulid");
                if (ulId == ulid) {
                    if ($(this).attr("isShow") == "true") {
                        $(this).hide();
                        $(this).attr("isShow", "false");
                    } else {
                        $(this).show();
                        $(this).attr("isShow", "true");
                    }
                } else {
                    $(this).hide();
                    $(this).attr("isShow", "false");
                }
            });
        })
    })


}
function createListForCard(listId,  div,where) {
    let postdata = {
        action: "getListConfig",
        opid: listId
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {
        //定义列头
        let columns = [];
        let ltree = result.listconf.ltree == "1" ? true : false;
        result.col.sort(function (a, b) {
            return a.lpos - b.lpos;
        });
        setData(div, "listConfig", result);
        let firstCol = {
            field: "operation",
            title: "操作",
            width: 40,
            align: 'center',
            formatter: function (value, row, index) {
                return '<a  class=" am-icon-cog fa-fw " onclick=\'operlist( window.event.pageX,window.event.pageY,"' +row["id"] + '","' + div + '")\'> <i class="am-icon-caret-down"></i></a>'
            }
        }
        columns.push(firstCol); 
        $.each(result.col, function (i, field) {
            let f = result.col[i].fieldtype == "field_type_refer" ? result.col[i].idfield + "_show" : result.col[i].idfield;
            let idfield = result.col[i].idfield;
           let obj = {
               field: f,
               title: result.col[i].chname,
               sortable:true,
               width: 100,
               align: ltree ? 'left' : 'center',
               formatter: function (value, row, index) {
                   let typeField = result.col[i].fieldtype;
                   if (value != "") {
                       switch (typeField) {
                           case "field_type_bool":
                               return value == "1" ? "是" : "否";
                           case "field_type_refer":
                               return value + ' <a  class=" am-icon-search" onclick =\'openCardFromList("' + idfield + '","' + row[idfield] + '","' + value + '")\'> </a>';
                           case "field_type_doc":
                               let updataFile = getData(div, "updataFile");
                               let arryValue = value.split(";");
                               let vv = "";
                               $.each(updataFile, function (n, ud) {
                                   if (ud[idfield]) {
                                       let pathLoad = ud["mulu" + idfield];
                                       let a = ud[idfield];
                                     
                                       $.each(arryValue, function (j, d) {
                                           $.each(a, function (j, ddd) {
                                               if (d == ddd.id) {
                                                   let fileName = ddd.chname;
                                                   let urlFile = d + fileName.substring(fileName.indexOf("."), fileName.length);
                                                   vv += fileName + "<i class='am-icon-download' onclick=\"downfile('" + pathLoad.substring(0, pathLoad.length) + "','" + urlFile + "')\"></i><br>"
                                               }
                                           })
                                       })
                                 
                                   }
                               })
                               return vv;
                           default:
                               return value;
                       }
                   }
                   else return value;
            }
           }
           columns.push(obj); 
       })
        //定义工具栏
        let toolbar = [];
        result.operation.sort(function (a, b) {
            return a.lpos - b.lpos;
        });
        $.each(result.operation, function (i, field) {
            if (result.operation[i].batch == 1 && result.operation[i].operatetype != "oper_type_ui_9") {

                let obj = {
                    text: result.operation[i].chname,
                    iconCls: 'am-icon-' + result.operation[i].ico,
                    style:' background: "green"; color: "white"',
                   
                    handler: function () {
                        if (field.operatetype == "5c0808d1f0df488daa96243fe89b2645") {
                                  let oldDiv = $("#" + div).attr("carryOnDiv");
                                    if (oldDiv) { 
                                    $("#" + oldDiv).attr("addOpId", field.id);
                                        openListForDetail(oldDiv, field.idfield, div.replace(oldDiv, ""), 2);
                                }
                                
                    

                        }
                           
                        else
                             getOperConfig(result.operation[i].id, "", div)
                    }
                }

            
                    toolbar.push(obj);
                    toolbar.push('-');
                
  
            }
            if (result.operation[i].operatetype == "oper_type_open" && !ltree) {
                $('#c' + div).datagrid({
                    view: detailview,
                    rownumbers: false,
                    detailFormatter: function (index, row) {
                        return "<div id='" + div + index + "'  ><div id='f" + div + index + "'  ></div></div ></div > <div id='c" + div + index + "'></div><div id='p" + div + index + "'></div></div>";
                    },
                    onExpandRow: function (index, row) {
                        let idfeild = "";
                        $.each(result.idfield, function (k, field) {
                            if (field.id == result.operation[i].idfield) {
                                idfeild = field.fieldname;
                                let openWhere = "v." + idfeild + "='" + row.id + "'";
                                createListForOpen(result.operation[i].listid, div, openWhere,index);
                                //a.datagrid('fixDetailRowHeight', index);
                          
                            }
                        })

                    }
                })
            }
   
        })

        //添加数据
       // let data = []
        //创建list

        if (where == "" || where == undefined) createSearch(result.seachData, div);
        getListData(listId, 1, 10, div, "", where);
        if (!ltree) {
            $('#c' + div).datagrid({
                toolbar: toolbar,
                columns: columns,
                rownumbers: false,
                singleSelect: true,
                sortable: true,
                fitColumns: true,
                onSortColumn: function (sort, order) {
                    $.each(result.idfield, function (i, field) {
                        if (result.idfield[i].id == sort) {
                            let orderstr = "v." + result.idfield[i].fieldname + " " + order + ",";
                            setData("c" + div, "order", orderstr);
                            $("#p" + div).pagination('select');
                        }
                    })

                }
            })
        }
        else {
            $('#c' + div).treegrid({
                idField: 'id',
                treeField: result.col[0].idfield,
                toolbar: toolbar,
                columns: columns,
                //rownumbers: true,
                singleSelect: true,

                //fitColumns: true,

            })
        }
    })
       
       
}
function createListForEdit(oldDiv, row) {
    let div = oldDiv + row;
    let r = getData(oldDiv, "operConfig").group
    let result = r[row];
    let object_field = result.object_field;
    let columns = [[]];
    let colCount = result.col.length;
    let firstCol = {
        field: "id",
        title: "选择",
        width: 40,
        align: 'center',
        checkbox: true
    }
    
    let nullRow = {  };
    columns[0].push(firstCol);
    $.each(result.col, function (i, field) {
        let editor = {};
        let Default = "";
        $.each(result.field, function (j, fd) {
            let uiType = "";
            if (fd.fieldname != object_field) {
                if (fd.id == result.col[i].idfield) {
                    if (fd.Default1.indexOf("sys_") != -1) { Default = sys_f_analyse(div, fd.Default1); } else { Default = fd.Default1; }
                    uiType = fd.fieldui;
                    switch (uiType) {
                        case "bool":
                            editor = {
                                type: 'checkbox', //复选框类型
                                options: {
                                    on: '1', //选中时所代表的值
                                    off: '0', //未选中时所代表的值
                                    onCheck: function (index,a) {
                                        //var index = getRowIndex(this);
                                        $('#' + div).datagrid("selectRow", index);
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
                                    valueField: 'id',
                                    textField: 'chname',
                                    panelHeight: fd.field_enum.length > 10 ? "250" : "auto",
                                    data: enumData,
                                    width: '100%',
                                    editable: false,
                                    required: fd.lnull == 1 ? false : true,
                                    onSelect: function () {
                                        var index = getRowIndex(this);
                                        $('#' + div).datagrid("selectRow", index);
                                    }
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
                                        openListForDetail(oldDiv, fd.id, row,0);
                                    }
                                }
                            }
                            break;

                        default: editor = {
                            type: 'text', //复选框类型
                        }

                            break;

                    }
                    if (fd.fieldtype == "field_type_refer") {
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
                        nullRow[result.col[i].idfield +"_show"] ="";
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
            }

        })
     
    })

    let operation = result.operation
    let toolbar = [];
    for (let i = 0; i < operation.length; i++) {
        let oper = operation[i];
        if (oper.hide != 1 && oper.operatetype == "5c0808d1f0df488daa96243fe89b2645") {
            toolbar.push({
                text: oper.chname,
                iconCls: 'am-icon-' + oper.ico,
                style: ' background: "green"; color: "white"',

                handler: function () {
                    openListForDetail(oldDiv, oper.idfield, row, 1)
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
            $('#' + div).datagrid('beginEdit', index);
        }
    }, {
            text: "删除",
            iconCls: 'am-icon-trash',
            style: ' background: "green"; color: "white"',

            handler: function () {
                let selectrow = $('#' + div).datagrid('getChecked')[0];

                if (!selectrow) {
                    $.messager.alert('提示', '请选中一行', 'warning');
                } else {
                    let index = $('#' + div).datagrid('getRowIndex', selectrow);
                    $('#' + div).datagrid('deleteRow', index);
                }
               
            }
        }, {
            text: "到顶",
            iconCls: 'am-icon-angle-double-up',
            style: ' background: "green"; color: "white"',

            handler: function () {
                let selectrow = $('#' + div).datagrid('getChecked')[0];

                if (!selectrow) {
                    $.messager.alert('提示', '请选中一行', 'warning');
                } else {
                    let index = $('#' + div).datagrid('getRowIndex', selectrow);

                    if (index != 0) {
                        $('#' + div).datagrid('endEdit', index);
                        selectrow = $('#' + div).datagrid('getChecked')[0];
                        $('#' + div).datagrid('deleteRow', index);//删除一行
                        index=0;
                        $('#' + div).datagrid('insertRow', {
                            index: index,
                            row: selectrow
                        });
                        $('#' + div).datagrid('beginEdit', index);
                        $('#' + div).datagrid('selectRow', index);
                    }
                }
            }
        }, {
            text: "上移",
            iconCls: 'am-icon-angle-up',
            style: ' background: "green"; color: "white"',

            handler: function () {
                let selectrow = $('#' + div).datagrid('getChecked')[0];

                if (!selectrow) {
                    $.messager.alert('提示', '请选中一行', 'warning');
                } else {
                    let index = $('#' + div).datagrid('getRowIndex', selectrow);

                    if (index != 0) {
                        $('#' + div).datagrid('endEdit', index);
                        selectrow = $('#' + div).datagrid('getChecked')[0];
                        $('#' + div).datagrid('deleteRow', index);//删除一行
                        index--;
                        $('#' + div).datagrid('insertRow', {
                            index: index,
                            row: selectrow
                        });
                        $('#' + div).datagrid('beginEdit', index);
                        $('#' + div).datagrid('selectRow', index);
                    }
                }
            }

           
        }, {
            text: "下移",
            iconCls: 'am-icon-angle-down',
            style: ' background: "green"; color: "white"',

            handler: function () {

               
   
                let selectrow = $('#' + div).datagrid('getSelected');


                if (!selectrow) {
                    $.messager.alert('提示', '请选中一行', 'warning');
                } else {
                    let index = $('#' + div).datagrid('getRowIndex', selectrow);
                    let rows = $('#' + div).datagrid('getRows');
                    let rowlength = rows.length;
                    if (index != rowlength-1) {
                        $('#' + div).datagrid('endEdit', index);
                       //  selectrow = $('#' + div).datagrid('getSelected');
                        $('#' + div).datagrid('deleteRow', index);//删除一行
                        index++;
                        $('#' + div).datagrid('insertRow', {
                            index: index,
                            row: selectrow
                        });
                        $('#' + div).datagrid('beginEdit', index);
                        $('#' + div).datagrid('selectRow', index);
                    }
                }

            }
        }, {
            text: "到底",
            iconCls: 'am-icon-angle-double-down',
            style: ' background: "green"; color: "white"',

            handler: function () {

                let selectrow = $('#' + div).datagrid('getSelected');


                if (!selectrow) {
                    $.messager.alert('提示', '请选中一行', 'warning');
                } else {
                    let index = $('#' + div).datagrid('getRowIndex', selectrow);
                    let rows = $('#' + div).datagrid('getRows');
                    let rowlength = rows.length;
                    if (index != rowlength - 1) {
                        $('#' + div).datagrid('endEdit', index);
                        //  selectrow = $('#' + div).datagrid('getSelected');
                        $('#' + div).datagrid('deleteRow', index);//删除一行
                        index = rowlength-1;
                        $('#' + div).datagrid('insertRow', {
                            index: index,
                            row: selectrow
                        });
                        $('#' + div).datagrid('beginEdit', index);
                        $('#' + div).datagrid('selectRow', index);
                    }
                }
            }
        }

    ];

    $('#' + div).datagrid({
        toolbar: toolbar.concat(toolbar2),
        columns: columns,
        rownumbers: true,
        singleSelect: true,
        selectOnCheck: true,
        checkOnSelect: true,
  
        fitColumns: colCount > 4 ? true : false,
    })

}
function createListForOpen(listId, olddiv, where, index) {
    let div = olddiv + index;
    setData(div, "hold_where", where);
    let postdata = {
        action: "getListConfig",
        opid: listId
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {
        //定义列头
        let columns = [[]];
        result.col.sort(function (a, b) {
            return a.lpos - b.lpos;
        });
        setData(div, "listConfig", result);
        let firstCol = {
            field: "operation",
            title: "操作",
            width: 40,
            align: 'center',
            formatter: function (value, row, index) {
                return '<a  class=" am-icon-cog fa-fw " onclick=\'operlist( window.event.pageX,window.event.pageY,"' + row["id"] + '","' + div + '")\'> <i class="am-icon-caret-down"></i></a>'
            }
        }
        columns[0].push(firstCol);
        $.each(result.col, function (i, field) {
            let f = result.col[i].fieldtype == "field_type_refer" ? result.col[i].idfield + "_show" : result.col[i].idfield;
            let idfield = result.col[i].idfield;
            let obj = {
                field: f,
                title: result.col[i].chname,
                sortable: true,
                width: 100,
                align: 'center',
                formatter: function (value, row, index) {
                    if (result.col[i].fieldtype == "field_type_refer" && value != "")
                        return value + ' <a  class=" am-icon-search" onclick =\'openCardFromList("' + idfield + '","' + row[idfield] + '","' + value + '")\'> </a>';
                    else return value;
                }
            }
            columns[0].push(obj);
        })
        //定义工具栏
        let toolbar = [];
        result.operation.sort(function (a, b) {
            return a.lpos - b.lpos;
        });
        $.each(result.operation, function (i, field) {
            if (result.operation[i].batch == 1 && result.operation[i].operatetype != "oper_type_ui_9") {
                let obj = {
                    text: result.operation[i].chname,
                    iconCls: 'am-icon-' + result.operation[i].ico,
                    style: ' background: "green"; color: "white"',

                    handler: function () { getOperConfig(result.operation[i].id, "", div) }
                }


                toolbar.push(obj);
                toolbar.push('-');


            }
        })
        let order = getData("c" + div, "order");
        let postdata = {
            action: "getListData",
            opid: listId,
            order: order,
            where: where,
            page: 1,
            rows: 10,
            otherKey: ""
        }

        toAjaxCRUDCallBack(service, postdata, function (result) {
 
            $('#c' + div).datagrid({
                toolbar: toolbar,
                columns: columns,
                rownumbers: false,
                singleSelect: true,
                sortable: true,
                fitColumns: true,
                data: result.data,
                onSortColumn: function (sort, order) {
                    $.each(result.idfield, function (i, field) {
                        if (result.idfield[i].id == sort) {
                            let orderstr = "v." + result.idfield[i].fieldname + " " + order + ",";
                            setData("c" + div, "order", orderstr);
                            $("#p" + div).pagination('select');
                        }
                    })

                }
            })

            $('#c' + olddiv).datagrid('fixDetailRowHeight', index);//在加载爷爷列表明细（即：父列表）成功时，获取此时整个列表的高度，使其适应变化后的高度，此时的索引
            $('#c' + olddiv).datagrid('fixRowHeight', index)

            $("#p" + div).pagination({
                total: Number(result.sqlcout),
                onSelectPage: function (pageNumber, pageSize) {
                    $(this).pagination('loading');
                    if (pageNumber == 0) pageNumber = 1;
                    getListData(listId, pageNumber, pageSize, div, "");
                    $(this).pagination('loaded');
                    $('#c' + olddiv).datagrid('fixDetailRowHeight', index);//在加载爷爷列表明细（即：父列表）成功时，获取此时整个列表的高度，使其适应变化后的高度，此时的索引
                    $('#c' + olddiv).datagrid('fixRowHeight', index)
                }
            });


        })

       

    })


}
function createListForStable(listId, div, where) {
    let postdata = {
        action: "getListConfig",
        opid: listId
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {
        //定义列头
        let columns = [[]];
        let ltree = result.listconf.ltree == "1" ? true : false;
        result.col.sort(function (a, b) {
            return a.lpos - b.lpos;
        });
        setData(div, "listConfig", result);
        $.each(result.col, function (i, field) {
            let f = result.col[i].fieldtype == "field_type_refer" ? result.col[i].idfield + "_show" : result.col[i].idfield;
            let idfield = result.col[i].idfield;
            let obj = {
                field: f,
                title: result.col[i].chname,
                width: 100,
                align: ltree ? 'left' : 'center',
        
                styler: function (value, row, index) {
                    return 'border-left:0;border-right:0';
                },
                formatter: function (value, row, index) {
                    let typeField = result.col[i].fieldtype;
                    if (value != "") {
                        switch (typeField) {
                            case "field_type_bool":
                                return value == "1" ? "是" : "否";
                            case "field_type_refer":
                                return value + ' <a  class=" am-icon-search" onclick =\'openCardFromList("' + idfield + '","' + row[idfield] + '","' + value + '")\'> </a>';
                            case "field_type_doc":
                                let updataFile = getData(div, "updataFile");
                                let arryValue = value.split(";");
                                let vv = "";
                                $.each(updataFile, function (n, ud) {
                                    if (ud[idfield]) {
                                        let pathLoad = ud["mulu" + idfield];
                                        let a = ud[idfield];

                                        $.each(arryValue, function (j, d) {
                                            $.each(a, function (j, ddd) {
                                                if (d == ddd.id) {
                                                    let fileName = ddd.chname;
                                                    let urlFile = d + fileName.substring(fileName.indexOf("."), fileName.length);
                                                    vv += fileName + "<i class='am-icon-download' onclick=\"downfile('" + pathLoad.substring(0, pathLoad.length) + "','" + urlFile + "')\"></i><br>"
                                                }
                                            })
                                        })

                                    }
                                })
                                return vv;
                            default:
                                return value;
                        }
                    }
                    else return value;
                }
            }
            columns[0].push(obj);
        })
        //定义工具栏
        let toolbar = [];


        //添加数据
        // let data = []
        //创建list

        if (where == "" || where == undefined) createSearch(result.seachData, div);
        getListData(listId, 1, 10, div, "", where);
        if (!ltree) {
            $('#c' + div).datagrid({
                toolbar: toolbar,
                columns: columns,
                rownumbers: false,
                singleSelect: true,
                fitColumns: true,
                striped: true,
                onSortColumn: function (sort, order) {
                    $.each(result.idfield, function (i, field) {
                        if (field.id == sort || field.id + "_show" == sort) {
                            let orderstr;
                            if (field.fieldtype == "field_type_refer")
                                orderstr = field.fieldname + "_" + field.idobject + "." + field.refer + " " + order + ",";
                            else
                                orderstr = "v." + result.idfield[i].fieldname + " " + order + ",";
                            setData("c" + div, "order", orderstr);
                            $("#p" + div).pagination('select');
                        }

                    })
                }
            })
        }
        else {
            $('#c' + div).treegrid({
                idField: 'id',
                treeField: result.col[0].idfield,
                toolbar: toolbar,
                columns: columns,
                //rownumbers: true,
                singleSelect: true,

                fitColumns: true,

            })
        }
    })


}
function createSearch(data,  div) {
  
    let obj = data.where;
    if (obj.length > 0) {
        obj.sort(function (a, b) { return a.lpos - b.lpos });
        $.each(obj, function (i, da) {
            $("#f" + div).append("<div class='am-form-group am-input-group-sm'><select class='am-form-field'  sname='" + obj[i].id + "'>" + selectEQ(obj[i].where_type) + "</select></div>");
           if (da.htsx != "1")
                $("#f" + div + " [sname=" + obj[i].id + "]").hide();

            switch (obj[i].fieldui) {
                case "bool":
                    $("#f" + div).append('<div class="am-input-group am-input-group-sm"><input type="text" placeholder=\"' + obj[i].chname + '\" id=\"' + obj[i].id + '\" class="am-form-field"></div>');
                    break;
                case "field_type_ldate_ui":
                    $("#f" + div).append('<div class="am-input-group am-input-group-sm"><input type="text" placeholder=\"' + obj[i].chname + '\" id=\"' + obj[i].id + '\" class="am-form-field" ></div>');
                    $("#f" + div + " [id=" + obj[i].id + "]").datetimebox({
                        prompt: obj[i].chname,
                    }); break;
                case "field_type_sdate_ui":
                    $("#f" + div).append('<div class="am-input-group am-input-group-sm"><input type="text" placeholder=\"' + obj[i].chname + '\" id=\"' + obj[i].id + '\" class="am-form-field" ></div>');
                    $("#f" + div + " [id=" + obj[i].id + "]").datebox({
                        prompt: obj[i].chname,
                       }); break;
                case "enum0":
                    $("#f" + div).append('<div class="am-input-group am-input-group-sm"><input type="text" placeholder=\"' + obj[i].chname + '\" id=\"' + obj[i].id + '\" class="am-form-field"></div>');
                    break;

                default:
                    $("#f" + div).append('<div class="am-input-group am-input-group-sm"><input type="text" placeholder=\"' + obj[i].chname + '\" id=\"' + obj[i].id + '\" class="am-form-field"></div>');
                    break;

            }
          //  html += "<input class='easyui-textbox' data-options='prompt: \"" + obj[i].chname + "\"'  onkeydown='if (event.keyCode == 13) {}' where='" + obj[i].fieldname + "'  type='text' name='" + i + "'>"
           // $("#f" + div).append(html);
        })

        let searchBtn = {
            id: "search" + div,
            ico: "search",
            color: "#f3f3f3",//"#1E9FFF",
            text: "查询",
            type:"search"
        }
        createBtn("f" + div, searchBtn);
        $('#search' + div).bind('click', function () {
            $("#table"+div).dataTable().fnDraw(false);
        });
    }
    else {
      
    }
    return this;


}//创建查询div
function createSearchForReport(obj, div,opid,isExOut) {
    if (obj.length > 0) {
        obj.sort(function (a, b) { return a.lpos - b.lpos });
        $.each(obj, function (i, da) {
            switch (obj[i].where_type) {
                case "bool":
                    $("#f" + div).append('<input type="text" id=\"' + obj[i].id + '\" >');
                    $("#f" + div + " [id=" + obj[i].id + "]").combobox({
                        valueField: 'id',
                        textField: 'chname',
                        data: [{ id: "", chname: obj[i].chname }, { id: "1", chname: "是" }, { id: "0", chname: "否" }],
                        panelHeight: "auto",
                        editable: false
                    });
                    break;
                case "field_type_ldate_ui":
                    $("#f" + div).append('<input type="text" id=\"' + obj[i].id + '\" >');
                    $("#f" + div + " [id=" + obj[i].id + "]").datetimebox({
                        prompt: obj[i].chname,
                    }); break;
                case "field_type_sdate_ui":
                    $("#f" + div).append('<input type="text" id=\"' + obj[i].id + '\" >');
                    $("#f" + div + " [id=" + obj[i].id + "]").datebox({
                        prompt: obj[i].chname,
                    }); break;
                case "enum0":
                    $("#f" + div).append('<input type="text" id=\"' + obj[i].id + '\" >');
                    let enumData = obj[i].sys_enum.sort(function (a, b) { return a.lpos - b.lpos });
                    enumData.unshift({ id: "", chname: "选择" + obj[i].chname });
                    $("#f" + div + " [id=" + obj[i].id + "]").combobox({
                        valueField: 'id',
                        textField: 'chname',
                        data: enumData,
                        panelHeight: obj[i].sys_enum.length > 10 ? "250" : "auto",
                        editable: false
                    });
                    break;

                default:
                    $("#f" + div).append('<input type="text" id=\"' + obj[i].id + '\" >');
                    $("#f" + div + " [id=" + obj[i].id + "]").textbox({
                        prompt: obj[i].chname,
                    });
                    $("#f" + div + " [id=" + obj[i].id + "]").textbox('textbox').keydown(function (e) {
                        if (e.keyCode == 13) {
                            getReportData(opid, div);
                        }
                    });
                    break;

            }

        })

        let searchBtn = {
            id: "search" + div,
            ico: "search",
            color: "#f3f3f3",//"#1E9FFF",
            text: "查询"
        }
        createBtn("f" + div, searchBtn);
        $('#search' + div).bind('click', function () {
            getReportData(opid, div);
        });
        if (isExOut) {
            let downloadBtn = {
                id: "download" + div,
                ico: "download",
                color: "#f3f3f3",//"#1E9FFF",
                text: "导出"
            }
            createBtn("f" + div, downloadBtn);
            $('#download' + div).bind('click', function () {
                downloadData(opid, div);
            });
        }
    }

}//创建查询div

function selectEQ(eq) {
    let html = "";
    switch (eq) {
        default:
             html = "<option value=\"include\" selected='selected'>包含</option><option value=\"ninclude\">不包含</option><option value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "include":
            html = "<option value=\"include\" selected='selected'>包含</option><option value=\"ninclude\">不包含</option><option value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "ninclude":
            html = "<option value=\"include\" >包含</option><option selected='selected'  value=\"ninclude\">不包含</option><option value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "equal":
            html = "<option value=\"include\" >包含</option><option value=\"ninclude\">不包含</option><option selected='selected' value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "nequal":
            html = "<option value=\"include\" >包含</option><option value=\"ninclude\">不包含</option><option  value=\"equal\" >=</option><option selected='selected' value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "dayudengyu":
            html = "<option value=\"include\" >包含</option><option value=\"ninclude\">不包含</option><option value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option selected='selected'  value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "dayu":
            html = "<option value=\"include\" >包含</option><option value=\"ninclude\">不包含</option><option  value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option selected='selected' value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "xiaoyudengyu":
            html = "<option value=\"include\" >包含</option><option value=\"ninclude\">不包含</option><option  value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option  value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option selected='selected' value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "xiaoyu":
            html = "<option value=\"include\" >包含</option><option value=\"ninclude\">不包含</option><option value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option selected='selected' value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "fc2a6f2f701eec5ec0e076c7682e5c8c":
            html = "<option value=\"include\" >包含</option><option value=\"ninclude\">不包含</option><option  value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option selected='selected' value=\"from1\">以此开始</option><option value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;
        case "02188ce62dbb58246e64a877f4de8916":
            html = "<option value=\"include\" >包含</option><option value=\"ninclude\">不包含</option><option value=\"equal\" >=</option><option value=\"nequal\"><></option></option><option value=\"dayu\">></option></option><option value=\"dayudengyu\">>=</option></option><option value=\"xiaoyu\"><</option></option><option value=\"xiaoyudengyu\"><=</option><option value=\"from1\">以此开始</option><option selected='selected' value=\"from2\">以此结束</option><option value=\"null\">空</option><option value=\"notnull\">非空</option>"; break;

    }
    return html;
}//添加比较操作符返回html

function getWhere(div) {
    let html = "";
    let hold_where = getData(div, "hold_where");
    if (hold_where != undefined && hold_where != "")
        html = hold_where;
    if (html == "") { 
    let r = getData(div, "listConfig");
    let where = r.seachData.where;
    let idfield = r.idfield;

    $.each(where, function (i, field) {
        let fieldName = "v." + field.fieldname;
        $.each(idfield, function (j, ff) {
            if (field.fieldname == ff.fieldname && ff.fieldtype == "field_type_refer") {
                fieldName = field.fieldname + "_" + ff.idobject + "." + ff.refer;
            }
        })
        let t = $("#f" + div + " [id='" + field.id + "']");
        let val = t.val();
        if (val != "") {
            html += sys_eq($("#f" + div).find("select[sname=\"" + field.id + "\"]").val(), fieldName, val);
        }

    })

        return html + " 1=1 ";
}
    return html;
}//比较某个div下所有input元素非空的值,生成where条件

function openList(carrOnDiv, opId, obId, row) {
    let div = carrOnDiv + row;
    let group = getData(carrOnDiv, "operConfig").group;
    let newWindow = guid();
    let valueText = $("#" + div + " [id='" + obId + "_show']").val();//要查找的文本
    $("body").append('<div id="' + newWindow + '" class="am-g am-form-inline" ><div id="f' + newWindow + '"  class="am-u-md-8" style="width: auto; float: right;"></div><div id="c' + newWindow + '"><table width="100%"     class="am-table am-table-striped am-table-hover table-main am-text-nowrap"  id = "table' + newWindow+'" ></table ></div><div id="p' + newWindow + '"></div></div>');
    let where = "";
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
    let sys_hold = getData(carrOnDiv, "operConfig").sys_hold;
    if (sys_hold.length > 0) {
        for (let i = 0; i < sys_hold.length; i++) {
            let holdfrom = sys_hold[i].holdfrom;
            let holdto = sys_hold[i].holdto;
            let holdeq = sys_hold[i].holdeq;
            let idfield = sys_hold[i].idfield;
            if (holdto == obId) {
                let holdfromvalue = $("#" + carrOnDiv + " [id='" + holdfrom + "']").textbox("getValue");//约束值
                
                hold_where += sys_eq(holdeq, " v." + idfield, holdfromvalue);
            }
           

        }
    }
    if (hold_where != "" || where!="") {
        where = where == "" ? hold_where + " 1=1 " : where + " and " + hold_where + " 1=1 ";
        setData(newWindow, "hold_where", where);
    }


/*约束实现结束*/

    createSelectList(opId, newWindow, obId, carrOnDiv,where,row);
    setDivCenter(newWindow, "查找", 800);
}
//multiple 0 单选 1 多选 2 保存
function openListForDetail(carrOnDiv,  obId, row, multiple) {
    let div = carrOnDiv + row;
    let group = getData(carrOnDiv, "operConfig").group;
    let opId;
    $.each(group[row].field, function (i, d) {
        if (d.id == obId) opId = d.list;
    })
    let valueText = "", where = "";
    let newWindow = guid();
    if (multiple == 0) {
        let selectrow = $("#" + div).datagrid("getSelected");//点击的行
        if (selectrow == null) return false;

        let index = $('#' + div).datagrid('getRowIndex', selectrow);
        $('#' + div).datagrid('endEdit', index);
        $('#' + div).datagrid('beginEdit', index);
        selectrow = $("#" + div).datagrid("getSelected");//点击的行
        newWindow = selectrow["id"];
        $("#" + div).append('<div id="' + newWindow + '"><div id="f' + newWindow + '"></div><div id="c' + newWindow + '"></div><div id="p' + newWindow + '"></div></div>');

        valueText = selectrow[obId + "_show"] == undefined? selectrow[obId] : selectrow[obId + "_show"];
    }
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
    let sys_hold = getData(carrOnDiv, "operConfig").sys_hold;
    if (sys_hold.length > 0) {
        for (let i = 0; i < sys_hold.length; i++) {
            let holdfrom = sys_hold[i].holdfrom;
            let holdto = sys_hold[i].holdto;
            let holdeq = sys_hold[i].holdeq;
            let idfield = sys_hold[i].idfield;
            if (holdto == obId) {
                let holdfromvalue = $("#" + carrOnDiv + " [id='" + holdfrom + "']").textbox("getValue");//约束值
                if(holdfromvalue!="")
                hold_where += sys_eq(holdeq, " v." + idfield, holdfromvalue);
            }


        }
    }
    let sys_hold_sub = getData(carrOnDiv, "operConfig").sys_hold_sub;
    if (sys_hold_sub&&sys_hold_sub.length > 0) {
        for (let i = 0; i < sys_hold_sub.length; i++) {
            let holdfrom = sys_hold_sub[i].holdfrom;
            let holdto = sys_hold_sub[i].holdto;
            let holdeq = sys_hold_sub[i].holdeq;
            let idfield = sys_hold_sub[i].idfield;
            if (holdto == obId) {
                let holdfromvalue = selectrow[holdfrom];//约束值
                if (holdfromvalue != "")
                    hold_where += sys_eq(holdeq, " v." + idfield, holdfromvalue);
            }


        }
    }



    /*约束实现结束*/
    if (multiple == 0) {
        createSelectList(opId, newWindow, obId, carrOnDiv, where,row);
        setDivCenter(newWindow, "查找", 800);
    } else {
      
      
        $("#" + div).append('<div id="' + newWindow + '"><div id="f' + newWindow + '"></div><div id="c' + newWindow + '"></div><div id="p' + newWindow + '"></div></div>');
        createSelectListForRows(opId, newWindow, obId, carrOnDiv, where, row, multiple);
        setDivCenter(newWindow, "添加", 800);
    }
    if (hold_where != "" || where != "") {
        where = where == "" ? hold_where + " 1=1 " : where + " and " + hold_where + " 1=1 ";
        setData(newWindow, "hold_where", where);
    }
    
}
//弹出 单选list
function createSelectList(operid, div, obId,carryOnDiv,where,row) {
    let postdata = {
        action: "getListConfig",
        opid: operid
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {
        //定义列头
        setData(div, "listConfig", result);
        let columns = [];

        result.col.sort(function (a, b) {
            return a.lpos - b.lpos;
        });
        setData(div, "listConfig", result);
    let firstCol = {
   "sClass": "table-check",
   "sTitle": "",
   "mDataProp": "id",
        "render": function (oObj, sVal, aData,index) {
            return '<input type=\'radio\' id=\'' + oObj + '\' onclick="selectRefer(\'' + carryOnDiv + '\', ' + index.row+', \''+div+'\','+row+')"  >';
   },
   "sDefaultContent": "",
   "bSortable": false,
   "sWidth": "1%"
}

columns.push(firstCol);
        $.each(result.col, function (i, field) {
            let f = result.col[i].fieldtype == "field_type_refer" ? result.col[i].idfield + "_show" : result.col[i].idfield;
            let idfield = result.col[i].idfield;
            //  let id = result.col[i].id;
            let obj = {
                mDataProp: f,
                sTitle: result.col[i].chname,
                bSortable: false,
                sWidth: 100,
                render: function (value, cellmeta, row, index) {
                    let typeField = result.col[i].fieldtype;
                    if (value != "") {
                        switch (typeField) {
                            case "field_type_bool":
                                return value == "1" ? "是" : "否";
                            case "field_type_refer":
                                return value + '<a  class="am-icon-search" onclick =\'openCardFromList("' + idfield + '","' + row[idfield] + '","' + value + '")\'> </a>';
                            case "field_type_doc":
                                let updataFile = getData(div, "updataFile");
                                let arryValue = value.split(";");
                                let vv = "";
                                $.each(updataFile, function (n, ud) {
                                    if (ud[idfield]) {
                                        let pathLoad = ud["mulu" + idfield];
                                        let a = ud[idfield];

                                        $.each(arryValue, function (j, d) {
                                            $.each(a, function (j, ddd) {
                                                if (d == ddd.id) {
                                                    let fileName = ddd.chname;
                                                    let urlFile = d + fileName.substring(fileName.indexOf("."), fileName.length);
                                                    vv += fileName + "<i class='am-icon-download' onclick=\"downfile('" + pathLoad.substring(0, pathLoad.length) + "','" + urlFile + "')\"></i><br>"
                                                }
                                            })
                                        })

                                    }
                                })
                                return vv;
                            default:
                                return value;
                        }
                    }
                    else return value;
                }
            }
            columns.push(obj);
        });


        //添加数据
        // let data = []
        //创建list

        if (where == "" || where == undefined) createSearch(result.seachData, div);
        initializeTable("table" + div, columns, fnRowCallback, "Controler.ashx", div, operid, obId);
        $("#" + div + " .am-dropdown-toggle").bind("click", function () {

            var ulid = $(this).attr("butid");
            $("[ulSet='ulSet']").each(function () {
                var ulId = $(this).attr("ulid");
                if (ulId == ulid) {
                    if ($(this).attr("isShow") == "true") {
                        $(this).hide();
                        $(this).attr("isShow", "false");
                    } else {
                        $(this).show();
                        $(this).attr("isShow", "true");
                    }
                } else {
                    $(this).hide();
                    $(this).attr("isShow", "false");
                }
            });
        })
    })
     
}
//弹出 单选list
function createSelectListForRows(operid, div, obId, carryOnDiv, where, row, multiple) {
    //operid = "sys_field_list"; obId = "92bd0704ed6e7aa2a795f4a6eb9fa475";
    let postdata = {
        action: "getListConfig",
        opid: operid
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {
        //定义列头
        setData(div, "listConfig", result);
        let ltree = result.listconf.ltree == "1" ? true : false;
        let columns = [[]];
        let firstCol = {
            field: "id",
            width: 40,
            align: 'center',
            checkbox: true
        }
        columns[0].push(firstCol);
        //定义工具栏
        let toolbar ;
        if (multiple == 2) {
            toolbar = [{
                text: "保存",
                iconCls: 'am-icon-check',
                style: ' background: "green"; color: "white"',

                handler: function () {
                    saveAddDetail(carryOnDiv, div,row)
                }
            }]
        } else if (multiple == 3){
            toolbar = [{
                text: "确定",
                iconCls: 'am-icon-check',
                style: ' background: "green"; color: "white"',

                handler: function () {
                    selectRefer4(carryOnDiv, div, row, obId)
                }
            }]
        }else {
            toolbar = [{
                text: "确定",
                iconCls: 'am-icon-check',
                style: ' background: "green"; color: "white"',

                handler: function () {
                    selectRefer3(carryOnDiv, div, row)
                }
            }]
        }

        $.each(result.col, function (i, field) {
            let f = result.col[i].fieldtype == "field_type_refer" ? result.col[i].idfield + "_show" : result.col[i].idfield;

            let obj = {
                field: f,
                title: result.col[i].chname,
                sortable: true,
                width: 100,
                align: 'center',
                formatter: function (value, row, index) {
                    let typeField = result.col[i].fieldtype;
                    if (value != "") {
                        switch (typeField) {
                            case "field_type_bool":
                                return value == "1" ? "是" : "否";

                            default:
                                return value;
                        }
                    }
                    else return value;
                }
            }
            columns[0].push(obj);
        })

        if (where == "" || where == undefined) createSearch(result.seachData, div);
        getListData(operid, 1, 10, div, obId, where);
        if (!ltree)
            $('#c' + div).datagrid({
                toolbar: toolbar,
                columns: columns,
                sortable: true,
                onSortColumn: function (sort, order) {
                    $.each(result.idfield, function (i, field) {
                        if (result.idfield[i].id == sort) {
                            let orderstr = "v." + result.idfield[i].fieldname + " " + order + ",";
                            setData("c" + div, "order", orderstr);
                            $("#p" + div).pagination('select');
                        }
                    })
                }, onDblClickRow: function (rowIndex, rowData) {
                    // alert(JSON.stringify(rowData))
                    selectRefer(carryOnDiv, rowData, div,row);
                }
            })
        else {

            $('#c' + div).treegrid({
                idField: 'id',
                treeField: result.col[0].idfield,
                toolbar: toolbar,
                columns: columns,
                //rownumbers: true,


                fitColumns: true,

                onDblClickRow: function (rowData) {

                    selectRefer(carryOnDiv, rowData, div,row);
                }

            })

        }
        $.parser.parse($("#" + div));
    })
}

function selectRefer(carryOnDiv, index, div, divRow) {
    let group = getData(carryOnDiv, "operConfig").group;
    var tbl = $("#table"+div).dataTable();
    var trList = tbl.fnGetNodes();
    
    var a = tbl.fnGetData(trList[index]);


    let type = "";
    //let divRow = 0;
        for (key in a) {


            if (key.substring(key.length - 6, key.length) == "_m_a_p" && key.substring(key.length - 11, key.length) != "_show_m_a_p") {
                let realKey = key.replace("_m_a_p", "");
                let fieldui = "", tshow = "";
                $.each(group, function (i, data) {
                    let fieldData = group[divRow].field;
                    type = group[divRow].type;
                    $.each(fieldData, function (j, da) {
                        if (fieldData[j].id == realKey) {
                            fieldui = fieldData[j].fieldui;
                         }
                    })
                })
                if (type == "group_0") {
                    let t = $("#" + carryOnDiv + " [id='" + realKey + "']");
                    switch (fieldui) {
                        case "enum0":
                            t.val(a[realKey]);
                            break
                        case "refer0":
                            t.val(a[realKey]);
                            tshow = a[realKey + "_show_m_a_p"];
                            $("#" + carryOnDiv + " [id='" + realKey + "_show']").val( tshow);
                            break

                        case "refer3":
                            t.val(a[realKey]);
                            tshow = a[realKey + "_show_m_a_p"];
                            $("#" + carryOnDiv + " [id='" + realKey + "_show']").val(tshow);
                            break
                        case "bool":
                            t.val(a[realKey]);
                            break;
                        default:
                            t.val(a[realKey]);
                            break;
                    }
                } else if (type == "group_1") {
                    let selectrow = $("#" + carryOnDiv + divRow).datagrid('getChecked')[0];//点击的行
                    if (selectrow["id"] != div) return false;
                    else {
                        selectrow[realKey] = a[key];
                        selectrow[realKey + "_show"] = a[realKey + "_show_m_a_p"];
                        let index = $('#' + carryOnDiv + divRow).datagrid('getRowIndex', selectrow);
                        $('#' + carryOnDiv + divRow).datagrid('deleteRow', index);//删除一行
  
                        $('#' + carryOnDiv + divRow).datagrid('insertRow', {
                                index: index,
                                row: selectrow
                        });
                     
                            $('#' + carryOnDiv + divRow).datagrid('beginEdit', index);
                            $('#' + carryOnDiv + divRow).datagrid('selectRow', index);
                        
                    }
                }

            }

        }

    layer.close($("#" + div).attr("index"));
     
}

//type 0 添加字段 1添加列表，2保存数据
function selectRefer3(carryOnDiv, div, row) {
    let group = getData(carryOnDiv, "operConfig").group;
    // let type = "";
    let insertDiv = carryOnDiv + row;
    let aData = $('#c' + div).datagrid('getSelections');

        for (let i = 0; i < aData.length; i++) {
            let a = aData[i];
            let result = group[row];
            let nullRow = {};
            $.each(result.col, function (i, field) {
                $.each(result.field, function (j, fd) {
                    if (fd.id == result.col[i].idfield) {
                        let Default = "";
                        if (fd.Default1.indexOf("sys_") != -1) { Default = sys_f_analyse(div, fd.Default1); } else { Default = fd.Default1; }
                        nullRow[result.col[i].idfield] = Default;
                    }
                })
            })
            let newNullRow = {};
            for (key in a) {


                if (key.substring(key.length - 6, key.length) == "_m_a_p" && key.substring(key.length - 11, key.length) != "_show_m_a_p") {
                    let realKey = key.replace("_m_a_p", "");
                    $.each(group, function (i, data) {
                        let fieldData = group[i].field;
                        $.each(fieldData, function (j, da) {
                            if (fieldData[j].id == realKey) {
                                fieldui = fieldData[j].fieldui;
                            }
                        })
                    })


                    newNullRow[realKey] = a[key];
                    newNullRow[realKey + "_show"] = a[realKey + "_show_m_a_p"];


                }

            }
            let id = guid();

            newNullRow["id"] = id;
            $('#' + insertDiv).datagrid('appendRow', newNullRow);

            let index = $('#' + insertDiv).datagrid('getRows').length - 1;
            $('#' + insertDiv).datagrid('beginEdit', index);


            $("#" + div).window('close');

        
    }

}
// 多选参照
function selectRefer4(carryOnDiv, div, row, obId) {
    let group = getData(carryOnDiv, "operConfig").group;
    // let type = "";
    let insertDiv = carryOnDiv + row;
    let aData = $('#c' + div).datagrid('getSelections');
    let t = $("#" + insertDiv + " [id=" + obId + "]");
    let idval="", idvalshow="";
    $.each(aData, function (i, d) {
        idval += d[obId+"_m_a_p"] + ";";
        idvalshow += d[obId + "_show_m_a_p"]+";";
    })
    t.textbox("setValue", idval);
    t.textbox("setText", idvalshow);
    $("#" + div).window('close');
}
//批量添加明细--保存
function saveAddDetail(carryOnDiv, div, row) {
    let updateDiv = carryOnDiv + row;
    let group = getData(carryOnDiv, "operConfig").group;
    let id = $("#" + carryOnDiv).attr("realId");
    let oldOperId = $("#" + carryOnDiv).attr("opId");
    let opId = $("#" + carryOnDiv).attr("addOpId");
    let rowData = $("#c" + div).datagrid("getSelections");
    let data = "";
    $.each(rowData, function (i, d) {
        data += d.id + ",";
    })
    let groupData = {
        oldOperId: oldOperId,
        dataId: data.substring(0, data.length - 1),
        id: id,
        mKey: group[row].object_field
    }

    let postData = {
        action: "save",
        opid: opId,
        data: JSON.stringify(groupData),
      id:""
    }
    toAjaxCRUDCallBack(service, postData, function (result) {
        $("#" + div).window("close");
        $("#p" + updateDiv).pagination('select');

    })
}

function getTreeListData( data,ws) {//ws 根目录 结构字段最小位数

    let rdata = [];//整理数据
    let newDataItems = [] 	//存放结果数据

    $.each(data, function (i, d) {
        let l = d._parId.length / 3;
        let key = d._parId;
        d.children = [];

        if (rdata[l])
            rdata[l][key] = d;
        else {
            rdata[l] = {};
            rdata[l][key] = d;
        }
    })
    let i = rdata.length-1;
    while (i > 0) {
        if (rdata[i]) {
            let d = rdata[i];
            for (let key in d) {
                let parid = d[key]._parId.substring(0, d[key]._parId.length-3);

                if (parid.length > ws&& rdata[i - 1][parid]) {
                    let sj = rdata[i - 1][parid];
                    //如果存在上级，重写上级
                        sj.children.push(d[key]);
                    rdata[i - 1][parid] = sj;
                }
                else
                    newDataItems.push(d[key]);
            
            }
        }
        i = i - 1;
    }
    return newDataItems;
}
function operCheckList(operid, div,  where) {
    let postdata = {
        action: "getListConfig",
        opid: operid
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {
        //定义列头
        setData(div, "listConfig", result);
        let columns = [];
        $.each(result.col, function (i, field) {
            let f = result.col[i].fieldtype == "field_type_refer" ? result.col[i].idfield + "_show" : result.col[i].idfield;
            let idfield = result.col[i].idfield;
            //  let id = result.col[i].id;
            let obj = {
                mDataProp: f,
                sTitle: result.col[i].chname,
                bSortable: false,
                sWidth: 100,
                render: function (value, cellmeta, row, index) {
                    let typeField = result.col[i].fieldtype;
                    if (value != "") {
                        switch (typeField) {
                            case "field_type_bool":
                                return value == "1" ? "是" : "否";
                            case "field_type_refer":
                                return value + '<a  class="am-icon-search" onclick =\'openCardFromList("' + idfield + '","' + row[idfield] + '","' + value + '")\'> </a>';
                            case "field_type_doc":
                                let updataFile = getData(div, "updataFile");
                                let arryValue = value.split(";");
                                let vv = "";
                                $.each(updataFile, function (n, ud) {
                                    if (ud[idfield]) {
                                        let pathLoad = ud["mulu" + idfield];
                                        let a = ud[idfield];

                                        $.each(arryValue, function (j, d) {
                                            $.each(a, function (j, ddd) {
                                                if (d == ddd.id) {
                                                    let fileName = ddd.chname;
                                                    let urlFile = d + fileName.substring(fileName.indexOf("."), fileName.length);
                                                    vv += fileName + "<i class='am-icon-download' onclick=\"downfile('" + pathLoad.substring(0, pathLoad.length) + "','" + urlFile + "')\"></i><br>"
                                                }
                                            })
                                        })

                                    }
                                })
                                return vv;
                            default:
                                return value;
                        }
                    }
                    else return value;
                }
            }
            columns.push(obj);
        });

        createSearch(result.seachData, div);
      //  getListData(operid, 1, 10, div, "", where);
       // if (where == "" || where == undefined) createSearch(result.seachData, div);
        initializeTable("table" + div, columns, fnRowCallback, "Controler.ashx", div, operid);

    })
}

function downLoadList(div, listId) {
    let where =getWhere(div);
    let order = getData("c" + div, "order");
    let postData = {
        action: "downLoadList",
        opid: listId,
        where: where,
        order: order
    }
    toAjaxCRUDCallBack(service, postData, function (result) {

            let curWwwPath = window.document.location.href
        let path = curWwwPath.substring(0, curWwwPath.indexOf(window.document.location.pathname));
        window.open(path + "\\consys\\templet\\" + result.fileName)
        
    })
}
function report(listId, div) {
    let postdata = {
        action: "getReportConfig",
        opid: listId
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {
        //定义列头
        let columns = [[]];
        let firstCol = {
            field: "operation",
            title: "操作",
            width:40,
            align: 'center',
            formatter: function (value, row, index) {
                return '<a  class=" am-icon-cog fa-fw " onclick=\'operlist( window.event.pageX,window.event.pageY,"' + row["id"] + '","' + div + '")\'> <i class="am-icon-caret-down"></i></a>'
            }
        }
        columns[0].push(firstCol);
        $.each(result.col, function (i, field) {
            let obj = {
                field: field.report_field_name,
                title: field.chname,
                sortable: true,
                width:100,
                align:'center',

            }
            columns[0].push(obj);
        })
        //定义工具栏
        let toolbar = [];
      /*  result.operation.sort(function (a, b) {
            return a.lpos - b.lpos;
        });
        $.each(result.operation, function (i, field) {
            if (field.batch == 1 && field.operatetype != "5c0808d1f0df488daa96243fe89b2645") {

                let obj = {
                    text: field.chname,
                    iconCls: 'am-icon-' + result.operation[i].ico,
                    style: ' background: "green"; color: "white"',

                    handler: function () {

                        if (field.operatetype == "oper_type_ui_9")
                            downLoadList(div, listId);
                        else getOperConfig(field.id, "", div);
                    }
                }

                toolbar.push(obj);
                toolbar.push('-');


            }
        })*/
        createSearchForReport(result.seachData, div, listId,true);
        setData(div, "where", result.seachData);
        $('#c' + div).datagrid({
            toolbar: toolbar,
            columns: columns,
            rownumbers: false,
            singleSelect: true,
            sortable: true,
            fitColumns: true,
            onSortColumn: function (sort, order) { }
        });
        
        getReportData(listId, div);
    })


}
function downloadData(operid, div) {
    let ww = getData(div, "where");
    let where = "{";
    $.each(ww, function (i, d) {
        let key = d.id;
        let v = $("#f" + div + " [id=" + d.id + "]").textbox("getValue");
        where += key + ":" + v + ",";
    })
    if (where != "") where = where.substring(0, where.length - 1) + "}"
    let postdata = {
        action: "downloadData",
        opid: operid,
        where: where,
    }
    toAjaxCRUDCallBack(service, postdata, function (result) {
        let curWwwPath = window.document.location.href
        let path = curWwwPath.substring(0, curWwwPath.indexOf(window.document.location.pathname));
        window.open(path + "\\consys\\templet\\" + result.fileName)
    })
}
function getReportData(operid, div) {
    let ww = getData(div, "where");
    let where = "{";
    $.each(ww, function (i, d) {
        let key = d.id;
        let v = $("#f" + div + " [id=" + d.id + "]").textbox("getValue");
        where += key+":"+v+"," ;
    })
    if (where != "") where = where.substring(0, where.length-1)+"}"
    let postdata = {
        action: "getReportData",
        opid: operid,
        where: where,
    }

    toAjaxCRUDCallBack(service, postdata, function (result) {
            $('#c' + div).datagrid({
                data: result.data,
            });
    })

}
function amdropdowntoggle (obj) {
    var ulid = obj.attr("butid");
    $("[ulSet='ulSet']").each(function () {
        var ulId = $(this).attr("ulid");
        if (ulId == ulid) {
            if ($(this).attr("isShow") == "true") {
                $(this).hide();
                $(this).attr("isShow", "false");
            } else {
                $(this).show();
                $(this).attr("isShow", "true");
            }
        } else {
            $(this).hide();
            $(this).attr("isShow", "false");
        }
    });
};
