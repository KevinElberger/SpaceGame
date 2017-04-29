import Hero from 'states/game'

function Robot(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'robot');
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor.set(0.5, 0.5);
	this.enableBody = true;

	this.animations.add('left', [0,1,0,2], 8, true);
	this.animations.add('right', [5,4,5,3], 8, true);
	let anim = this.animations.add('death', [6,7,6,7], 6, false);
	anim.onComplete.add(this.death, this);

	this.body.velocity.x = 40;
	this.health = 5;
	this.damage = 2;

	this.barConfig = {x: this.body.x, y: this.body.y-12, width: this.health * 2, height: 4};
	this.healthbar = new HealthBar(this.game, this.barConfig);
}

Robot.prototype = Object.create(Phaser.Sprite.prototype);
Robot.prototype.constructor = Robot;

Robot.prototype.update = function() {
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

	// TODO: Need to find a way to reference the Hero's x,y coordinates
	/* if (Math. round(this.y) === Math.round(this.game.hero.y)) {
	 	if (Math.round(GameState.hero.x) > Math.round(this.x)) {
	 		this.animations.play('right');
	 		this.body.velocity.x = 75;
	 	} else {
	 		this.animations.play('left');
	 		this.body.velocity.x = -75;
	 	}
	 	chasing = true;
	   } */

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

Robot.prototype.hit = function(bullet) {
	if (this.dying) {
		return;
	}

	if (bullet.body.velocity.x > 0) {
		this.body.velocity.x = 500;
	} else if (bullet.body.velocity.x < 0) {
		this.body.velocity.x = -500;
	}

	this.health -= bullet.damage;
	this.healthbar.barSprite.width -= bullet.damage * 2;

	if (this.health < 1) {
		this.dying = true;
		this.healthbar.barSprite.width = 0;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
		this.body.allowGravity = false;
		this.animations.play("death");
	}
}

Robot.prototype.death = function() {
	this.exists = false;
	this.healthbar.kill();
}

export default Robot;