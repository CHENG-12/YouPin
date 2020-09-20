// 验证功能
(function() {
	//提示位置
	var pass = 1;
	var demo = $(".login").Validform({
		tiptype: 3,
		datatype: {
			phone: function(gets) {
				var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/;
				if( !reg.test(gets)){
					pass = 0;
					return false;	
				} 
			},
			
			password: function(gets) {
				var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/;
				if( !reg.test(gets)){
					pass = 0;
					return false;	
				} 
			},
			
			username: function(gets,obj,curform) {
				var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/;
				if( !reg.test(gets)) return false;
				var result;
				$.ajax({
					global: false,
					async: false,
					type:"get",
					url: "http://localhost:3000/user/check_name/" + gets,
					success: function(response){
						if(response.code === 200){
							result = response.data === 0 ? true: "用户名已存在";
							if(result === "用户名已存在") pass = 0;
							
						} else {
							pass = 0
							result = response.code;
							
						}
						
					},
					error: function(){
						pass = 0;
						result = "服务器验证失败";
						
					}
					
				});
				return result;
				
			}
		}
	});
	// 重置功能
	$(".reset").on("click",function() {
		demo.resetForm();
		$(".Validform_checktip").html("");
		
	});
	
	//注册功能
	$(".register").on("click",function() {
		console.log(pass);
		if(pass === 0){
			$.alert("请输入正确的信息后再提交");
			return;
		} else {
			// $.alert("注册成功!");
			$.confirm("注册成功!", function() {
				window.location.href = "/pages/login/login.html";
				
			});
		}
		
	});
})();