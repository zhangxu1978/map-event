$(function() {
	
	$("input").attr("autocomplete","off");//禁用页面联想
	
	$("body").on("click",".checkAll",function(){
		if(this.checked){
			$(this).parents("table").find("tbody input[type=checkbox]").prop("checked",true);
		}else{
			$(this).parents("table").find("tbody input[type=checkbox]").prop("checked",false);
		}
	});

	
	//解决vue无法绑定radio问题,修改选中值
	var $radios = $("input[model]"); 
	$radios.on('change',function() {
		var value = $radios.filter(':checked').val()*1;
		var name = $(this).attr("model");
		//给获取的属性赋值
		eval(name+"="+value);
	});
	
	if ($.AMUI && $.AMUI.validator) {
		//用法:在input上增加样式 js-pattern-mobile 或者 js-pattern-sfz
	    $.AMUI.validator.patterns.mobile = /^\s*1\d{10}\s*$/;
		$.AMUI.validator.patterns.sfz=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		$.AMUI.validator.patterns.float=/[1-9]\d*.\d*|0\.\d*[1-9]\d*/;
    }
});

//键盘点击事件监控
document.onkeydown = function (e) {
	var event=e||event;//获取event属性
    var code;  
    if (!e){ var e = window.event;}   
    if (e.keyCode){ code = e.keyCode;}
    else if (e.which){ code = e.which;}
    // BackSpace 8;
	// 禁用回退键
    if (
      (event.keyCode == 8)
      && ((event.srcElement.type != "text" && event.srcElement.type != "textarea" &&  event.srcElement.type != "password")
        ||  event.srcElement.readOnly == true
        )
     
     ) {
        
     event.keyCode = 0;        
     event.returnValue = false;    
    }
//    else if((event.keyCode == 13) && (event.srcElement.nodeName == "INPUT")){
//    	//表单输入，点击enter光标定位下一input
//    	var inputs = $("input");
//    	var length = $("input").length;
//    	for(var i = 0;i<inputs.length;i++){
//    		if(inputs[i] == event.target){
//				inputs[i].focus();
//    		}
//    	}
//    }
    
    return true;
   };
   
   
 //表单输入，点击回车键光标置于下一输入框
//	$(document).find("input").on("keyUp",function(e){
//		if(e.keyCode == 13){
//			
//		}
//	})
   
function fromValidator(id) {
	var $form = $('#' + id);
	var $tooltip = $('<div id="vld-tooltip">提示信息！</div>');
	$tooltip.appendTo(document.body);

	$form.validator();

	var validator = $form.data('amui.validator');

	$form.on('focusin focusout', '.am-form-error input', function(e) {
		if (e.type === 'focusin') {
			var $this = $(this);
			var offset = $this.offset();
			var msg = $this.data('foolishMsg')
					|| validator.getValidationMessage($this.data('validity'));

			$tooltip.text(msg).show().css({
				left : offset.left + 10,
				top : offset.top + $(this).outerHeight() + 10
			});
		} else {
			$tooltip.hide();
		}
	});
	$form.on('focusout', 'input', function(e) {
		$tooltip.hide();
	});
}

function validators(id) {
	var validator = $('#' + id).validator('isFormValid');
	if (!validator) {
		return false;
	}
	return true;
}


function beforeSend(){
	layer.load(2, {time: 100*1000}); // 又换了种风格，并且设定最长等待100秒
}
function complete(){
	layer.closeAll("loading"); // 又换了种风格，并且设定最长等待100秒
}

