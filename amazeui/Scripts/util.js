/********************常量 Begin********************/
var EN_BADGE='<span class="am-badge am-badge-primary am-radius">启用</span>';
var DIS_BADGE='<span class="am-badge am-badge-warning am-radius">禁用</span>';
const ROLE_DESCRIPE = "Role:RegionalManager";
/********************常量 END********************/

$("input").attr("autocomplete","off");//禁用页面联想
var labelShowName = "标签";
//绑定全局Complete事件
$(document).ajaxComplete( function(event, jqXHR, options){
	//console.log(2)
	layer.closeAll('loading'); // 关闭加载层
	if(jqXHR.readyState==4
			&& (null==jqXHR.responseJSON && null==jqXHR.responseText)
			&& jqXHR.status==200 
			&& options.type=='POST'){
		
		openAlert(0,"提示","登陆超时，请重新登陆！",function(){
			location.reload();
		});
	}
});


 

/*
//捕捉所有前端异常并在后台保存记录
window.onerror = function(msg,url,line){
	var userAgent = navigator.userAgent;
	if (msg != "Script error." && url != null){
		url+= "\r\n"+window.location.href;
		setTimeout(function(){
			toAjaxCRUD("log/frontExceptionCatch",{"msg":msg,"url":url,"line":line,"userAgent":userAgent});
		},0);
	}
};
*/
//解决低版本IE无法通过window.location.href跳转的问题
function getContextPath() {
    /*var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    return result;*/
	return path;
  }


// 发送ajax请求、 地址、 参数
function toAjaxCRUD(url, data) {
	var d = null;
	$.ajax({
		cache : true,
		type : "POST",
		url : url,
		data : data,
		async : false,
		success : function(data) {
			layer.closeAll('loading'); // 关闭加载层
			d = data;
		}
	});
	return d;
}


//发送ajax请求、 地址、 参数 回掉
function toAjaxCRUDCallBack(url, data,callBack) {
	$.ajax({
		cache : true,
		type : "POST",
		url : url,
		data : data,
		async : true,
		success : function(data) {
			callBack(data);
			layer.closeAll('loading'); // 关闭加载层
		}
	});
}

function toAjaxCRUDCallBackSync(url, data,callBack) {
	$.ajax({
		cache : true,
		type : "POST",
		url : url,
		data : data,
		async : false,
		success : function(data) {
			callBack(data);
			layer.closeAll('loading'); // 关闭加载层
		}
	});
}

//发送ajax请求、 地址、 参数 回掉,但是不缓存查询的数据
function toAjaxCRUDCallBackForLogin(url, data,callBack) {
	$.ajaxSetup({
		cache:false
		});
	$.ajax({
		type : "POST",
		url : url,
		data : data,
		async : true,
		success : function(data) {
			callBack(data);
			layer.closeAll('loading'); // 关闭加载层
		}
	});
}

// 发送ajax请求、 地址、 参数
function toAjaxDetail(url, data, msg, id,isNotClose) {
	$.ajax({
			cache : true,
			type : "POST",
			url : url,
			data : data,
			async : true,
			success : function(data) {
				var errmessage="";
				var result="";
				if(typeof(data.success)!="undefined"){
					result=data.success.toString();
					errmessage=data.errorMessage;
				}else
					result=data.toString();
				
				layer.closeAll('loading'); // 关闭加载层
				if(!(isNotClose || false)){
					if(result!="0" && result!=""){
						openAlertCloseAll(1, "提示", msg + "成功！");
					}else{
						openAlert(2, "提示", msg + "失败！"+errmessage);
						return false;
					}
				}else{
					if(result!="0" && result!=""){
						openAlert(1, "提示", msg + "成功！");
					}else{
						openAlert(1, "提示", msg + "失败！"+errmessage);
						return false;
					}
				}
				try{
					var _id;
					if($("#" + id).length>0){
						var start = $("#" + id).dataTable().fnSettings()._iDisplayStart;
						var total = $("#" + id).dataTable().fnSettings()
								.fnRecordsDisplay();
						if ((total - start) == 1 && start > 0) {
							$("#" + id).dataTable().fnPageChange('previous', true);
						} else {
							$("#" + id).dataTable().fnDraw(false);
						}
						if(id=="example1"&&$("#example2").length>0){
							$("#example2").dataTable().fnDraw(false);
						}
						if(id=="example2"&&$("#example1").length>0){
							$("#example1").dataTable().fnDraw(false);
						}
					}else{
						parent.parentLoad();
					}
				}catch(e){}
					
			}
		});
}

// 询问弹框
function openConfirm(code, title, content, callback) {
	layer.confirm(content, {
		icon : code,
		scrollbar : false,
		btn : [ '确定', '取消' ]
	// 按钮
	}, function(index, layero) {
		if (callback)
			callback(index);// 回调
	}, function(index, layero) {
		layer.close(index);
	});
}


function validat(id){
	$("#"+id).parent().parent().removeClass("am-form-success");
	$("#"+id).parent().parent().addClass("am-form-error");
}

// 提醒弹框
function openAlert(code, title, content, callback) {
	layer.open({
		icon : code,// 图标码
		title : title,// 主题
		content : content,// 内容
		scrollbar : false,
		yes : function(index, layero) {// 点击确定后的操作
			layer.close(index); // 如果设定了yes回调，需进行手工关闭
			if (callback)
				callback(index);// 回调
		}
	});
}


// 提醒弹框
function openAlertMsg(content) {
	layer.msg(content);
}
//正上方
function openAlertTopMsg(content) {
	layer.msg(content, {
	  offset: 't',
	  anim: 1
	});
}

// 提醒弹框
function openAlertCloseAll(code, title, content, callback) {
	layer.open({
		icon : code,// 图标码
		title : title,// 主题
		content : content,// 内容
		scrollbar : false,
		yes : function(index, layero) {// 点击确定后的操作
			layer.closeAll(); // 如果设定了yes回调，需进行手工关闭
			if (callback)
				callback(index);// 回调
		}
	});
}


//全屏弹框
var flag=false;
function openAlertFullScreen(title,content, callback,type,cancelback) {
	layer.open({
		type:null==type?1:type,
		zIndex:1000,
		title : title,// 主题
		content : content,// 内容
		scrollbar : true,
		maxmin: true, //开启最大化最小化按钮
		area : [ '100%', '100%' ], // 宽高
		yes : function(index, layero) {// 点击确定后的操作
			layer.closeAll(); // 如果设定了yes回调，需进行手工关闭
			if (callback)
				callback(index);// 回调
		},cancel : function(index, layero) {// 点击确定后的操作
			layer.closeAll(); // 如果设定了yes回调，需进行手工关闭
			if(cancelback){
				eval(cancelback);
			}
		},success:function(layero,index){
			try{
				if(CKEDITOR){
					if(flag){
						//销毁编辑器实例  
						CKEDITOR.remove(CKEDITOR.instances['proDescription']);
						$("#cke_proDescription").remove();
					}
					CKEDITOR.replace('proDescription',{uiColor : '#9AB8F3'});
					flag=true;
				}
				
			}catch(e){
			}
			layer.full(index);
		}
	});
}

// 自定义弹出框
function openCustom(title, width, height,content,callback,cancelback,successCallback) {
	var winheight=$(window).height()-80;
	if(height>winheight)
		height=winheight;
	var index = layer.open({
		btn : [ '提交', '取消' ],
		title : title,
		type :1,
		scrollbar : false,
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px' , height + 'px'], // 宽高
		content : content,
		yes : function(index, layero) { // 或者使用btn1
			if(callback)
				eval(callback);
		},
		cancel : function(index,layero) { // 或者使用btn2
			if(cancelback){
				eval(cancelback);
			}
			layer.close(index);
		},success:function(layero,index){
			if(successCallback)
				successCallback(index);
		}
	});
	
	return index;
}

//自定义弹出框 自定义z-index
function openCustomWithZIndex(z_index,title, width, height,content,callback,cancelback,successCallback) {
	var winheight=$(window).height()-80;
	if(height>winheight)
		height=winheight;
	var index = layer.open({
		btn : [ '提交', '取消' ],
		title : title,
		type :1,
		zIndex:z_index,
		scrollbar : false,
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px', height + 'px' ], // 宽高
		content : content,
		yes : function(index, layero) { // 或者使用btn1
			if(callback)
				eval(callback);
		},
		cancel : function(index,layero) { // 或者使用btn2
			if(cancelback){
				eval(cancelback);
			}
			layer.close(index);
		},success:function(layero,index){
			if(successCallback)
				successCallback(index);
		}
	});
	
	return index;
}

//自定义弹出框
function openBtnCustom(btn1,btn2,title, width, height,content,callback,cancelback,successCallback) {
	layer.open({
		btn : [ btn1, btn2 ],
		title : title,
		type :1,
		scrollbar : false,
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px', height + 'px' ], // 宽高
		content : content,
		yes : function(index, layero) { // 或者使用btn1
			if(callback)
				eval(callback);
			layer.close(index);
		},
		cancel : function(index,layero) { // 或者使用btn2
			if(cancelback){
				eval(cancelback);
			}
			layer.close(index);
		},success:function(layero,index){
			if(successCallback)
				successCallback(index);
		}
	});
}

//没有叉的自定义弹框
function openCustomNoClose(title, width, height,content,callback) {
	layer.open({
		btn : [ '提交'],
		title : title,
		type :1,
		closeBtn: 0	,//没有叉
		scrollbar : false,
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px', height + 'px' ], // 宽高
		content : content,
		yes : function(index, layero) { // 或者使用btn1
			if(callback)
				eval(callback);
		}
	});
}

//提醒弹框
function openAlertByTop(code, title, content, callback) {
	layer.open({
		icon : code,// 图标码
		title : title,// 主题
		offset:[($(document).height()-100-$(document).scrollTop())/2+'px'],
		content : content,// 内容
		scrollbar : false,
		yes : function(index, layero) {// 点击确定后的操作
			layer.close(index); // 如果设定了yes回调，需进行手工关闭
			if (callback)
				callback(index);// 回调
		}
	});
}

//自定义弹出框
function openCustomTop(title, width, height,content,callback,cancelback,successCallback) {
	layer.open({
		btn : [ '提交', '取消' ],
		title : title,
		type :1,
		scrollbar : false,
		offset:[($(document).height()-height-$(document).scrollTop())/2+'px'],
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px', height + 'px' ], // 宽高
		content : content,
		yes : function(index, layero) { // 或者使用btn1
			if(callback)
				eval(callback);
		},
		cancel : function(index,layero) { // 或者使用btn2
			if(cancelback){
				eval(cancelback);
			}
			layer.close(index);
		},success:function(layero,index){
			if(successCallback)
				successCallback(index);
		}
	});
}

//自定义弹出框,没有按钮
function openCustomPanel(title, width, height,content) {
	layer.open({
		btn : [],
		title : title,
		type :1,
		scrollbar : false,
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px', height + 'px' ], // 宽高
		content : content
	});
}
// 自定义弹出框
function openCustom1(title, width, height,content,callback,cancelback,successCallback) {
	layer.open({
		btn : [],
		title : title,
		type :1,
		scrollbar : false,
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px', height + 'px' ], // 宽高
		content : content,
		yes : function(index, layero) { // 或者使用btn1
			if(callback)
				eval(callback);
		},
		cancel : function(index,layero) { // 或者使用btn2
			if(cancelback){
				eval(cancelback);
			}
			layer.close(index);
		},success:function(layero,index){
			if(successCallback)
				successCallback(index);
		}
	});
}

//自定义弹出框 只有取消按钮
function openCustomClose(title, width, height,content,callback,successCallback) {
	var div=layer.open({
		btn : [ '关闭' ],
		title : title,
		type :1,
		scrollbar : false,
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px', height + 'px' ], // 宽高
		content : content,
		yes : function(index, layero) { // 或者使用btn1
			if(callback)
				eval(callback);
			layer.close(index);
		},success:function(layero,index){
			if(successCallback)
				successCallback(index);
		}
	});
	return div;
}

//自定义弹出框 没有按钮
function openCustomCloseNoAnt(title, width, height,content) {
	layer.open({
		title : title,
		type :1,
		scrollbar : false,
		// skin : 'layui-layer-rim', // 加上边框
		area : [ width + 'px', height + 'px' ], // 宽高
		content : content
	});
}

// 时间戳转日期
function getLocalTime(nS) {   
	  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
} 
// 时间戳转日期
function   formatDate(nS)   {    
	 var now=new  Date(parseInt(nS) * 1000);
    var   year=now.getFullYear();     
    var   month=now.getMonth()+1;     
    var   date=now.getDate();     
    var   hour=now.getHours();     
    var   minute=now.getMinutes();     
    var   second=now.getSeconds();     
    return   year+"-"+isDouble(month)+"-"+isDouble(date)+"   "+isDouble(hour)+":"+isDouble(minute)+":"+isDouble(second);     
}   
//时间戳转日期
function   formatDateByYYYYMMDH(nS)   {    
	 var now=new  Date(parseInt(nS) * 1000);
    var   year=now.getFullYear();     
    var   month=now.getMonth()+1;     
    var   date=now.getDate();     
    var   hour=now.getHours();     
    var   minute=now.getMinutes();     
    var   second=now.getSeconds();     
    return   year+"-"+isDouble(month)+"-"+isDouble(date);     
}    
//时间戳转日期
function   formatDateByYYYYMMD(nS)   {    
	 var now=new  Date(parseInt(nS) * 1000);
    var   year=now.getFullYear();     
    var   month=now.getMonth()+1;     
    var   date=now.getDate();     
    var   hour=now.getHours();     
    var   minute=now.getMinutes();     
    var   second=now.getSeconds();     
    return   year+"/"+isDouble(month)+"/"+isDouble(date);     
}     

//获取当前时间
function   getDateByYYYYMMD()   {    
	 var now=new  Date();
    var   year=now.getFullYear();     
    var   month=now.getMonth()+1;     
    var   date=now.getDate();     
    return   year+"-"+isDouble(month)+"-"+isDouble(date);     
}  

function isDouble(str){
	if(str<10){
		return "0"+str;
	}
	else{
		return str;
	}
}

function dateToTimestamp(str,flag){
	if(null==str||""==str){
		return null;
	}
	var timestamp=null;
	try{
		if(flag){
			str=str.trim()+" 23:59:59";
		}
		timestamp = Date.parse(new Date(str.trim()));
		timestamp = timestamp / 1000;
	}catch (e) {
		return null;
	}
	return timestamp;
}


//上传图片
function uploadImage(fileId,src,param,callback){
	var index=layer.msg('上传中', {icon: 16, time:20*20000,shade :0.3});
	var fileObj = document.getElementById(fileId).files; // 获取文件对象
	 if(null==fileObj){
		 layer.close(index);
		 layer.alert('请选择文件'); 
		 return false;
	 }
	 var filepath=$("#"+fileId).val();
	  var extStart=filepath.lastIndexOf(".");
	  var ext=filepath.substring(extStart,filepath.length).toUpperCase();
	  if(ext!=".JPEG"&&ext!=".JPG"&&ext!=".GIF"&&ext!=".AI"&&ext!=".PDG"&&ext!=".PNG"){
		  layer.close(index);
		  layer.alert("请选择正确的图片格式!");
		  return false;
	  }
    var FileController = src;                    // 接收上传文件的后台地址 
    // FormData 对象
    var form = new FormData();
    if(null!=param){
	    var jsonObj = param;//eval('(' + param + ')');
	 // 传回ID报错
	    for(var item in jsonObj){  
	        form.append(item,jsonObj[item]); 
	    }  
    }
    for(var i=0;i<fileObj.length;i++){
		 form.append("multipartFile", fileObj[i]);                           // 文件对象
	 }
    // 文件对象
    // XMLHttpRequest 对象
    var xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);
    xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4) {
	        if (xhr.status === 200) {
	        } else {
	        	layer.alert('上传失败!');
	        }
	    }
	}; 
	 xhr.onload = function (data) {
		var responseUrl = this.responseText;
		var json = eval('(' + responseUrl + ')'); 
    	if(null==this.responseText){
    		layer.alert('上传失败!'); 
    	}else{
    		layer.alert('上传成功!'); 
    		if(callback){
    			callback(json);
    		}
    	}
    	
    };
    xhr.send(form);  
}


//上传文件
function uploadExcel(fileId,src,param,callback){
	var index=layer.msg('上传中', {icon: 16, time:20*20000,shade :0.3});
	var fileObj = document.getElementById(fileId).files; // 获取文件对象
	 if(null==fileObj){
		 layer.close(index);
		 layer.alert('请选择文件'); 
		 return false;
	 }
	  var filepath=$("#"+fileId).val();
	  var extStart=filepath.lastIndexOf(".");
	  var ext=filepath.substring(extStart,filepath.length).toUpperCase();
	  if(ext!=".XLSX"&&ext!=".XLS"){
		  layer.close(index);
		  layer.alert("请选择正确的Excel文件格式!");
		  return false;
	  }
    var FileController = src;                    // 接收上传文件的后台地址 
    // FormData 对象
    var form = new FormData();
    if(null!=param){
	    var jsonObj = param;//eval('(' + param + ')');
	 // 传回ID报错
	    for(var item in jsonObj){  
	        form.append(item,jsonObj[item]); 
	    }  
    }
    for(var i=0;i<fileObj.length;i++){
		 form.append("multipartFile", fileObj[i]);                           // 文件对象
	 }
    // 文件对象
    // XMLHttpRequest 对象
    var xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);
    xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4) {
	        if (xhr.status === 200) {
	        } else {
	        	layer.alert('导入失败!');
	        }
	    }
	}; 
	 xhr.onload = function (data) {
		var responseUrl = this.responseText;
		var json = eval('(' + responseUrl + ')'); 
    	if(this.responseText == 0){
    		layer.alert('Excel格式不正确!'); 
    	}else{
    		layer.alert('导入成功!'); 
    		if(callback){
    			callback(json);
    		}
    	}
    	
    };
    xhr.send(form);  
}


//渠道上传文件
function channelUploadImage(fileId,src,param,callback){
	var index=layer.msg('上传中', {icon: 16, time:20*20000,shade :0.3});
	var fileObj = document.getElementById(fileId).files; // 获取文件对象
	 if(null==fileObj){
		 layer.close(index);
		 layer.alert('请选择文件'); 
		 return false;
	 }
	 var filepath=$("#"+fileId).val();
	  var extStart=filepath.lastIndexOf(".");
	  var ext=filepath.substring(extStart,filepath.length).toUpperCase();
	  /*if(ext!=".JPEG"&&ext!=".JPG"&&ext!=".GIF"&&ext!=".AI"&&ext!=".PDG"&&ext!=".PNG"){
		  layer.close(index);
		  layer.alert("请选择正确的图片格式!");
		  return false;
	  }*/
  var FileController = src;                    // 接收上传文件的后台地址 
  // FormData 对象
  var form = new FormData();
  if(null!=param){
	    var jsonObj = param;//eval('(' + param + ')');
	 // 传回ID报错
	    for(var item in jsonObj){  
	        form.append(item,jsonObj[item]); 
	    }  
  }
  for(var i=0;i<fileObj.length;i++){
		 form.append("multipartFile", fileObj[i]);                           // 文件对象
	 }
  // 文件对象
  // XMLHttpRequest 对象
  var xhr = new XMLHttpRequest();
  xhr.open("post", FileController, true);
  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4) {
	        if (xhr.status === 200) {
	        } else {
	        	layer.alert('上传失败!');
	        }
	    }
	}; 
	 xhr.onload = function (data) {
		var responseUrl = this.responseText;
		var json = eval('(' + responseUrl + ')'); 
  	if(null==this.responseText){
  		layer.alert('上传失败!'); 
  	}else{
  		layer.alert('上传成功!'); 
  		if(callback){
  			callback(json);
  		}
  	}
  	
  };
  xhr.send(form);  
}


// 初始化表格
function initializeTable(id, aoColumns, fnRowCallback, sAjaxSource,
		fnServerParams,fnInitComplete,fnDrawCallback,row,bInfo) {
	//console.log(3)
	var DefaltaoColumns = [ {// 此列必须有 且隐藏 否则打乱排序
		"sClass" : "am-hide-sm-only",
		"sDefaultContent" : "",// 此列默认值为""，以防数据中没有此值，DataTables加载数据的时候报错
		"bSortable" : false,
		"visible" : false
	} ];
	// 合并数组
	aoColumns = DefaltaoColumns.concat(aoColumns);
	//默认不能排序
	$.each(aoColumns,function(idx,item){
		if(typeof(item.bSortable)=="undefined"){
			item.bSortable=false;
		}
	});
	var tb = $('#' + id).DataTable({
		"responsive" : true,
		"searching" : false,// 取消显示搜索\
		//"bSort" : false,
		"iDisplayLength":(null==row?10:row),
		"bInfo":(null==bInfo?true:bInfo),
		// "bProcessing" : true,//
		// 以指定当正在处理数据的时候，是否显示“正在处理”这个提示信息
		"bLengthChange" : true,// 是否显示一个每页长度的选择条（需要分页器支持）
		"aLengthMenu":[10,30,50,100,200],
		"bServerSide" : true, // 是否启动服务器端数据导入
		// "bAutoWidth" : true, // 是否自适应宽度
		"columnDefs" : [ {
			type : 'chinese-string',
			targets : '_all'
		} ],
		"aoColumns" : aoColumns,
		"fnRowCallback" : fnRowCallback,
		"sAjaxSource" : sAjaxSource,// 指定要从哪个URL获取数据
		"fnServerParams" : fnServerParams,
		"fnInitComplete":fnInitComplete,
		"fnDrawCallback":function(table) {    
			if(fnDrawCallback)
				fnDrawCallback();
			else{
				 $("#"+id+"_previous").before("<li id='"+id+"PageChange'>跳到第 <input type='text' id='"+id+"changePage' class='input-text' style='width:30px;height:26px;border:1px solid #DDDDDD;color:black;'> 页  <a style='border:none;display:inline-table' href='javascript:void(0);' id='"+id+"dataTable-btn' >跳转</a></li>");
				 
			     var oTable = $("#"+id).dataTable();    
			     $('#'+id+'dataTable-btn').click(function(e) { 
			    	  $("#"+id+"PageChange").hide();
			          if($("#"+id+"changePage").val() && $("#"+id+"changePage").val() > 0) {    
			              var redirectpage = $("#"+id+"changePage").val() - 1;    
			          } else {    
			              var redirectpage = 0;    
			          }    
			          oTable.fnPageChange(redirectpage);    
			     });   
			}
		  },  
		// 服务器端，数据回调处理
		"fnServerData" : function(sSource, aDataSet, fnCallback) {
			$.ajax({
				"dataType" : 'json',
				"type" : "POST",
				"url" : sSource,
				"data" : aDataSet,
				"success" : fnCallback
			});
		},
		"fnInfoCallback":function(settings, start, end, max, total, out){
			if(total>settings.oAjaxData.iDisplayLength){
				$("#"+settings.sTableId+"_wrapper").find(".am-datatable-footer").show();
				return out;
			}
			else{
				$("#"+settings.sTableId+"_wrapper").find(".am-datatable-footer").hide();
				return "";
				//am-datatable-footer
			}
		}
	});
	return tb;
}

/**
 * 验证价格 是否为两位小数的正整数
 * @returns {Boolean}
 */
function checkPrice(){
	var reg = new RegExp(/^(\-)?\d+(\.\d{1,2})?$/);
	var b=true;
	$(".price").each(function(dd,item){
		var test=$(this).parent().prev().text();
		if($(this).val()!=null && $(this).val()!="" && !reg.test($(this).val().trim())){
			openAlertMsg(test+"格式不正确");
			validat($(this).attr("id"));
			b=false;
		}
	})
	return b;
}

function closeAll(){
	layer.closeAll();
}

//提醒弹框
function openAlertMsgLoad(content) {
	layer.open({shadeClose: false,content: '<div class="shade_up"><div class="fl loader"><div class="loader-inner ball-clip-rotate"><div></div></div></div><span>'+(null==content||""==content?'上传中':content)+'...</span></div>',
		style:'background-color:rgba(0,0,0,0);box-shadow: 0 0 8px rgba(0, 0, 0, 0);',
		time: 5000});
}

//自定义提醒弹框
function myOpenAlert(content) {
	layer.open({shadeClose: false,content: '<div class="shade_up"><div class="fl loader"><div class="loader-inner ball-clip-rotate"><div></div></div></div><span>'+content+'</span></div>',
		style:'background-color:rgba(0,0,0,0);box-shadow: 0 0 8px rgba(0, 0, 0, 0);'
		});
}

/**
 * 乘法函数，用来得到精确的乘法结果
 * 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 * 调用：accMul(arg1,arg2)
 * @author: niewg
 * @return: arg1乘以arg2的精确结果
 */
function accMul(arg1,arg2)
{
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
 
  return _.round(Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m), 6);
}

/**
 * 加法函数，用来得到精确的加法结果
 * 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 * 调用：accAdd(arg1,arg2)
 * @author: niewg
 * @return: 返回值：arg1加上arg2的精确结果
 */
function accAdd(arg1,arg2){
var r1,r2,m;
try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
m=Math.pow(10,Math.max(r1,r2))

return _.round((arg1*m+arg2*m)/m, 6);
}

/**
 * 去掉字符串的两边空格
 * 参数：{name:str}
 * @author: niewg
 * @return: boolean
 */
function trim(str)
{
	return str.replace(/(^[\s]*)|([\s]*$)/g, "");
}
/**
 * 验证正数
 * 参数：{name:str}
 * @author: niewg
 * @return: boolean
 */
function validate(num)
{
	var reg = /^\d+(?=\.{0,1}\d+$|$)/
	if(reg.test(num)) return true;
	return false ;  
}
/**
 * 验证2位小数
 * 参数：{name:str}
 * @author: niewg
 * @return: boolean
 */
function validateTdecimal(num)
{
	var reg = /^(\-)?\d+(\.\d{1,2})?$/
	if(reg.test(num)) return true;
	return false ;  
}
/**
 * 验证4位小数
 * 参数：{name:str}
 * @author: niewg
 * @return: boolean
 */
function validateFdecimal(num)
{
	///^([1-9]\d{0,15}|0)(\.\d{1,4})?$/
	var reg = /^(\-)?\d+(\.\d{1,4})?$/
	if(reg.test(num)) return true;
	return false ;  
}

/**
 * 验证6位小数
 * 参数：{name:str}
 * @author: niewg
 * @return: boolean
 */
function validateSixcimal(num)
{
	var reg = /^(\-)?\d+(\.\d{1,6})?$/
	if(reg.test(num)) return true;
	return false ;  
}

/**
 * 深拷贝对象
 * 参数：obj
 * @author: niewg
 * @return: new obj
 */
function copy(a){
    var b={};
    for(var attr in a){
        b[attr]=a[attr]
    }    
   return b  
}


//获取当前时间
function   getTodayByYYYYMMD()   {    
	 var now=new  Date();
    var   year=now.getFullYear();     
    var   month=now.getMonth()+1;     
    var   date=now.getDate();     
    return   year+"-"+isDouble(month)+"-"+isDouble(date);     
}

//获取昨天时间
function   getYesterdayByYYYYMMD()   {    
	 var now=new  Date();
	 now.setDate(now.getDate()-1);
    var   year=now.getFullYear();     
    var   month=now.getMonth()+1;     
    var   date=now.getDate();     
    return   year+"-"+isDouble(month)+"-"+isDouble(date);     
} 

function printerUtil(recordId){
	try{
		if (!LODOP && document.readyState !== "complete") {
			openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			});
			return;
		}
	}catch(e){
		alert(e);
		openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
		});
		return;
	}
	if (recordId==null||recordId=="") {
		openAlertMsg("请选择要打印的处方!");
		return;
	}
	toAjaxCRUDCallBack("diagnose/queryPrinterInfo",{"recordId":recordId},function(data){
		if(data.success==0){
			openAlertMsg("系统繁忙，稍后再试!");
		}else if(data.success==-1){
			openAlertMsg("未获取到调理单信息！");
		}else{
			var conList = data.conList;
			var realName=data.name;//患者姓名
			var age=data.age;//患者年龄
			var sex=data.sex;//患者性别
			var diaList= data.diaList;//辨证
			var symptomDetails=data.symptomDetails;
			var cusetomerName=data.customerName;
			var cusetomerPhone=data.customerPhone;
			var cusetomerAddr=data.customerAddress;
			var recipeDoc=data.recipeDoc;
			var advise=data.advise;
			$.ajax({
			type : "get",
			url : "html/print_recipe.html?v="+Date.now(),//
			dataType : "html",
			success : function(_html) {
				var xx = $(_html);
				$.each(conList,function(index,item){
					var con=item;
					xx.find(".realname").html(realName);
					xx.find(".age").html(age);
					xx.find(".sex").html(sex==0 ? "女":"男");
					xx.find(".diaList").html(diaList);
					xx.find(".symptomDetails").html(symptomDetails);
					xx.find(".outOrIn").html((item.outOrIn==0 ? "口服" : "外用"));
					xx.find(".drugType").html(item.drugTypeName);
					xx.find(".createTime").html(formatDateByYYYYMMD(item.createTime)); 
					xx.find(".useCount").html("共"+item.dose+"付，"+item.useCount+"付/日");
					/*xx.find(".useCount").html("一日"+item.useCount+"次");
					xx.find(".dose").html(item.dose+"付");*/
					xx.find(".cusetomerName").html(cusetomerName);
					xx.find(".cusetomerPhone").html(cusetomerPhone);
					xx.find(".cusetomerAddr").html(cusetomerAddr);
					xx.find(".advise").html(advise); //医嘱
					var content="<tr>";
					var temp="<td><div style='border-right: 1px dashed black;width: 177px;margin-right: 15px;padding-top: 7px;display:-moz-inline-box;display:inline-block;height: 19px;'><span></span><span style='float:right;margin-right:25px'></span></div></td>";
					$.each(con.drugList,function(index,item){
						if ((index+1)%3!=0) {
							content+="<td><div style='border-right: 1px dashed black;width: 177px;margin-right: 15px;padding-top: 7px'><span>"+item.drugName+"</span><span style='float:right;margin-right:25px'>"+item.drugDose+" ("+item.util+")</span></div></td>";
							if ((index+1)==con.drugList.length) {
								if ((index+1)%3==1) {
									content+=temp;
								}
								content+="</tr>";
							}
						}else {
							content+="<td><div style='width: 177px;padding-top: 7px'><span>"+item.drugName+"</span><span style='float:right;margin-right:20px'>"+item.drugDose+" ("+item.util+")</span></div></td>";
							content+="</tr>";
						}
						
					});
					xx.find(".recipe").html("<table>"+content+"</table>");
					xx.find(".recipeDoc").html(recipeDoc);//调理医师
					LODOP.NewPage();
	
					LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);
	
					LODOP.SET_PRINT_MODE("FULL_HEIGHT_FOR_OVERFLOW",true); 
					LODOP.SET_PRINT_MODE("Full-Page",true);
					
					LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);
					LODOP.SET_SHOW_MODE("BKIMG_IN_FIRSTPAGE",0);
					
					LODOP.ADD_PRINT_HTM(30,50, "90%", "100%", xx.html());
				});
				LODOP.PREVIEW();
			}
		})
	}})
}

function PRISMPTNIsOn(){
	try{
		if(typeof(PRISMPTN)=="undefined"||PRISMPTN==null||PRISMPTN==""){
			/*openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
				openAlert("1","提示","下载压缩包后解压，运行解压后得到的文件夹内  \"PrinterServer.exe\" 程序,并刷新页面即可!");
			});*/
			return false;
		}
		return true;
	}catch(e){
		/*openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			openAlert("1","提示","下载压缩包后解压，运行解压后得到的文件夹内  \"PrinterServer.exe\" 程序,并刷新页面即可!");
		});*/
		return false;
	}
};
		
//单页打印
function printerHtml(html,printName){
	try{
		if(typeof(PRISMPTN)=="undefined"||PRISMPTN==null||PRISMPTN==""){
			openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
				openAlert("1","提示","下载压缩包后解压，运行解压后得到的文件夹内  \"PrinterServer.exe\" 程序,并刷新页面即可!");
			});
		}
	}catch(e){
		openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			openAlert("1","提示","下载压缩包后解压，运行解压后得到的文件夹内  \"PrinterServer.exe\" 程序,并刷新页面即可!");
		});
		return;
	}
	//打印相关
	PRISMPTN.SET_PRINTER(printName) 
	if(html==null||html==""){
		PRISMPTN.ADD_PRINT_HTML("无数据！")
	}else{
		PRISMPTN.ADD_PRINT_HTML(html)
	}
	PRISMPTN.PRINT();
	
}	

//获取打印设备名称和序号
function getPrintName(){
	try{
		if(typeof(PRISMPTN)=="undefined"||PRISMPTN==null||PRISMPTN==""){
			openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
				openAlert("1","提示","下载压缩包后解压，运行解压后得到的文件夹内  \"PrinterServer.exe\" 程序即可!");
			});
		}
	}catch(e){
		openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			openAlert("1","提示","下载压缩包后解压，运行解压后得到的文件夹内  \"PrinterServer.exe\" 程序即可!");
		});
		return;
	}
	
	return PRISMPTN.Printers;
}

//获得纸张清单
function getPrintPapers(){
	var printPapersStr=LODOP.GET_PAGESIZES_LIST(1,",");
	return printPapersStr.split(",");
}

//多页打印
function printerMultipleHtml(data){
	//打印前条件准备
	try{
		if (!LODOP && document.readyState !== "complete") {
			openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
				openAlert("1","提示","下载压缩包后解压，运行解压后得到的文件夹内  \"PrinterServer.exe\" 程序即可!");
			});
			return;
		}
	}catch(e){
		openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			openAlert("1","提示","下载压缩包后解压，运行解压后得到的文件夹内  \"PrinterServer.exe\" 程序即可!");
		});
		return;
	}
	
	//打印相关
	LODOP.NewPage();

	LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);
	LODOP.SET_PRINT_MODE("FULL_HEIGHT_FOR_OVERFLOW",true); 
	LODOP.SET_PRINT_MODE("Full-Page",true);
	
	LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);
	LODOP.SET_SHOW_MODE("BKIMG_IN_FIRSTPAGE",0);
	
	//循环打印调理方
	for(var i=0;i<data.length;i++){
		if(i==0)
			LODOP.ADD_PRINT_HTM(30,50, "90%", "100%", data[i]);
		else{
			LODOP.NewPage();
			LODOP.ADD_PRINT_HTM(30,50, "90%", "100%", data[i]);
		}
		
	}
	
	//预览toAjaxDetail
	LODOP.PREVIEW();
}

//跳过预览直接打印
function printerWhithOutPREVIEW(data,printName){
	//打印前条件准备
	try{
		if(typeof(PRISMPTN)=="undefined"||PRISMPTN==null||PRISMPTN==""){
			openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			});
		}
	}catch(e){
		openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
		});
		return;
	}
	
	//打印相关
	var defaultName=PRISMPTN.defaultPrinter;
	if(defaultName!=printName)
		PRISMPTN.SET_PRINTER(printName); 
	if(data==null||data==""){
		PRISMPTN.ADD_PRINT_HTML("无数据！")
	}else{
		//循环打印调理方
		for(var i=0;i<data.length;i++){
			PRISMPTN.ADD_PRINT_HTML(data[i])
		}
	}
	PRISMPTN.PRINT();
}

//跳过预览直接打印 2.5边距
function printerWhithOutPREVIEWV2(data,printName){
	//打印前条件准备
	try{
		if(typeof(PRISMPTN)=="undefined"||PRISMPTN==null||PRISMPTN==""){
			openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			});
		}
	}catch(e){
		openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
		});
		return;
	}
	
	//打印相关
	var defaultName=PRISMPTN.defaultPrinter;
	if(defaultName!=printName)
		PRISMPTN.SET_PRINTER(printName);
	if(data==null||data==""){
		PRISMPTN.ADD_PRINT_HTML("无数据！")
	}else{
		//循环打印调理方
		for(var i=0;i<data.length;i++){
			PRISMPTN.ADD_PRINT_HTML(data[i])
		}
	}
	PRISMPTN.PRINTV2();
}

//跳过预览直接打印(0边距)
function printerListWithOutMargin(data,printName){
	//打印前条件准备
	try{
		if(typeof(PRISMPTN)=="undefined"||PRISMPTN==null||PRISMPTN==""){
			openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			});
		}
	}catch(e){
		openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
		});
		return;
	}
	
	//打印相关
	var defaultName=PRISMPTN.defaultPrinter;
	if(defaultName!=printName)
		PRISMPTN.SET_PRINTER(printName);
	if(data==null||data==""){
		PRISMPTN.ADD_PRINT_HTML("无数据！")
	}else{
		//循环打印调理方
		for(var i=0;i<data.length;i++){
			PRISMPTN.ADD_PRINT_HTML(data[i])
		}
	}
	PRISMPTN.PRINTTICKET();
}

//跳过预览直接打印(0边距)
function printerWithOutMargin(data,printName){
	//打印前条件准备
	try{
		if(typeof(PRISMPTN)=="undefined"||PRISMPTN==null||PRISMPTN==""){
			openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
				window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
			});
		}
	}catch(e){
		openAlertByTop("1", "下载提示", "您本机未安装打印工具，点击确定下载安装", function() {
			window.location.href=getContextPath()+"uploadFiles/PrinterServer.zip";
		});
		return;
	}
	
	//打印相关
	PRISMPTN.SET_PRINTER(printName) 
	if(data==null||data==""){
		PRISMPTN.ADD_PRINT_HTML("无数据！")
	}else{
		//循环打印调理方
		PRISMPTN.ADD_PRINT_HTML(data)
	}
	PRISMPTN.PRINTTICKET();
}


//是否为空或者Undefined或者空字符串, 是返回 true，不是返回false
function isNullOrUndefined(obj){
	if(obj==null||(obj+"").trim()==""||typeof(obj)=="undefined")
		return true;
	return false;
}
$(function(){
	var bodyHeight=$(".admin-main").height()+"px";
	$("#leftmenuDiv").css("height",bodyHeight);
	$("#leftmenuDiv").css("overflow","auto");
})
window.onresize = function(){
	var bodyHeight=$(".admin-main").height()+"px";
	$("#leftmenuDiv").css("height",bodyHeight);
	$("#leftmenuDiv").css("overflow","auto");
};



$(document).keyup(function(event) {
    if (event.keyCode==27) {
    	if(layer)
    		layer.closeAll();
    }
});

function openAlertBigScreen(title,width,height,content, callback, type, cancelback) {
	var alertDiv=layer.open({
		type : null == type ? 1 : type,
		zIndex : 1000,
		title : title,// 主题
		content : content,// 内容
		scrollbar : true,
		maxmin : true, // 开启最大化最小化按钮
		area : [ width, height ], // 宽高
		yes : function(index, layero) {// 点击确定后的操作
			layer.closeAll(); // 如果设定了yes回调，需进行手工关闭
			if (callback)
				callback(index);// 回调
		},
		cancel : function(index, layero) {// 点击确定后的操作
			layer.closeAll(); // 如果设定了yes回调，需进行手工关闭
			if (cancelback) {
				eval(cancelback);
			}
		},
		success : function(layero, index) {
			try {
				if (CKEDITOR) {
					if (flag) {
						// 销毁编辑器实例
						CKEDITOR.remove(CKEDITOR.instances['proDescription']);
						$("#cke_proDescription").remove();
					}
					CKEDITOR.replace('proDescription', {
						uiColor : '#9AB8F3'
					});
					flag = true;
				}

			} catch (e) {
			}
		}
	});
	return alertDiv;
}

/**
 * 组织机构数
 */

function init() {
	var setting = {
		view: {
			showIcon: true
		},
		data: {
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "parentId",
				rootPId: 1
			}
		},
		async : {
			enable : true,
			url : "/depart/getNodes",
			autoParam : [ "id", "name=n", "level=lv" ],
			otherParam : {
				"otherParam" : "zTreeAsync"
			},
			dataFilter : filter
		},
		callback: {
			beforeAsync:true,
			onClick: zTreeOnClick,
			onAsyncSuccess: zTreeOnAsyncSuccess,
			beforeExpand:true,
			beforeCollapse:true
		}
	};

	$.post("/area/getRootOrg",function (res) {
		if (res.success){
			var zNodes = [];
			res.data.isParent = true;
			zNodes.push(res.data);
			$.fn.zTree.init($("#deptTree"), setting, zNodes);

			var treeObj = $.fn.zTree.getZTreeObj("deptTree");
			var nodes = treeObj.getNodes();
			if (nodes.length > 0) {
				treeObj.selectNode(nodes[0]);
				treeObj.expandNode(nodes[0], true, true, true);
				zTreeOnClick(null,nodes[0].id,nodes[0]);
			}
		}
	});

}

function filter(treeId, parentNode, childNodes) {
	childNodes = childNodes.data;
	if (!childNodes)
		return null;
	for (var i = 0, l = childNodes.length; i < l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}

/**
 * 获得所有的医院
 * @param hospId 医院id
 * @param id
 */
function getAllHospital(hospId,id){
	$.post("/hospital/allHospital","",function (data) {
		if(data.success == 1){
			var hospital = data.data;
			$("#"+id).html("<option value= -1 >请选择医院</option>");
			$.each(hospital,function (index,value) {
				if(value.id == hospId){
					$("#"+id).append("<option value="+value.id+" selected>"+value.conName+"</option>");
				}else {
					$("#"+id).append("<option value="+value.id+">"+value.conName+"</option>");
				}
			})
		}
	});
}

/**
 * 查看同步状态
 * @param url
 */
function checkSyncStatus(url){
	toAjaxCRUDCallBack(url, "", function(res) {
		var content = "";
		if (res.success == 1) {
			if(isNullOrUndefined(res.data)){
				content =  "暂无同步数据";
			}else{
				var latestEntity = res.data[0];
				var resultCode = latestEntity.code == 0 ? '失败' : '成功';
				if(latestEntity.isComplete == 0){
					content += "<p>本次同步时间："+formatDate(latestEntity.createTime/1000)+"</p>" +
						"<p>新增数量："+latestEntity.addNum+"</p>" +
						"<p>修改数量："+latestEntity.modifyNum+"</p>" +
						"<p>删除数量："+latestEntity.deleteNum+"</p>"+
						"<p>结果："+resultCode+"</p><hr/>"+
						"<p>当前同步状态：正在同步中...</p>";
				}else{
					content = "<p>上次同步时间："+formatDate(latestEntity.createTime/1000)+"</p>" +
						"<p>新增数量："+latestEntity.addNum+"</p>" +
						"<p>修改数量："+latestEntity.modifyNum+"</p>" +
						"<p>删除数量："+latestEntity.deleteNum+"</p>" +
						"<p>结果："+resultCode+"</p><hr/>"+
						"<p>当前同步状态：无进行中的任务</p>";
				}
			}
		} else {
			content =  res.errorMessage;
		}
		layer.msg(content, {
			shade: 0.4,
			area: 'auto',
			maxHeight : 800,
			maxWidth: 1300,
			time:false,//取消自动关闭
			shadeClose : true,
			scrollbar: true,
			closeBtn :1
		});
	});
}

/*********************  typeahead 输入联想 ****************/
/**
 * 联想输入医院
 * @param id
 * @param url
 * @returns {string}
 */
function getHospital(id,url) {
	var hospitalId = '0';
	var patints = new Bloodhound({
		datumTokenizer: function (datum) {
			return Bloodhound.tokenizers.whitespace(datum.value);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: url,
			replace: function (url, query) {
				return url + query;
			},
			filter: function (patints) {
				//将远程json结果转成数组
				return $.map(patints.data, function (patint) {
					return {
						value: patint.erpcode+"\xa0\xa0\xa0"+patint.conName, //自动匹配出的多行数据
						data: patint
					};
				});
			}
		}
	});
	//初始化 Bloodhound engine
	patints.initialize();
	//初始化 Typeahead UI
	$("#"+id).typeahead(null, {
		//指定value作为显示值,在上面的filter中赋值
		displayKey: 'value',
		source: patints.ttAdapter(),
		limit: 30,
		highlight: true
	});
	$("#"+id).bind('typeahead:select', function (ev, suggestion) {
		var patint = suggestion.data;
		hospitalId = patint.id;
		var that = $(this);
		that.typeahead('val',patint.conName); //决定输入框中要显示的内容
	});
	return hospitalId;
};


//导入excel
function UploadFile(fileId,src,param,callback){
	
	var index=layer.msg('上传中', {icon: 16, time:20*20000,shade :0.3});
	var fileObj = document.getElementById(fileId).files; // 获取文件对象
	 if(null==fileObj){
		 layer.close(index);
		 layer.alert('请选择文件'); 
		 return false;
	 }
	 
	 var filepath=$("#"+fileId).val();
	 var extStart=filepath.lastIndexOf(".");
	 //后缀名
	 var mime = filepath.toLowerCase().substr(extStart);
	 if(mime != '.xls'&&mime != '.xlsx'){
		layer.alert('只能上传excel文件，后缀名为xls或者xlsx');
		return false;
	 }
	 
	 /* var ext=filepath.substring(extStart,filepath.length).toUpperCase();
	  if(ext!=".JPEG"&&ext!=".JPG"&&ext!=".GIF"&&ext!=".AI"&&ext!=".PDG"&&ext!=".PNG"){
		  layer.close(index);
		  layer.alert("请选择正确的图片格式!");
		  return false;
	  }*/
	 
	  var FileController = src;                    // 接收上传文件的后台地址 
	  // FormData 对象
	  var form = new FormData();
	  if(null!=param){
		    var jsonObj = param;//eval('(' + param + ')');
		    // 传回ID报错
		    for(var item in jsonObj){  
		        form.append(item,jsonObj[item]); 
		    }  
	  }
	  
	  for(var i=0;i<fileObj.length;i++){
		 form.append("multipartFile", fileObj[i]);                           // 文件对象
	  }
	  
	  // 文件对象
	  // XMLHttpRequest 对象
	  var xhr = new XMLHttpRequest();
	  xhr.open("post", FileController, true);
	  xhr.onreadystatechange = function () {
		    if (xhr.readyState === 4) {
		        if (xhr.status === 200) {
		        } else {
		        	layer.alert('上传失败!');
		        }
		    }
		}; 
	 xhr.onload = function (data) {
			var responseUrl = this.responseText;
			var json = eval('(' + responseUrl + ')'); 
	  	if(null==this.responseText){
	  		layer.alert('上传失败!'); 
	  	}else{
	  		if(callback){
	  			callback(json);
	  		}
	  	}
	  };
	  xhr.send(form);  
	  
}

/**
 * 设置侧边弹窗文字可复制
 */
function canSelectTextContent(){
	$(".select-text-style").css("user-select","");
}

