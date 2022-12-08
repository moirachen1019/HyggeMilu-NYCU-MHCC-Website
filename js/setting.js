
$(document).ready(function(){
	vue_init();
	pages = $(".page");
	total_page = pages.length;
	open_blocker();
	$("#next").click(function(){goto_page(now_page+1);});
	$("#prev").click(function(){goto_page(now_page-1);});
	$("#grade").hide();
	$("#start").hide();
	$(".goback").click(function(){goto_page(2);});
	$("#loading").show();
	window.onload = () => {database_init();} //window.onload():網頁在加載完畢後立即執行的動作
	$("#loading").hide();
	$("#start").show();
});
