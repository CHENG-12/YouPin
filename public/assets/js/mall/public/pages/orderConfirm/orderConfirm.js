var price = 0;
//获取选中的购物记录的id集合
	var checkIds = Cookies.get("checkIds");
	var arr = [];
	arr = Cookies.get("checkIds").split(",");
	Cookies.remove("checkIds");
	arr.splice(arr.length - 1, 1);
//显示默认地址
(function() {
	function updateDefault(data){
		if(data === null)
			$(".content-head").append($(`<p>没有默认地址,请添加</p>`));
		else {
			
				$(".content-head").append($(`
				<span class="addre-info">
					<span class="self-sale" data-id="${data.id}">
							<span class="name">${data.receiveName}</span>
							<span class="phone">${data.receivePhone}</span>
					</span>
						<span class="free">99元包邮</span>
				</span>
				<span class="icn"><i><img src="/images/personMyhome/right.png" alt=""></i></span>
				
				`))
		
		}
		
	};

	$.myAjax({
		url:"/address/get_default",
		success: data => {
			updateDefault(data);
		}
		
	});
	
})();
//渲染要结算的商品列表
(function() {
	function updateProList(data){
		// var price = 0;
		data.forEach(function(item,i) {
			var itemPrice = item.price.toFixed(2);
			$("ul.proList").append($(`
				<li data-price="${item.price}" data-count="${item.count}">
					<span class="img-wra"><img src="${item.avatar}" alt=""></span>
					<span class="pro-info">
						<span class="name">${item.name}</span>
						<span class="price-num">
							<span class="price">${itemPrice}</span>
							<span class="num">×${item.count}</span>
						</span>
						<span class="send-free">七天无理由退货</span>
					</span>
				</li>
			`));
			price += item.count * item.price;
			// price = price.toFixed(2);
			$(".footer .price").add($(".info-three .price")).text(price);
		});

	}
	if(arr.length === 0) return;
	$.myAjax({
		type:"post",
		url: "/cart/list_ids",
		data:{
			ids: arr,
		},
		success: data => {
				updateProList(data);
		}
	});
	
	
})();

//修改默认地址
(function() {
	$(".content-head").on("click",function(){
		var backOrder = window.location.href;
		Cookies.set("bacOrder",backOrder);
		window.location.href = "/pages/address/address.html";
	})
	
})();
//提交订单
(function() {
	setTimeout(function() {
		var addressId = $(".addre-info span.self-sale").attr("data-id");
		var price =  $(".info-three .price").text()
		console.log($(".content-head>span.addre-info>span.self-sale"));
		$(".footer .access").on("click",function() {
			
			$.myAjax({
				type: "post",
				url: "/order/confirm",
				data:{
					 ids: arr,
					 account: price,
					 addressId,
				},
				success: data => {
					Cookies.set("orderId",data);
					Cookies.set("price",price);
					window.location.href = "/pages/pay/pay.html";
				}
				
			});
		});
		
	}, 200);
	
	
})();