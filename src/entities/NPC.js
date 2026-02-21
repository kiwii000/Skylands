export class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, name) {
    super(scene, x, y, 'npc');
    this.name = name;
    this.dialogue = `I'm ${name}. Keeping the city warm in this cold chrome world.`;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.target = new Phaser.Math.Vector2(x, y);
    this.timer = 0;
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0 || Phaser.Math.Distance.BetweenPoints(this, this.target) < 8) {
      this.target.set(this.x + Phaser.Math.Between(-64,64), this.y + Phaser.Math.Between(-64,64));
      this.timer = Phaser.Math.Between(1200, 2600);
    }
    this.scene.physics.moveTo(this, this.target.x, this.target.y, 35);
  }
}
