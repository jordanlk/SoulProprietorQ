var gameOver = function(game){};

gameOver.prototype = {
	init: function(score){
		alert("You scored: "+score);
	},
  	create: function(){
  		
  		var background = this.game.add.sprite(0,0,"background_gameover");
  		var gameTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - this.game.world.centerY / 2,"gameover_title");
		gameTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(gameTitle.x,gameTitle.y + 300,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("GameTitle");
	}
};