(function($) {
  'use strict';

  $(function() {
    var $fullText = $('.admin-fullText');
    if(typeof($.AMUI.fullscreen.raw)=="undefined"){
    	 $('#admin-fullscreen').hide();
    }else{
	    $('#admin-fullscreen').on('click', function() {
	    	$.AMUI.fullscreen.toggle();
	    });
	
	    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
	    	 $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
	    });
    }
  });
})(jQuery);


$(function() {

	$('.switch-menu').on('click', function() {
        if ($('.left-sidebar').is('.active')) {
            if ($(window).width() > 1024) {
                $('.admin-content').removeClass('active');
            }
            $('.left-sidebar').removeClass('active');
        } else {

            $('.left-sidebar').addClass('active');
            if ($(window).width() > 1024) {
                $('.admin-content').addClass('active');
            }
        }
    })

    $('.left-sidebar').css("min-height",$(window).height()-60);
    $('.admin-content-body').css("min-height",$(window).height()-70);

    $(window).resize(function() {
        autoLeftNav();
        console.log($(window).width())
    });
	
	$('.left-sidebar').css("min-height",$(window).height()-60);
	$('.admin-content-body').css("min-height",$(window).height()-70);
})


// 风格切换
$('.tpl-skiner-toggle').on('click', function() {
    $('.tpl-skiner').toggleClass('active');
})

$('.tpl-skiner-content-bar').find('span').on('click', function() {
    $('body').attr('class', $(this).attr('data-color'))
    saveSelectColor.Color = $(this).attr('data-color');
    // 保存选择项
    storageSave(saveSelectColor);
    // 刷新
    refreshtheme();
})




// 侧边菜单开关

function autoLeftNav() {
    
    if ($(window).width() < 1024) {
        $('.left-sidebar').addClass('active');
        $('.admin-content').addClass('active');
    } else {
        $('.left-sidebar').removeClass('active');
        $('.admin-content').removeClass('active');
    }

    $('.left-sidebar').css("min-height",$(window).height()-60);
    $('.admin-content-body').css("min-height",$(window).height()-70);
    

    
    $('.left-sidebar').css("min-height",$(window).height()-60);
    $('.admin-content-body').css("min-height",$(window).height()-70);

}


// 侧边菜单
//$('.sidebar-nav-sub-title').on('click', function() {
//	var that=this;
//	var $sub=$(".sidebar-nav-sub");
//	for(i=0;i<$sub.length;i++){
//		var thedom=$sub[i];
//		var title=$(thedom).prev().text();
//		if(title!=$(that).text()){
//			if($(thedom).is(":visible")){
//				$(thedom).hide(80)
//				.prev().find('.sidebar-nav-sub-ico').toggleClass('sidebar-nav-sub-ico-rotate');
//			}
//		}
//	}
//	
//    $(this).siblings('.sidebar-nav-sub').slideToggle(80)
//        .end()
//        .find('.sidebar-nav-sub-ico').toggleClass('sidebar-nav-sub-ico-rotate');
//})

