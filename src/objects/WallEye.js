import Enemy from 'objects/Enemy'

class WallEye extends Enemy {
    constructor(game, x, y) {
        super(game, x, y, 'wallEye');

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.allowGravity = false;
        this.body.immovable = true;
		this.anchor.set(0.5, 0.5);
		this.enableBody = true;

        this.animations.add('shoot', [0,1,2], 5, true);
        let anim = this.animations.add('death', [3,4,5], 6, false);
		anim.onComplete.add(this.death, this);

        this.barConfig = {x: this.body.x, y: this.body.y-12, width: this.health * 2, height: 4};
		this.healthbar = new HealthBar(this.game, this.barConfig);

        this.vision = 40 ;
        this.bulletTime = 0;
    }

    update() {
        if (this.dying) {
            return;
        }

		this.healthbar.bgSprite.x = this.body.x+7;
		this.healthbar.barSprite.x = this.body.x+2;
    }

    createProjectile() {
        this.projectiles = this.game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
		this.projectiles.setAll('velocity.y', 0);

		for (var i = 0; i < 64; i++) {
			var b = this.projectiles.create(0, 0, 'eyeProjectile');
			b.name = 'projectile' + i;
			b.exists = false;
			b.visible = false;
			b.damage = 2;
			b.checkWorldBounds = true;
			b.events.onOutOfBounds.add(this.resetProjectiles, this);
			b.body.allowGravity = false;
		}
    }

    fireProjectile() {
        if (this.dying) {
            return;
        }

		if (this.game.time.now > this.bulletTime) {
			this.projectile = this.projectiles.getFirstExists(false);

			if (this.projectile) {
				this.projectile.body.velocity.y = 0;
                this.projectile.reset(this.x-5, this.y-10);
                this.projectile.body.velocity.x = -100;

				this.bulletTime = this.game.time.now + 1300;
			}
		}
    }

    resetProjectiles() {
        if (this.projectile) {
            this.projectile.kill();
        }
    }

    death() {
		this.exists = false;
		this.healthbar.kill();
	}
}

export default WallEye;