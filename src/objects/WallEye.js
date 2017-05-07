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

        this.bulletTime = 0;
    }

    update() {
        if (this.dying) {
            return;
        }

		this.healthbar.bgSprite.x = this.body.x+7;
		this.healthbar.barSprite.x = this.body.x+2;
    }

    death() {
		this.exists = false;
		this.healthbar.kill();
	}
}

export default WallEye;