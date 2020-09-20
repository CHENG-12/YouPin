//全局变量
var cid = parseInt(window.location.search.slice(window.location.search.lastIndexOf("=")+1));//得到传过来的cid
var orderDir = "asc";	//默认的排序方式
var orderCol = "price";	//默认是排序价格
var searchName = "";	//每次搜索的内容
var pageSize = 6;	//每次向服务器拿收多少条购物记录

var isLoading = false; 	//标识当前是否处于ajax交互状态
var scroll = null; 	//保存滚动对象
var hasMore = true;  //标识按当前条件查找商品还有没有更多

// 返回顶部功能实现
(function() {
	$("i.rocket").on("click",function() {
		if(scroll) scroll.scrollTo(0,0,400);
		$(this).hide("slow");
	});
	
})();


//显示模式切换
(function() {
	$("i.show-mode").on("click",function() {
		$(this).toggleClass("icon-card icon-list");
		$("ul.product-list").toggleClass("cart list");
		initOrRefreshScroll(); //实时更新获取的高度
		
	});
	
	
})();
//切换排序方向
(function() {
	$("i.order-dir").on("click", function() {
		if(isLoading) { $.notice("你的操作太过频繁了!") ; return;}
		$(this).toggleClass("icon-sort-asc icon-sort-desc");
		orderDir  = orderDir === "asc"? "desc" : "asc";
		updateProductList();
		
	})
	
})();
// 切换排序的列
(function() {
	$("span.order-col").on("click", function() {
		if(isLoading) { $.notice("你的操作太过频繁了!") ; return;}
		if($(this).hasClass("active")) return;
		$(this).addClass("active").siblings(".active").removeClass("active");
		updateProductList();
		
	});
	
})();
//初始的时候先调用一次
updateProductList();

function updateProductList(isLoadMore = false){
	isLoading = true;	//进入Loading 状态
	if(!isLoadMore){ 
		if(scroll) scroll.scrollTo(0,0,0);		//如果不是加载更多,要让scroll重回顶部,才能在切换的时候看到加载更多几个字,提高用户体验
		$("i.rocket").hide();			//如果不是加载更多,请求一批新的数据,返回顶部的火箭消失,因为用户重头开始看
		$("ul.product-list").empty();  //根据是否加载更多来处理 ul.product,如果不是加载更多 清空 ul.product 中旧的数据
		
	} 
	
	$("p.info").text("加载中....");					//更新p.info显示文本
	setTimeout(function() {							//故意延迟8秒为了看到 正在加载中的效果
		$.myAjax({
			global: false,
			type: "post",
			url: "/product/list",
			data: {
				name: searchName,
				cid,
				orderCol,
				orderDir,
				begin: $("ul.product-list>li").length,
				pageSize
			},
			success: data => {
				isLoading = false;	//结束Loading 状态
				//测试输出代码
				hasMore = data.length === pageSize; //更新全局变量 hasMore
				console.log(data);
				data.forEach(product => showProduct(product));//显示商品数据
				initOrRefreshScroll();	//初始化或更新滚动区域
				if(data.length === pageSize)				//更新p.info显示文本
					$("p.info").text("上拉加载更多..");
				if($("ul.product-list>li").length > 0 )
					$("p.info").text("已到达底部...");
				else
					$("p.info").text("暂无相关商品,敬请期待..");
			}
		});	
	},800)

}

function showProduct(product){
	$(`
		<li>
		
			<a href="/pages/detail/detail.html?${product.id}">
				<div class="imag"><img src="${ product.avatar}" /></div>
				<div class="content">
					<h4 class="ellipsis">${ product.name}</h4>
					<p class="brief ellipsis">${product.brief}</p>
					<p class="price">${product.price}</p>
					<p class="rate">评论数:${product.rate }</p>
					
					
				</div>
			</a>
		
		</li>
	`).appendTo("ul.product-list")
}

//初始化或刷新scroll  内容高度会实时变化,要事时刷新滚动对象
function initOrRefreshScroll() {
	imagesLoaded($(".scroll")[0], function() {	//保证滚动区域图片加载完成
		setTimeout(function() {					//保证滚动区域图片渲染完成
			if(scroll === null){
				scroll = new IScroll($(".scroll")[0], {
					deceleration: 0.003,
					bounce: false,
					probeType: 2,
					click: true,
				});
				var isTriggerLoadMore = false; //标识用户的操作的是否触发了加载更多,只有以下两个函数调用,不用写成全局变量,变量用来当做两个函数之间的联系
				scroll.on("scroll", function() {
					$("i.rocket").toggle(Math.abs(this.y) >= 100);//控制火箭的消失与显示
					// if(Math.abs(this.y) >= 100){  
					// 	$("i.rocket").show();
					// } else{
					// 	$("i.rocket").hide();
					// }
					if(hasMore && !isLoading){		//如果没有加载更多并且没有处于loading状态
						if(this.y - this.maxScrollY === 0){
							$("p.info").text("放手加载更多...")	//如果上拉达到加载更多的临界点
							isTriggerLoadMore = true;
						} else {
							$("p.info").text("上拉加载更多...")	//如果没有得到加载更多的临界点
							isTriggerLoadMore = false;
						}
					}
					
				});
				scroll.on("scrollEnd", function() {
					if(isTriggerLoadMore){
						isTriggerLoadMore = false;
						updateProductList(true);
					}
					
				});
			}
			else 
				scroll.refresh();	
		},20);
	});
}
