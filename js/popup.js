$(document).ready(function(){
	turn_on_btn(true);
	close_btn(true);
});

function turn_on_btn(handler=false, data){
	if(handler){
		var btn = $("#open-popup").on("click", function(){
			$(".popup").removeClass("popup-hide");
		});
	}
}

function close_btn(handler=false, data){
	if(handler){
		var btn = $("#close-popup").on("click", function(){
			// $(".popup").css("display", "none");
			$(".popup").addClass("popup-hide");
		});
	}
}