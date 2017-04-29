function Hero(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'dude');
	this.anchor.set(0.5, 0.5);

	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;

	this.animations.add('stop', [0]);
	this.animations.add('left', [5,4,6,4], 4, true);
	this.animations.add('right', [2,3,1,3], 4, true);
	this.animations.add('jumpRight', [7]);
	this.animations.add('fallRight', [8]);
	this.animations.add('jumpLeft', [10]);
	this.animations.add('fallLeft', [9]);
	this.animations.add('shootRight', [11,12,13], 8, true);
	this.animations.add('shootLeft', [16,15,14], 8, true);
	let anim = this.animations.add('death', [17, 18], 2, false);
	anim.onComplete.add(this.death, this);  


	this.health = 20;
	this.barConfig = {x: this.body.x, y: this.body.y-12, width: this.health / 2, height: 4};
	this.healthbar = new HealthBar(this.game, this.barConfig);

	this.JUMP_SPEED = 95;
	this.jumpMax = 1;
	this.jumpCount = 0;

	this.invincible = false;

	this.items = [];
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function(direction) {
	const SPEED = 70;
	this.body.velocity.x = direction * SPEED;
}

Hero.prototype.jump = function() {
	if (this.jumpCount > 0) {
		this.body.velocity.y = -this.JUMP_SPEED * 1.5;
	} else {
		this.body.velocity.y = -this.JUMP_SPEED;
	}
}

Hero.prototype.upgrade = function() {
	this.jumpMax = 2;

	this.loadTexture('dude_jetpack');
	this.animations.add('stop', [0]);
	this.animations.add('left', [5,4,6,4], 4, true);
	this.animations.add('right', [2,3,1,3], 4, true);
	this.animations.add('fallRight', [8]);
	this.animations.add('fallLeft', [9]);
	this.animations.add('shootRight', [11,12,13], 8, true);
	this.animations.add('shootLeft', [16,15,14], 8, true);
	this.animations.add('jumpRight', [17,18,19,20,21], 12, false);
	this.animations.add('jumpLeft', [26,25,24,23,22], 12, false);
	let deathAnim = this.animations.add('death', [27, 28], 2, false);
	deathAnim.onComplete.add(this.death, this);
}

Hero.prototype.update = function () {
	if (this.dying) {
		return;
	}

	if (this.y >= 320) {
		this.dying = true;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
		this.body.allowGravity = false;
		this.animations.play("death");
	}

	if (this.body.touching.down || this.body.blocked.down) {
		this.jumpCount = 0;
	}

	this.healthbar.bgSprite.x = this.body.x+7;
	this.healthbar.barSprite.x = this.body.x+2;
	this.healthbar.bgSprite.y = this.body.y-12;
	this.healthbar.barSprite.y = this.body.y-12;
};

Hero.prototype.hit = function(enemy) {
	if (this.dying) {
		return;
	}

	if (!this.invincible) {
		this.invincible = !this.invincible;
		this.health -= enemy.damage;
		this.healthbar.barSprite.width -= enemy.damage * .5;
		this.game.time.events.add(1000, this.toggleInvincible, this);
	}

	if (this.health < 1) {
		this.dying = true;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
		this.body.allowGravity = false;
		this.animations.play("death");
	}
}

Hero.prototype.toggleInvincible = function() {
	this.invincible = !this.invincible;
}

Hero.prototype.death = function() {
	this.exists = false;
	this.healthbar.kill();
	this.game.state.start('Main');
}

export default Hero;