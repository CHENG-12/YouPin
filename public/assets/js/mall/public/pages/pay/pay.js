//渲染总价钱
(function() {
	$(".pay-money .num span").add(".footer>span span").text(Cookies.get("price"));

})();

//将秒数转化为时分秒的函数
var timer = null;
function formatDate(value){
	var secondTime = parseInt(value);
	var minuteTime = 0;
	var hourTime = 0;
	if(secondTime > 60){
		minuteTime = parseInt(secondTime / 60);
		secondTime =parseInt(secondTime % 60);
		if(minuteTime > 60){
			hourTime = parseInt( minuteTime / 60);
			minuteTime = parseInt(minuteTime % 60);
		}
	}
	var result = "" + parseInt(secondTime) + "秒";
	if(minuteTime > 0){
	var result = "" + parseInt(minuteTime) + "分" + result;
	}
	if(hourTime >0 ){
		var result = ""+ parseInt(hourTime) + "小时" + result;
	}
	return result;
}
	
	
// 倒计时功能
(function() {
   var orderId = Cookies.get("orderId");
   var orderedDate = 0;
   function orderDate(data){
	   data.forEach(function(item,i) {
		  console.log(item);
		   if(item.orderId === orderId){
			   console.log(item);
			   orderedDate = new Date(item.orderTime).getTime();
			   console.log(orderedDate);
		   }
				
	   });
	}
	$.myAjax({
		async: false,
		url:"/order/list_unpay",
		success: data => {
		orderDate(data);
		}
	});
	var min = 1;
	var minsec = min * 60;
	timer = setInterval(function() {
		var timeBlank = minsec - (new Date().getTime() - orderedDate)/1000;
		console.log(timeBlank);
		if(timeBlank <= 0 || $(".pay-money").text() === "已支付成功") {
			clearInterval(timer);
			timer = null;
			if(timeBlank <= 0 || $(".pay-money").text() != "已支付成功"){
				$(".pay-money").text("已逾期,请重新下单");
				$(".footer span").text("无可支付的订单");
			}
			return;
		} else {
			var Daoshu = formatDate(timeBlank);
			$(".pay-money .time span").text(Daoshu)
		}
		
	},1000);
	
	
})();
//支付功能
(function() {
	$(".pay i").on("click", function() {
		$(this).toggleClass("check");
		if($(this).hasClass("one")){
			if($(this).hasClass("check"))
				$(this).closest(".pay-style").find("i.two").removeClass("check");
		} else{
			if($(this).hasClass("check"))
				$(this).closest(".pay-style").find("i.one").removeClass("check");
		}
		
	});
	$(".footer").on("click", function() {
		// 不可支付状态的判断
		// if($(".time span").text() !==" ") {
		// 	Messages.alert("无可支付的订单");
		// 	return;
		// }
		if( !timer ) return;
		$(".pay-mark").addClass("show");
		$(".contain-wra p span.amount").text(Cookies.get("price"));	
		
		
	});
	// 确定支付
	$(".btn-ok").on("click", function() {
		$.alert("已支付成功");
		$(".pay-money").html(`<p>已支付成功</p>`)
		$(".footer span").text("已支付");
		$("i.two").removeClass("check");
		$("i.one").addClass("check");
		$(".pay-mark").removeClass("show");
		var orderId = Cookies.get("orderId");
		$.myAjax({
			url:`/order/pay/${orderId}`,
			success: data => {
				
			},
		});
		
	});
	$(".btn-cancel").add($(".contain-wra .icn")).on("click", function() {
		$(".pay-mark").removeClass("show");
		
	});
	
})();
//返回按钮 回到订单确认页面
(function() {
	$(".top i.back").on("click", function() {
		window.location.href = "/pages/myorder/myorder.html"
	});
	
})();