export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, state) {
    super(scene, x, y, 'player');
    this.state = state;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  update(cursors) {
    const v = this.state.baseSpeed;
    let vx = 0, vy = 0;
    if (cursors.left.isDown) vx = -v;
    else if (cursors.right.isDown) vx = v;
    if (cursors.up.isDown) vy = -v;
    else if (cursors.down.isDown) vy = v;
    this.setVelocity(vx, vy);
    if (vx && vy) this.body.velocity.normalize().scale(v);
  }
}
