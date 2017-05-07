import Hero from 'objects/Hero'
import Robot from 'objects/Robot'
import WallEye from 'objects/WallEye'
import CollisionHandler from 'objects/CollisionHandler'
import {Star, Chest, Platform, Door, Item} from 'objects/Items'

class Game extends Phaser.State {

	constructor() {
		super(500, 400, Phaser.AUTO, 'content', null);
		this.bulletTime = 0;
		this.bullets;
	}

	preload() {
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		this.game.load.tilemap('level1', 'data/level1.json', null, Phaser.Tilemap.TILED_JSON);

		this.game.load.image('starlight', 'assets/starlight.png');
		this.game.load.image('platform', 'assets/platform.png');
		this.game.load.image('door', 'assets/door.png');
		this.game.load.image('tiles', 'assets/level1_platform_tileset.png', 16, 16);
		this.game.load.spritesheet('jetpack', 'assets/jetpack.png', 16, 16, 5);
		this.game.load.spritesheet('chest', 'assets/chest.png', 16, 16, 7);
		this.load.spritesheet('dude', 'assets/hero.png', 16, 16, 19);
		this.load.spritesheet('dude_jetpack', 'assets/hero_jet.png', 16, 16, 29);
		this.game.load.spritesheet('wallEye', 'assets/wallEye.png', 16, 16, 6);
		this.load.spritesheet('robot', 'assets/robot1.png', 16, 16, 8);
		this.game.load.image('bullet', 'assets/bullet.png');
		this.game.load.image('eyeProjectile', 'assets/eyeProjectile.png');

		this.game.stage.backgroundColor = '#FFF';
	}

	create() {
		this._createWorld();

		this.game.stage.smoothed = true;
		this.game.renderer.renderSession.roundPixels = true;

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
		this.jumpChecker = this.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.jumpChecker.onDown.add(this.doubleJump, this);

		this._loadLevel();
		this.createBullets();
		this.createEnemyProjectiles();
		this.createStarLight();
	}

	createStarLight() {
		this.STAR_LIGHT_RADIUS = 50;
		this.light = this.game.add.group();
		this.light.add(new Star(this.game, 134, 258));

		this.shadowTexture = this.game.add.bitmapData(this.game.width+10, this.game.height+10);
		this.lightSprite = this.game.add.image(this.light.x, this.light.y, this.shadowTexture);
		this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
		this.lightSprite.fixedToCamera = false;
	}

	_createWorld() {
		this.game.world.setBounds(0, 0, 1088, 336);

		this.map = this.game.add.tilemap('level1');
		this.map.addTilesetImage('level1', 'tiles');
		this.backgroundLayer = this.map.createLayer('Background');
		this.blockedLayer = this.map.createLayer('Blockable');
		this.map.setCollisionBetween(1, 100, true, 'Blockable');
	}

	update() {
		this.chaseHero();
		this.fireEnemyProjectile(); 		
		this.lightSprite.reset(this.game.camera.x, this.game.camera.y);
		this.game.world.bringToTop(this.hero);
		this.updateShadowTexture();
		this.updateStarShadowTexture();
		CollisionHandler.handleCollisions(this);
		this._handleInput();
		this.platforms.forEach(this.movePlatforms, this);
	}

	movePlatforms(platform) {
		if (platform.direction === 'horizontal'){
			if (platform.body.x > platform.body.sprite.rightbounds) {  
				platform.body.velocity.x = -1 * platform.body.velocity.x;
			} else if (platform.body.x < platform.body.sprite.leftbounds) {  
				platform.body.velocity.x = -1 * platform.body.velocity.x;
			} 
		}
	}

	createEnemyProjectiles() {
		this.projectiles = this.game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
		this.projectiles.setAll('velocity.y', 0);

		for (var i = 0; i < 30; i++) {
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

	resetProjectiles() {
        if (this.projectile) {
            this.projectile.kill();
        }
    }

	fireEnemyProjectile() {
		this.wallEyes.forEach(function(wallEye) {
			let heroInFiringRange = this.hero.x - wallEye.x < 50 && this.hero.y - wallEye.y < 18;

		    if (wallEye.dying) {
            	return;
        	}
			
			if (heroInFiringRange && this.game.time.now > wallEye.bulletTime) {
				this.projectile = this.projectiles.getFirstExists(false);

				if (this.projectile) {
					this.projectile.body.velocity.y = 0;
					this.projectile.reset(wallEye.x-5, wallEye.y-10);
					this.projectile.body.velocity.x = -100;
					wallEye.bulletTime = this.game.time.now + 1300;
				}
			}
		}, this);
    }

	doubleJump() {
		if (this.hero.body.touching.down || this.hero.body.blocked.down) {
			this.hero.jumpCount = 0;
		}
		if (this.hero.jumpCount < this.hero.jumpMax) {
			this.hero.jump();
			this.hero.jumpCount++;
		}
	}

	chaseHero() {
		this.robot.forEach(function(robot) {
			if (robot.dying) {
				return;
			}
			if (Math.round(robot.y) === Math.round(this.hero.y)) {
				if (Math.round(this.hero.x) > Math.round(robot.x)) {
					robot.animations.play('right');
					robot.body.velocity.x = 75;
				} else {
					robot.animations.play('left');
					robot.body.velocity.x = -75;
				}
				robot.chasing = true;
			}
		}, this);
	}

	createBullets() {
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.setAll('velocity.y', 0);

		for (var i = 0; i < 64; i++) {
			var b = this.bullets.create(0, 0, 'bullet');
			b.name = 'bullet' + i;
			b.exists = false;
			b.visible = false;
			b.damage = 2;
			b.checkWorldBounds = true;
			b.events.onOutOfBounds.add(this.resetBullet, this);
			b.body.allowGravity = false;
		}
	}

	fireBullet() {
		if (this.game.time.now > this.bulletTime) {
			this.bullet = this.bullets.getFirstExists(false);

			if (this.bullet) {
				this.bullet.body.velocity.y = 0;
				if (this.hero.body.velocity.x >= 0) {
					this.bullet.reset(this.hero.x+5, this.hero.y-8);
					this.bullet.body.velocity.x = 500;
				} else {
					this.bullet.reset(this.hero.x-15, this.hero.y-8);
					this.bullet.body.velocity.x = -500;
				}
				this.bulletTime = this.game.time.now + 150;
			}
		}
	}

	resetBullet() {
		if (this.bullet) {
			this.bullet.kill();
		}
	}

	updateStarShadowTexture() {
		this.shadowTexture.context.fillStyle = 'rgb(100,100,100)';
		
		var radius = this.STAR_LIGHT_RADIUS + this.game.rnd.integerInRange(1,4),
			lightX = this.light.children[0].x - this.game.camera.x,
			lightY = this.light.children[0].y - this.game.camera.y;

		this.light.forEach(function(light) {
			var gradient = this.shadowTexture.context.createRadialGradient(
				lightX, lightY, this.STAR_LIGHT_RADIUS * .75,
				lightX, lightY, radius);
			gradient.addColorStop(0, 'rgba(185,181,217,1.0)');
			gradient.addColorStop(1, 'rgba(185,181,217,0.0)');

			this.shadowTexture.context.beginPath();
			this.shadowTexture.context.fillStyle = gradient;
			this.shadowTexture.context.arc(lightX, lightY, radius, 0, Math.PI*2);
			this.shadowTexture.context.fill();
		}, this);

		this.shadowTexture.dirty = true;
	}

	updateShadowTexture() {
		this.shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
		this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

		var radius = 100 + this.game.rnd.integerInRange(1,20),
			heroX = this.hero.x - this.game.camera.x,
			heroY = this.hero.y - this.game.camera.y;

		var gradient = this.shadowTexture.context.createRadialGradient(
				heroX, heroY, 100 * 0.75,
				heroX, heroY, radius);
			gradient.addColorStop(0, 'rgba(220, 220, 220, 1.0)');
			gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

			this.shadowTexture.context.beginPath();
			this.shadowTexture.context.fillStyle = gradient;
			this.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI*2, false);
			this.shadowTexture.context.fill();

			this.shadowTexture.dirty = true;
	}

	_handleInput() {
		if (this.hero.dying) { return; }

		if (this.cursors.left.isDown && !this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.decideWhichAnimationToPlay();
			this.hero.move(-1);
		}
		else if (this.cursors.right.isDown && !this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.decideWhichAnimationToPlay();
			this.hero.move(1);
		}
		else if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.fireBullet();
			this.hero.body.velocity.x >= 0 ? this.hero.animations.play('shootRight') : this.hero.animations.play('shootLeft');
		}
		else {
			if (!this.hero.dying) {
				this.hero.frame = 0;
				this.hero.move(0);
			}
		}
		if (this.cursors.up.isDown) {
			this.decideWhichAnimationToPlay();
		} 
	}

	decideWhichAnimationToPlay() {
		if (this.cursors.left.isDown && this.hero.body.blocked.down || this.hero.body.touching.down) {
			this.hero.animations.play('left');
		}
		else if (this.cursors.right.isDown && this.hero.body.blocked.down || this.hero.body.touching.down) {
			this.hero.animations.play('right');
		}
		else if (this.cursors.up.isDown) {
			if (this.hero.body.velocity.y >= 0 && !this.hero.body.blocked.down && !this.hero.body.touching.down && (this.hero.body.velocity.x > 0 || this.hero.body.velocity.x < 0)) {
				this.hero.body.velocity.x >= 0 ? this.hero.animations.play('fallRight') : this.hero.animations.play('fallLeft');
			} else if (this.hero.body.velocity.y < 0 && !this.hero.body.blocked.down && (this.hero.body.velocity.x < 0 || this.hero.body.velocity.x > 0)) {
				this.hero.body.velocity.x >= 0 ? this.hero.animations.play('jumpRight') : this.hero.animations.play('jumpLeft');
			}
		} 
		else if (this.hero.body.velocity.y >= 0 && !this.hero.body.blocked.down && !this.hero.body.touching.down) {
			this.hero.body.velocity.x >= 0 ? this.hero.animations.play('fallRight') : this.hero.animations.play('fallLeft');
		}
		else if (this.hero.body.velocity.y < 0 && !this.hero.body.blocked.down) {
			this.hero.body.velocity.x >= 0 ? this.hero.animations.play('jumpRight') : this.hero.animations.play('jumpLeft');
		}
	}

	_loadLevel() {
		const GRAVITY = 130;
		
		this._spawnCharacters({"hero": {"x": 100, "y": 230}});
		this._spawnPlatforms();
		this._spawnEnemies();
		this._spawnChests();
		this._spawnDoors();
		this._spawnItems();
		this.game.physics.arcade.gravity.y = GRAVITY;
		this.game.physics.enable(this.blockedLayer);
	}

	_spawnCharacters(data) {
		this.hero = new Hero(this.game, data.hero.x, data.hero.y);
		this.game.add.existing(this.hero);
		this.game.camera.follow(this.hero);
	}

	_spawnPlatforms() {
		this.platforms = this.game.add.group();

		let platform = new Platform(this.game, 500, 278, 'horizontal');
		platform.leftbounds = platform.body.x - 30;
		platform.rightbounds = platform.body.x + 100;
		this.platforms.add(platform);
		platform.body.velocity.x = 50;
	}

	_spawnEnemies() {
		this.robot = this.game.add.group();
		this.robot.add(new Robot(this.game, 200, 262));
		this.robot.enableBody = true;

		this.wallEyes = this.game.add.group();
		var wallEye1 = new WallEye(this.game, 250, 40);
		this.wallEyes.add(wallEye1);
		this.wallEyes.enableBody = true;
	}

	_spawnChests() {
		this.chests = this.game.add.group();
		this.chests.add(new Chest(this.game, 240, 262));
	}

	_spawnDoors() {
		this.doors = this.game.add.group();
		this.doors.add(new Door(this.game, 742, 264, 68, 100));
		this.doors.add(new Door(this.game, 58, 120, 752, 254));
		this.doors.enableBody = true;
	}

	_spawnItems() {
		this.items = this.game.add.group();
		this.items.add(new Item(this.game, 230, 120, 'jetpack'));
	}
}

export default Game;