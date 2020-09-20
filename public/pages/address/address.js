// 更新页面的地址列表显示
function updateAddressList(data){
	data.forEach(function(item) {
		$(".addressList").append($(`
			<div class="address-item" data-id="${item.id}" >
				<span class="addressinfo">
					<span class="default" data-default="${item.isDefault}" data-id="${item.id}"></span>
					<span class="address-info">
						<span class="name">${item.receiveName}</span>
						<span class="phone">${item.receivePhone}</span>
					</span>
					<span class="street">${item.receiveRegion}</span>
				</span>
					<span class="icn edit" data-id="${item.id}">
						<i class="edit">
							<a href="/pages/adAddress/adAddress.html">
								<img class="edit" data-id="${item.id}"src="/images/address/icon_edit_gray.png" alt="">
							</a>
						</i>
					</span>
			</div>
		`));
	});
	// 默认地址的内容显示,获取数据库中的默认地址
	setTimeout(function() {
		$(" .address-item span.default").each(function(i,item) {
			$(item).text($(item).attr("data-default") === "1" ? "默认地址" : "设为默认地址");
			if($(item).text() === "默认地址") {
				$(item).css("color","red");
				$(item).closest(".address-item").css("border"," 1px dashed red");
			}
		});
	},200)
};
// 第一次进入页面获取信息
(function() {
	$.myAjax({
		url: "/address/list",
		success: data => {
			if(data.length === 0)
				$(".addre-empty").addClass("show").siblings(".show").removeClass("show");
			 else{
				$(".addressList").addClass("show").siblings(".show").removeClass("show");
				updateAddressList(data);
			}
		}
	});
})();

// 冒泡 绑定各种绑定事件
(function() {
	$(".addressList").on("click",function(e){
		//点击设置默认地址
		if($(e.target).hasClass("default")){
			if($(e.target).attr("data-default") === "1") return;
			else{
				var id = $(e.target).attr("data-id");
				// 数据库的更新
				$.myAjax({
					url: `/address/set_default/${id}`,
					success: data => {
						
					}
				});
				//页面的更新
				$(e.target).text("默认地址").closest(".address-item").siblings().find("span.default").text("设为默认地址");
				
				$(e.target).css("color","red").closest(".address-item").siblings().find("span.default").css("color","blue");
				$(e.target).closest(".address-item").css("border","1px dashed red").siblings().css("border","none");
				//藏值的更新
				$(e.target).attr("data-default","1").closest(".address-item").siblings().find("span.default").attr("data-default","0");
			}
		}
		//点击修改按钮开始修改
		if($(e.target).hasClass("edit")){
			var id = $(e.target).attr("data-id");
			Cookies.set("id",id);
		}
	});
})();
// 返回按钮返回的页面
(function() {
	$(".top i").on("click",function(){
		var bacUrl = Cookies.get("bacOrder");
		Cookies.remove("bacOrder");
		if(bacUrl)
			$(this).find("a").attr("href",bacUrl);
		else
			$(this).find("a").attr("href","/pages/personHome/personHome.html");
	});
	
	
})();