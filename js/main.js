var game;
$().ready(function(){
	game = new StoryGame("game", scene);
	// game.setScene(scene);
	game.height = 667;
	game.width = 375;
	game.start();
});