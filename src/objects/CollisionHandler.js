class CollisionHandler {
    static handleCollisions(gamestate) {
		var that = gamestate;

		gamestate.game.physics.arcade.overlap(gamestate.hero, gamestate.doors, function(hero, door) {
			if (that.cursors.down.isDown) {
				hero.body.static = true;
				hero.body.x = door.teleportX;
				hero.body.y = door.teleportY;
				hero.body.static = false;
			}
		});

		this.handleBlockedLayerCollisions(gamestate);
		this.handleEnemyHitHeroCollisions(gamestate);
		this.handleHeroHitEnemyCollisions(gamestate);
		
		gamestate.game.physics.arcade.collide(gamestate.hero, gamestate.chests);
		gamestate.game.physics.arcade.collide(gamestate.robot, gamestate.chests);

		gamestate.game.physics.arcade.overlap(gamestate.bullets, gamestate.chests, function(bullet, chest) {
			chest.animations.play('hitLeft');
			bullet.kill();
		});

		gamestate.game.physics.arcade.overlap(gamestate.hero, gamestate.items, function(hero, item) {
			if (item.name === "jetpack") {
				item.animations.play('powerUp');
				hero.upgrade();
			}
		});

		gamestate.game.physics.arcade.collide(gamestate.hero, gamestate.platforms, function(hero, platform) {
			if (hero.body.touching.down || hero.body.blocked.down) {
				hero.locked = true;
				platform.locked = true;
				hero.body.x = platform.body.x;
			}
		});

		gamestate.game.physics.arcade.collide(gamestate.hero, gamestate.projectiles, function(hero, projectile) {
			hero.hit(projectile);
			projectile.kill();
		});
	}

	static handleBlockedLayerCollisions(gamestate) {
		gamestate.game.physics.arcade.collide(gamestate.hero, gamestate.blockedLayer);
		gamestate.game.physics.arcade.collide(gamestate.robot, gamestate.blockedLayer);
		gamestate.game.physics.arcade.collide(gamestate.wallEyes, gamestate.blockedLayer);
		gamestate.game.physics.arcade.collide(gamestate.chests, gamestate.blockedLayer);
		gamestate.game.physics.arcade.collide(gamestate.platforms, gamestate.blockedLayer);
	}

	static handleEnemyHitHeroCollisions(gamestate) {
		gamestate.game.physics.arcade.collide(gamestate.hero, gamestate.robot, function(hero, robot) {
			hero.hit(robot);
		});

		gamestate.game.physics.arcade.collide(gamestate.hero, gamestate.wallEyes, function(hero, wallEye) {
			hero.hit(wallEye);
		});
	}

	static handleHeroHitEnemyCollisions(gamestate) {
		gamestate.game.physics.arcade.overlap(gamestate.bullets, gamestate.robot, function(bullet, robot) {
			robot.hit(bullet);
			bullet.kill();
		});

		gamestate.game.physics.arcade.overlap(gamestate.bullets, gamestate.wallEyes, function(bullet, wallEye) {
			wallEye.hit(bullet);
			bullet.kill();
		});
	}
}

export default CollisionHandler;