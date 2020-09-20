// 判断是新增还是修改
var id = Cookies.get("id")
Cookies.remove("id");
$(".top span").text(id ? "修改收货地址" : "新增收货地址");
$(".btn-delete").toggleClass("show", id !== undefined);
if(id){
	// 有 id 就是修改 获取信息跟新页面内容
	function updateInfo(data){
		$(".input-wra input.name").val(data.receiveName);
		$(".input-wra input.phone").val(data.receivePhone);
		$(".input-wra input.regions-picker").val(data.receiveRegion);
		$(".input-wra input.street").val(data.receiveDetail);
	};
	//获取该id的详细信息
	$.myAjax({
		global: false,
		url: `/address/model/${id}`,
		success: data =>{
			console.log(data);
			updateInfo(data);
		}
	});
} 
// 点击删除 和保存(真正的新增和修改)
(function() {
	//点击删除
	$(".btn-delete").on("click",function() {
		$.confirm("确定要删除吗?",function() {
			Message.notice("删除成功");
			$.myAjax({
				url:`/address/remove/${id}`,
				success: data => {
					
				}
			});
			setTimeout(function() {
				window.location.href= "/pages/address/address.html"
			},1000) ;
		});
		
	});
	// 点击保存
	$(".btn-save").on("click",function() {
		if(id){
			//修改
				Message.notice("地址变更成功");
				$.myAjax({
					type:"post",
					url:`/address/update`,
					data: {
						id,
						receiveName:$(".input-wra input.name").val(),
						receivePhone: $(".input-wra input.phone").val(),
						receiveRegion: $(".input-wra input.regions-picker").val(),
						receiveDetail: $(".input-wra input.street").val()
					},
					success: data => {
						
					}
				});
				setTimeout(function() {
					window.location.href= "/pages/address/address.html"
				},2000) ;
		} else{
			//新增
			Message.notice("新增成功");
			$.myAjax({
				type:"post",
				url:`/address/add`,
				data: {
					receiveName: $(".input-wra input.name").val(),
					receivePhone:$(".input-wra input.phone").val(),
					receiveRegion: $(".input-wra input.regions-picker").val(),
					receiveDetail:$(".input-wra input.street").val()
				},
				success: data => {
					
				}
			});
			setTimeout(function() {
				window.location.href= "/pages/address/address.html"
			},2000) ;
		}
	});
})();