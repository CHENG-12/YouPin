// 登录方式切换 选项卡效果
$(".login-style span").on("click", function(){
	$(this).text($(this).text() === "用户名密码登录" ? "手机验证码登录" : "用户名密码登录");
	$(".login .login-user").toggleClass("show", $(this).text() === "手机验证码登录");
	$(".login .login-code").toggleClass("show", $(this).text() === "用户名密码登录");
}); 
//登录功能的实现
(function() {
	$(".login-btn").on("click", function() {
		var $userName = $(".login input.user").val();
		var $userPhone = $(".login input.phone").val();
		var $pwd = $(".login input.pwd").val();
		var $cod = $(".login input.cod").val();
		if($pwd){
			$.myAjax({
				type: "post",
				url : "/user/login_pwd",
				data : {
					name: $userName,
					pwd: $pwd
				},
				success : data => {
					sessionStorage.setItem("token",data);
					Cookies.set("user",$userName);
					console.log(Cookies.get("backUrl"));
					if(Cookies.get("backUrl")){
						var backUrl = Cookies.get("backUrl");
						Cookies.remove("backUrl");
						window.location.href= `${backUrl}`;
					} else {
						window.location.href = "/pages/index/index.html";
					}
				}
			});
		}
		if($cod){
			$.myAjax({
				type: "post",
				url : "/user/login_phone",
				data : {
					phone: $userPhone,
				},
				success : data => {
					if(Cookies.get("bacUrl")){
						var bacUrl = Cookies.get("bacUrl");
						Cookies.remove("backUrl");
						window.location.href= `${bacUrl}`;
					} else {
						window.location.href = "/pages/index/index.html";
					}
				}
			});
		}
	});

})();
//登录验证
(function() {
	//验证初始化
	var demo = $(".login").Validform({
		tiptype: 3
		
	});
	
	
})();
	
	