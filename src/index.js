import GameState from 'states/game';

class Game extends Phaser.Game {
	constructor() {
		super(500, 336, Phaser.AUTO, 'content', null);
        this.state.add('Main', GameState);
        this.state.start('Main');
	}
}

export default new Game();