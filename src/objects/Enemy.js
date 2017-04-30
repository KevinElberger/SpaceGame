class Enemy extends Phaser.Sprite {
    constructor(game, x, y, sprite) {
        super(game, x, y, sprite)
    
    	this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.set(0.5, 0.5);
        this.enableBody = true;

        this.health = 5;
        this.damage = 2;
    }

	hit(bullet) {
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
}

export default Enemy