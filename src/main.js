import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: 1280,
  height: 720,
  pixelArt: true,
  backgroundColor: '#0f1116',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [GameScene]
});
