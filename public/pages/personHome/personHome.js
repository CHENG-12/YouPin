//取值
var userName = Cookies.get("user");
var token = sessionStorage.getItem("token");
// 显示登录用户的姓名
(function(){
	if(token){
		 $(".top .name a").text(userName);
		 //登录之后底部购物车总数量的显示
		 (function() {
		 	function updateTotal(data){
		 		//有可能删除到0
		 		if(data === 0){
		 			$(".page-footer a span.count").removeClass("show");
		 			return;
		 		} else {
		 			$(".page-footer a span.count").addClass("show").text(data);
		 		}
		 	};
		 	$.myAjax({
		 		url:"/cart/total",
		 		success: data => {
		 			updateTotal(data);
		 		}
		 	});
		 	
		 })();
	}
	else {
		$(".top .name a").text("请登录");
		$(".top .name a").attr("href","/pages/login/login.html");
	}
	$(".log-back").toggleClass("show",$(".top .name a").text() != "请登录");
})();
//退出登录
(function() {
	$(".log-back").on("click", function() {
		sessionStorage.removeItem("token");
		Cookies.remove("user");
	});
})();
//只有登录之后才能进入订单确认页面,地址管理页面
(function() {
	$(".myorder").add($(".address")).on("click", function() {
		if(!token) $(this).find("a").attr("href","/pages/login/login.html");
		else $(this).find("a").attr("href",$(this).hasClass("myorder") ? "/pages/myorder/myorder.html":"/pages/address/address.html");

	});
})();