//刚刚进页面的时候,用立即执行函数,让返回顶部图标消失
(function() {
	$(".back-top").fadeOut(200);
})();
// 详情内容的渲染
var id = parseInt(window.location.search.slice(window.location.search.lastIndexOf("=" + 1)));
(function() {
	//轮播图下方信息渲染
	function showProduct(data){
		$(".content .slide-info").append(
			$(`
				<p class="price">${data.price}</p>
				<p class="name">${data.name}</p>
				<p class="brief">${data.brief}</p>
				<p class="ads">小米空调大放价！抽奖赢小米65英寸电视！爆款直降1000元！</p>
				<p>立即抢购</p>
	
			`)
	
		);
		
		//实现图片轮播效果
		var imgSrc = data.bannerImgs.split(",");
			imgSrc.forEach(image => {
				$(`
					<div class="swiper-slide"><img src='${image}' /></div>
				`).appendTo('.swiper-wrapper');
			});
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
	}
	//商品详情区域大图片的渲染
	function showBigImg(data){
		var BigSrc = data.otherImgs.split(",");
		BigSrc.forEach(function(item) {
			$(".pro-detail .img-wra").append(
				$(`
				
					<img src="${item}"/>
				
				`)
			);
			
			
		});
		
		
	};
	// 加入购物车页面的上部分商品小图片的渲染
	function showSmallImg(data){
		$(".add-car-top img").attr("src", data.avatar);
		
	};
	// 发送ajax请求
	$.myAjax({
		url:`/product/model/${id}`,
		success: data =>{
			showProduct(data);
			showBigImg(data);
			showSmallImg(data);
		}
	});
	// 加入购物车页面的上部分商品小图片的渲染
	
})();

// 水平滑动效果
imagesLoaded($(".scroll")[0], function(){
	var scroll = new IScroll(document.querySelector(".scroll"),{
		scrollX : true,
		// scrollY : true,
		deceleration: 0.003,
		bounce: false,
		momnetum: true,
		click: false,
		probeType: 2,
	});
});
//上下的导航动画和返回顶部 
(function() {
	//上面导航的上面联动下面
	var tops = [];
	imagesLoaded(".content", function() {
		setTimeout(function() {
			$(".part").each(function(i,item) {
				tops.push($(item).offset().top);
			});
		},200)
	});
	$(".indic a").each(function(i,item) {
		$(item).on("click",function() {
			//下面的滚动事件省略了此处的手动激化a的样式,滚到指定的位置,是滚动到指定的位置,顺便就激活了
			$(".content").animate({scrollTop: tops[i] - 48 },{duration: 1000});
		});
	});
	
	//监听滚动事件
	$(".content").on("scroll", function() {
		//上方导航的显示与隐藏
		$(".head").toggleClass("show", $(this).scrollTop() > 0);
		//联动效果
		//下面联动上面
		imagesLoaded(".content",function() {
			$(".part").each(function(i,item) {
				if(($(item).offset().top) <= 48) 
					$(".head .indic a").eq(i).addClass("active").siblings(".active").removeClass("active");
			});
		});
		// 下方导航的吸顶效果
		$(".pro-detail .pro-head.fix").toggleClass("show",$(".pro-detail .pro-head").offset().top <= 48 && $(".introduce").offset().top > 60);
	    //滑到一定的距离回到顶部的显示与消失
		if($(this).scrollTop() >= 600){
			$(".back-top").fadeIn(200);
		} else{
			$(".back-top").fadeOut(200);
		}
	});
	
	//返回顶部
	$(".back-top").on("click",function() {
		$(".content").animate({scrollTop: 48},{duration: 1000});
	});
	

	
	
})();

//更新页面左下角总数量的函数
(function() {
	function updateTotal(data){
		//有可能删除到0
		if(data === 0){
			$(".footer .icn span.count").removeClass("show");
			return;
		} else {
			$(".footer .icn span.count").addClass("show").text(data);
		}
	};
	$.myAjax({
		url:"/cart/total",
		success: data => {
			updateTotal(data);
		}
	});
	
})();

// 购物车数量的更新与变化
(function() {
	// 变量声明
	var count = 1,
		maxCount = 5;
	// 蒙层的显示与消失 动画效果 加 transition 的位置双重控制
	$("ul.choose .count i").add($(".footer .buy .goto-cart")).on("click", function() {
		$(".add-carWra").addClass("show");
		setTimeout(function(){
			$(".add-carWra").css("backgroundColor", "rgba(0,0,0,0.3)");
			
		},500);
		$(".add-carWra .close").on("click", function() {
			$(".add-carWra").css("backgroundColor", "rgba(0,0,0,0)");
			$(".add-carWra").removeClass("show");
		});
	});
	
	//按钮数量加
	$(".num-wra input.btn-increase").on("click", function() {
		$(".num-wra input.btn-decrease").attr("disabled", false);
		$(".num-wra span.count").add($(".add-car-top span span")).text(++count);
		$(this).attr("disabled", count === maxCount ? true : false);
	});
	//按钮数量减
	$(".num-wra input.btn-decrease").on("click", function() {
		$(".num-wra input.btn-increase").attr("disabled", false);
		$(".num-wra span.count").add($(".add-car-top span span")).text(--count);
		$(this).attr("disabled", count === 1 ? true : false );
	});
	
	// 点击加入购物车按钮,加入购物车商品
	$(".buy .add-buyCar ").on("click", function() {
		// 判断是否已经登录
		if( !sessionStorage.getItem("token")){
			bacUrl = window.location.href;
			Cookies.set("backUrl",bacUrl);
			window.location.href = "/pages/login/login.html";
		}	
		// 登录后发送请求,然后拿到数据到购物车页面进行渲染
		
		else {
			var token = sessionStorage.getItem("token");
			$.myAjax({
					type: "post",
					url: "/cart/add",
					data :{
						pid: `${id}`,
						count: `${count}`,
					},
					success: data => {
						window.location.href = "/pages/cart/cart.html";
					}
			});
		
		}
		
	});
})();

//藏页面方便返回页面使用 和 左下角返回首页
(function() {
	var bacDetail = window.location.href;
	Cookies.set("bacDetail", bacDetail);
	$(".footer .icn i").on("click", function() {
		window.location.href = "/pages/index/index.html";
	});
})();
