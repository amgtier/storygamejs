var game;
$().ready(function(){
	game = new StoryGame("game", scene);
	// game.setScene(scene);
	game.height = 667;
	game.width = 375;
	game.start();
	back_index();
});

function back_index(){
	if(window.location !== window.parent.location) {
	} else {
		var wrapper = $("#wrapper");
		wrapper.prepend('<div class="go-back"><a href="/">&times;</a></div>');
	}
}