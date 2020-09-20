//返回按钮的返回
(function() {
	$(".top i.back").on("click",function() {
		window.location.href = "/pages/personHome/personHome.html";
	});
})();
//封装渲染函数
function updateOrderList(data){
		data.forEach(function(item,i) {
			var count = 0;
			var account = 0;
			account += item.account;
			$(".content .all").add($(".content .unpay")).add($(".content .unreceive")).append($(`
				<ul data-id = "${item.orderId}" class="order proList" ></ul>	
			`));
			item.details.forEach(function(item2){
				// 计算总件数
				count += item2.count;
				$(`ul[data-id = ${item.orderId}]`).append($(`
					<li>
						<div class="wait-pay">
							<i></i>
							<span class="mid">小米自营</span>
							<span class="right" data-id = "${item.orderId}" data-price ="${account}"> ${item.pay === 1 ? "已支付" : "待付款"}</span>
						</div>
						<div class="wra">
							<span class="img-wra"><img src="${item2.avatar}"></span>
							<span class="pro-info">
								<span class="name">${item2.name}</span>
								<span class="price-num">
									<span class="price">${item2.price}</span>
									<span class="num">*${item2.count}</span>
								</span>
								<span class="send-free">99元包邮</span>
							</span>
						</div>
					</li>
				
				`));
			});
			//总数量
			$(`ul[data-id = ${item.orderId}]`).append($(`
				<div class="total">
						<span class="money">
							<span>总计:<span>${count}</span>件商品</span>
							<span>总金额:<span class="inner-money">${account}</span>元</span>
						</span>
						<span class="delete">
							<span class="to-delete" data-id = "${item.orderId}" >删除订单</span>
							<span>再次购买</span>
						</span>
					</div>
				</li> 
			`));
			
		});
	}
// 第一次进入页面的渲染全部内容
if($(".content .all").hasClass("active")){
	$.myAjax({
		url: "/order/list_all",
		success: data => {
			$(".content .all").html(`
				<div class="cart-empty active">
					<div class="img-wra"><img src="/images/cart/no_result_cart.png" alt=""></div>
					<p class="notice">您的购物车中暂无订单!</p>
					<p class="goto"><a href="/pages/index/index.html">去逛逛~</a></p>
				</div>
			
			`);
			if(data.length > 0){
				$(".content .all").empty();
				updateOrderList(data);
			} else {
				return;
			}
			
		},
	});
}
// 选项卡切换的效果
(function() {
	$(".nav li").each(function(i,item) {
		$(item).on("click",function() {
			if($(this).hasClass("active")) return;
			$(this).add($(".content div.part").eq(i)).addClass("active").siblings(".active").removeClass("active");
			// 获取全部内容
			if($(".content .all").hasClass("active")){
				$.myAjax({
					url: "/order/list_all",
					success: data => {
						$(".content .all").empty();
						$(".content .all").html(`
							<div class="cart-empty active">
								<div class="img-wra"><img src="/images/cart/no_result_cart.png" alt=""></div>
								<p class="notice">您的购物车中暂无订单!</p>
								<p class="goto"><a href="/pages/index/index.html">去逛逛~</a></p>
							</div>
						
						`);
						if(data.length > 0){
							$(".content .all").empty();
							updateOrderList(data);
						}
						
					},
				});
			}
			// 获取所有未付款的订单
			if($(".content .unpay").hasClass("active")){
				$.myAjax({
					url: "/order/list_unpay",
					success: data => {
						$(".content .unpay").empty();
						$(".content .unpay").html(`
							<div class="cart-empty active">
								<div class="img-wra"><img src="/images/cart/no_result_cart.png" alt=""></div>
								<p class="notice">您的购物车中暂无待付款的订单!</p>
								<p class="goto"><a href="/pages/index/index.html">去逛逛~</a></p>
							</div>
						
						`);
						
						if(data.length === 0 || $(".all").html() === ""){
							
							$("li.unpay span.num").removeClass("show");
							// undateEmpty();
							
							
						} else {
							$(".content .unpay").empty();
							var length = data.length;
							$("li.unpay span.num").addClass("show").text(length);
							
							updateOrderList(data);
						}
						
					},
				});
				
			}
			//获取所有待收货的订单
			if($(".content .unreceive").hasClass("active")){
				$.myAjax({
					url: "/order/list_pay",
					success: data => {
						$(".content .unreceive").empty();
						$(".content .unreceive").html(`
							<div class="cart-empty active">
								<div class="img-wra"><img src="/images/cart/no_result_cart.png" alt=""></div>
								<p class="notice">您的购物车中暂无待收货的订单!</p>
								<p class="goto"><a href="/pages/index/index.html">去逛逛~</a></p>
							</div>
						
						`);
						if(data.length === 0) {
							// updeteEmpty();
							return;
						} else{
							$(".content .unreceive").empty();
							updateOrderList(data);
						}
						
					},
				});
			}
		});
	});
	// $(".nav li").eq(0).trigger("click");
})();


// 对订单的操作
(function() {
	//支付订单的冒泡
	$(".content").on("click", function(e){
		//付款功能的点击事件
		if($(e.target).hasClass("right")){
			if($(e.target).text() === "已支付") return;
			Cookies.set("orderId",$(e.target).attr("data-id"));
			$(".pay-mark").addClass("show");
			$(".contain-wra p span.amount").text($(e.target).attr("data-price"));
		}
	   
	//删除功能的点击事件
		function upDateFair(){
			var $part = $(e.target).closest(".part");
			$(e.target).closest("ul").remove();
			var length = $part.children().length;
			// 删除也要更新页面的显示
			$("li.unpay span.num").toggleClass("show", length != 0);
			if(length > 0){
				$("li.unpay span.num").text(length);
			} 
			//更新数据库
			if($part.html() === ""){
				$part.html(`
					<div class="cart-empty active">
						<div class="img-wra"><img src="/images/cart/no_result_cart.png" alt=""></div>
						<p class="notice">您的购物车中暂无相关的订单!</p>
						<p class="goto"><a href="/pages/index/index.html">去逛逛~</a></p>
					</div>
				
				`);
			
			}
			
		};
		if($(e.target).hasClass("to-delete")) {
			$.confirm("确定要删除吗?", function() {
				$.myAjax({
					url: "/order/remove/"+ $(e.target).attr('data-id'),
					success: data => {
						upDateFair();
					}
				});
				
			});
		}
	});
		// 确定支付
		$(".btn-ok").on("click", function() {
			$.alert("已支付成功");
			$("i.two").removeClass("check");
			$("i.one").addClass("check");
			$(".pay-mark").removeClass("show");
			var orderId = Cookies.get("orderId");
			$.myAjax({
				url:`/order/pay/${orderId}`,
				success: data => {
					$(`ul[data-id = ${orderId}]`).find(".right").text("已支付");
					if($('div.unpay.active')){
						$(`ul[data-id = ${orderId}]`).remove();
						if($('div.unpay.active').html() === '') {
							$('div.unpay.active').html(`
								<div class="cart-empty active">
									<div class="img-wra"><img src="/images/cart/no_result_cart.png" alt=""></div>
									<p class="notice">您的购物车中暂无相关的订单!</p>
									<p class="goto"><a href="/pages/index/index.html">去逛逛~</a></p>
								</div>
							
							`);
							//更新数量
							$("li.unpay span.num").removeClass("show");
						} else {
							var length = $('div.unpay.active').children().length;
							$("li.unpay span.num").text(length);
						}
							
					}
						
				},
			});
		
		});
	
		// 取消支付
		$(".btn-cancel").add($(".contain-wra .icn")).on("click", function() {
			$(".pay-mark").removeClass("show");
		});
})();