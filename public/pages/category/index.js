// 一级导航的动态渲染
function showSubCategory(data){
	data.forEach(function(item,i) {
		
			$(`
				<a href="/pages/list/list.html?cid=${item.id}">
					<li>
						<img src="${item.avatar}" />
						<span>${item.name}</span>
					<li>
				
				</a>
		 
			`).appendTo("ul.category-sub");	
	
	});
}
// 二级导航的动态渲染
function showMainCategory(data) {
	data.forEach(function(item) {
		$(`
			<li data-id="${item.id}" data-avatar="${item.avatar}"><span>${ item.name }</span></li>
		
		`).on("click", function() {
			if($(this).hasClass("active")) return;
			$(this).addClass("active").siblings(".active").removeClass("active");
			$(".right>img").attr("src",$(this).attr("data-avatar"));
			$.myAjax({
				url:`/category/list/ ${ $(this).attr("data-id") }`,
				success: data => {
					$("p").toggleClass("active", data.length === 0);
					$("ul.category-sub").empty().toggleClass("active", data.length !== 0);
					showSubCategory(data);
				}
			}
				
			
			);
			
		}).appendTo("ul.category-main")
	});
	
	
};
//发送ajax请求向服务器请求一级分类的数据
$.myAjax({
	url: "/category/list/0", //请求的url地址
	success: data => {	//请求成功返回结果后的回调函数
			$("p.empty").toggleClass("show", data.length === 0)
			showMainCategory(data);	
			$("ul.category-main>li").eq(0).trigger("click");
		}
});
//底部购物车总数量的显示
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