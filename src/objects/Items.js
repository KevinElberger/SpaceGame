var Star = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'starlight');
	this.anchor.setTo(0.5, 0.5);
}

Star.prototype = Object.create(Phaser.Sprite.prototype);
Star.prototype.constructor = Star;

function Chest(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'chest');
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.body.immovable = true;

	let anim = this.animations.add('hitLeft', [1,2,3,4,5,6], 17, false);
	anim.onComplete.add(function() { this.exists = false; }, this);
	this.items = [];
	this.frame = 0;
}

Chest.prototype = Object.create(Phaser.Sprite.prototype);
Chest.prototype.constructor = Chest;

function Platform(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'platform');
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor.set(0.5, 0.5);
	this.enableBody = true;
	this.body.collideWorldBounds = true;
	this.body.allowGravity = false;
	this.body.immovable = true;
	this.body.moves = true;
}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

function Door(game, x, y, teleportX, teleportY) {
	Phaser.Sprite.call(this, game, x, y, 'door');
	this.anchor.set(0.5, 0.5);
	this.enableBody = true;
	this.game.physics.enable(this);
	this.body.allowGravity = false;
	this.body.immovable = true;

	this.teleportX = teleportX;
	this.teleportY = teleportY;
}

Door.prototype = Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

function Item(game, x, y, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);
	this.anchor.set(0.5, 0.5);
	this.enableBody = true;
	this.game.physics.enable(this);
	this.body.allowGravity = false;
	this.body.immovable = true;
	this.frame = 0;

	let anim = this.animations.add('powerUp', [1,2,3,4], 14, false);
	anim.onComplete.add(function() { this.exists = false; }, this);

	this.name = sprite;
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

export { 
    Star,
    Chest,
    Platform,
    Door,
    Item
}