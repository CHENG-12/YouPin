//购物列表数据动态渲染函数
function updateCartList(data){
	data.forEach(function(item,i) {
		var itemPrice = item.price.toFixed(2);
		$(".content ul.cartList").prepend(
		$(`
			<li data-id="${item.id}" data-count="${item.count}" data-checked ="1" data-price ="${item.price}">
				<i class='unchoose'></i>
				<div class="img-wra">
					<img src="${item.avatar}" alt="">
				</div>
				<span class="info-right">
					<span class="name">${item.name}</span>
					<span class="price-num">
						<span class="price">￥<span>${itemPrice}</span></span>
						<span class="num-wra">
							<input class="btn-decrease" type="button" value="-" />
							<span class="count">${item.count}</span>
							<input class="btn-increase" type="button" value="+" /> 
						</span> 
					</span>
				</span>
			</li>
		`));
	});
};	
//发送Ajax请求,获取该登录用户的购物车商品信息
		$.myAjax({
				url:"/cart/list",
				type: "post",
				success: data => {
				$(".cart-empty").toggleClass("active",data.length === 0);
				$(".content").add($(".edit")).toggleClass("active",data.length != 0);
				if(data.length === 0) return;
				updateCartList(data);
			}
		});

// 购物车部分
(function() {
	
	// 存放选中的id
	function setIds(){
		var checkIds = "";
		//数组变成字符串来插入
		$("ul.cartList li i.choose").each(function(i,item) {
		checkIds += $(item).closest("li").attr("data-id") + ",";
		});
		if(checkIds.length >0) Cookies.set("checkIds",checkIds);
	}
	//更新要结算的总数量和总价格
	function updateTotalAndAccount(){
		var total = 0;
		var account = 0;
		$("ul.cartList li>i.choose").each(function(i,item){
			var count =	parseInt($(item).siblings(".info-right").find(".count").text());
			var price = parseInt($(item).siblings(".info-right").find(".price span").text());
			total += count;
			account += price * count;
			console.log(account);
			// account = account.toFixed(2);
		});   
		$(".footer .access").add($(".footer .price")).empty();
		
		// 测试代码成功
		$(".footer .access").append(
			$(".head .edit").text() === "完成" ? $(`<span class="delete">删除(${total})</span>`) : $(`<span class="access">结算(${total})</span>`)
		);
		
		$(".footer .price").append(`${account}`);
	};

	//点击编辑的状态切换
	(function() {
		$(".head .edit").on("click", function() {
			// 如果点的是编辑就往里面放值 存放选中的Id
			//下面选框的状态 70-100
			if($(this).text() === "编辑"){
				setIds();
				//进入编辑更新所有选框为未选中
				 $("ul.cartList li i.choose").attr("class","unchoose");
				 $(".content-head i.choose").removeClass("choose");
			}
			// 如果选中的是完成 就往外取值
			if($(this).text() ==="完成") {
				if(Cookies.get("checkIds")) {
					var arr = [];
					arr = Cookies.get("checkIds").split(",");
					// 用完就清空,订单确认使用
					// Cookies.remove("checkIds");
					// 数组的删除
					arr.splice(arr.length - 1, 1);
					arr.forEach(function(checkId) {
						$("ul.cartList li").each(function(i,item) {
							if($(item).attr("data-id") === checkId) $(item).children("i").attr("class","choose") ;
						})
					})
				// 下面联动上面
				if($("ul.cartList li i").hasClass("unchoose") || $("ul.cartList li i").length === 0) $(".content-head i").removeClass("choose");
				else $(".content-head i").addClass("choose");
				
				} //有没放值的可能,就取不到值
				else {
					$("ul.cartList li i").attr("class","unchoose");
					//全选的状态没有点击事件也要根据下面的情况进行改变 105-106
					//下面联动上面  -- 注意位置在改变类名之后再查找
					console.log($("ul.cartList li i").length);
					if($("ul.cartList li i").hasClass("unchoose") || $("ul.cartList li i").length === 0) $(".content-head i").removeClass("choose");
					else $(".content-head i").addClass("choose");
				}
		
			}
			
			//内容选项卡的切换
			$(this).text($(this).text() === "编辑" ? "完成" : "编辑");
			$(".footer .access").text($(this).text() === "编辑" ? "结算" : "删除");
			
			// $(".footer a").attr("href",$(this).text() === "编辑"?"/pages/orederConfirm/orderConfirm.html":"javascript:void(0)");
			
			$(".footer .total").add($(".footer .price")).css({
				display: $(".footer .access").text() === "结算"? "inline-block": "none",
			});
			//更新总数量与金额
			updateTotalAndAccount();
		});
	
	})();
	//编辑状态 删除功能和结算功能的实现
	
	(function() {
		//删除之后跟新页面内容显示
		function updateNewCartList(checkIds) {
			checkIds.forEach(function(checkId) {
				$("ul.cartList li").each(function(i,item) {
					if($(item).attr("data-id") === checkId) $(item).remove();
				});
			});
			//全选的状态没有点击事件也要根据下面的情况进行改变 105-106
			//下面联动上面 类名的情况和全删完没有类名的情况
			if($("ul.cartList li i").hasClass("unchoose") || $("ul.cartList li i").length === 0) $(".content-head i").removeClass("choose");
			else $(".content-head i").addClass("choose");
			
		}
		$(".footer .access").on("click", function() {
			
			$("ul.cartList li i.choose").closest("li").attr("data-id");
			if($(this).children().attr("class") === "delete" ){
				$.myAjax({
					type: "post",
					url: `/cart/remove`,
					data: {
						ids : checkIds,
					},
					success: data => {
						updateNewCartList(checkIds);
						updateTotalAndAccount();
					}
				});
			}
			
		});
		//结算功能 
		$(".footer a").on("click",function(){
		   if($(".footer .price").text() === "0" || $(".footer .price").text() === "￥0.00") {
			   $.confirm("没有选择商品,不可结算!");
			   $(".footer a").attr("href","javascript:void(0)");
		   }
		   else{
			   //结算有链接,删除无链接
				$(".footer a").attr("href",$(".edit").text() === "编辑"?"/pages/orderConfirm/orderConfirm.html":"javascript:void(0)");
				//点击结算的时候就存放id
				setIds();
		   }
		});
		
	})();
	
	//结算状态数量的加减控制
	(function() {
		var maxCount = 5;
		var count = 0;
		setTimeout(function() {
			// 数量减
			$(".num-wra .btn-decrease").on("click", function() {
				$(this).next().next().attr("disabled",false);
				count = $(this).closest("li").attr("data-count");
				--count;
				$(this).next().text(count);
				//注意藏值的属性也要及时的去更新,不然下一次点击的时候不能使用藏的数值了
				$(this).closest("li").attr("data-count",count);
				$(this).attr("disabled", count === 1 ? true: false);
				//数据库更新
				var idDecrease = $(this).closest("li").attr("data-id");
				$.myAjax({
					global: false,
					type: "post",
					url: `/cart/decrease/${idDecrease}`,
					success: data => { 
						
					}
				});
				// 页面更新数量
				updateTotalAndAccount();
				
			});
			// 数量加
			$(".num-wra .btn-increase").on("click", function() {
					$(this).prev().prev().attr("disabled", false);
					count = $(this).closest("li").attr("data-count");
					++count;
					$(this).prev().text(count);
					$(this).closest("li").attr("data-count",count);
					$(this).attr("disabled", count === maxCount ? true: false);
					//数据库更新
					var idIncrease = $(this).closest("li").attr("data-id");
					$.myAjax({
						global: false,
						type: "post",
						url: `/cart/increase/${idIncrease}`,
						success: data => {
							
						}
					});
					// 页面更新数量
					updateTotalAndAccount();
			});
		},200);	
	})();
	
	//全选反选
	(function() {
		$(".content-head i").on("click", function() {
			//每个点击时候的切换
			$(this).toggleClass("choose");
			// 上面联动下面
			if($(this).hasClass("choose")) {
				$("ul.cartList li>i").attr("class"," ").addClass("choose");
			} 
			else {
				 $("ul.cartList li>i").removeClass("choose").addClass("unchoose");
			}
			//更新总数量和总结算
			updateTotalAndAccount();
		});
		setTimeout(function() {
			$("ul.cartList li i").on("click", function() {
				$(this).attr("class", $(this).attr("class") === "choose" ? "unchoose" : "choose");
				//下面联动上面
				if($("ul.cartList li i").hasClass("unchoose") || $("ul.cartList li i").length === 0) $(".content-head i").removeClass("choose");
				else $(".content-head i").addClass("choose");
				//更新总数量和总结算
				updateTotalAndAccount();
			});
		},200);
	})();

})();
//返回按钮的功能实现
(function() {
	var bacDetail = Cookies.get("bacDetail");
	$(".head span.icn a").attr("href",bacDetail);
	
})();
