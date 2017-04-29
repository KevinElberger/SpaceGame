import GameState from 'states/GameState';
import Game from 'states/game';

class Splash extends Phaser.State {
	init() {
		this.loadingBar = this.game.add.sprite(35, this.game.world.centerY, 'loading');
		this.status = this.game.make.text(this.game.world.centerX, 100, 'Loading...', {fill: 'white'});
		this.status.anchor.setTo(0.5);
	}

	preload() {
		this.game.add.sprite(0, 0, 'space');
		this.game.add.existing(this.loadingBar);
		this.game.add.existing(this.status);
		this.load.setPreloadSprite(this.loadingBar);
	}

	addGameStates() {
		this.game.state.add("Game", Game);
	}

	create() {
		var that = this;
		this.status.setText('Ready!');
		this.addGameStates();
	
		setTimeout(function() {
	 		that.game.state.start("Game");
		}, 1000);
	}
}

export default Splash;