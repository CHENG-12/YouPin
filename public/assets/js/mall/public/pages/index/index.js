// 轮播图
(function() {
	new Swiper('.swiper-container', {
	  loop: true,   // 是否无缝
	  grabCursor: true,
	  autoplay: {   // 自动播放
		delay: 5000,   // 切换间隔时间
		disableOnInteraction: false,  // 用户操作完可以自动轮播
	  },
	  pagination: {
		el: '.swiper-pagination',
		clickable: true,   // 点击指示器可以切换
	  },
	  navigation: {
		nextEl: "",
		prevEl: ''
	  },
	});
})();

// 右下角的购物车数量
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
			console.log(data);
			updateTotal(data);
		}
	});
	
})();