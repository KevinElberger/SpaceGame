import PlayState from 'states/game';
import GameState from 'states/GameState';
import Game from '../index';

class Splash extends Phaser.State {
	init() {
		this.loadingBar = Game.make.sprite(35, Game.world.centerY, 'loading');
		this.status = Game.make.text(Game.world.centerX, 100, 'Loading...', {fill: 'white'});
		this.status.anchor.setTo(0.5);
	}

	preload() {
		Game.add.sprite(0, 0, 'space');
		Game.add.existing(this.loadingBar);
		Game.add.existing(this.status);
		this.load.setPreloadSprite(this.loadingBar);
	}

	addGameStates() {
		Game.state.add("Game", Playstate);
	}

	create() {
		this.status.setText('Ready!');
		this.addGameStates();
	
		setTimeout(function() {
	 		Game.state.start("Game");
		}, 1000);
	}
}

export default Splash;