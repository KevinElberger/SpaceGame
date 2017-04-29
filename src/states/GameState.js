import Splash from 'states/splashScreen';

class GameState extends Phaser.State {

	preload() {
		this.game.load.image('space', 'assets/space1.png');
		this.game.load.image('loading', 'assets/loading.png');
	}

	create() {
		this.game.state.add('splashScreen', Splash);
		this.game.state.start('splashScreen');
	}

}

export default GameState;