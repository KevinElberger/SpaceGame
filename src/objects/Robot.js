import Enemy from 'objects/Enemy'

class Robot extends Enemy {
	constructor(game, x, y) {
		super(game, x, y, 'robot');
		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.set(0.5, 0.5);
		this.enableBody = true;

		this.animations.add('left', [0,1,0,2], 8, true);
		this.animations.add('right', [5,4,5,3], 8, true);
		let anim = this.animations.add('death', [6,7,6,7], 6, false);
		anim.onComplete.add(this.death, this);

		this.body.velocity.x = 40;

		this.barConfig = {x: this.body.x, y: this.body.y-12, width: this.health * 2, height: 4};
		this.healthbar = new HealthBar(this.game, this.barConfig);
	}

	update() {
		let chasing = false;

		if (this.dying) {
			return;
		}

		this.healthbar.bgSprite.x = this.body.x+7;
		this.healthbar.barSprite.x = this.body.x+2;

		if (this.body.blocked.right) {
			this.scale.x = -1;
			this.body.velocity.x = -40;
		} else if (this.body.blocked.left) {
			this.scale.x = 1;
			this.body.velocity.x = 40;
		}

		if (!chasing) {
			if (this.body.velocity.x > 0) {
				this.animations.play('right');
				this.body.velocity.x = 40;
			} else if (this.body.velocity.x < 0) {
				this.animations.play('left');
				this.body.velocity.x = -40;
			}
		}
	}

	death() {
		this.exists = false;
		this.healthbar.kill();
	}
}

export default Robot;