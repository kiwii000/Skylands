import { ITEM_DEFS } from '../data/items';

export class Hud {
  constructor(scene, state) {
    this.scene = scene;
    this.state = state;
    this.dragIndex = null;
    this.container = scene.add.container(8, 8).setScrollFactor(0).setDepth(1000);
    this.bg = scene.add.rectangle(0, 0, 360, 136, 0x101820, 0.88).setOrigin(0).setStrokeStyle(2, 0x5ec8ff);
    this.info = scene.add.text(8, 6, '', { fontFamily: 'monospace', color: '#d9f3ff', fontSize: '14px' });
    this.slots = [];
    for (let i = 0; i < 24; i++) {
      const x = 8 + (i % 8) * 42;
      const y = 30 + Math.floor(i / 8) * 34;
      const r = scene.add.rectangle(x, y, 32, 26, 0x223042).setOrigin(0).setInteractive();
      const t = scene.add.text(x + 4, y + 5, '', { fontFamily: 'monospace', color: '#fff', fontSize: '10px' });
      r.on('pointerdown', () => this.onSlot(i));
      this.slots.push({ r, t });
      this.container.add([r, t]);
    }
    this.container.add([this.bg, this.info]);
    this.msg = scene.add.text(8, 150, '', { fontFamily: 'monospace', color: '#fff7c0', fontSize: '14px', backgroundColor: '#00000066' }).setScrollFactor(0).setDepth(1000);
  }

  onSlot(i) {
    if (this.dragIndex === null) this.dragIndex = i;
    else {
      [this.state.inventory[this.dragIndex], this.state.inventory[i]] = [this.state.inventory[i], this.state.inventory[this.dragIndex]];
      this.dragIndex = null;
    }
    this.state.hotbarIndex = i < 8 ? i : this.state.hotbarIndex;
  }

  toast(text) {
    this.msg.setText(text);
    this.scene.time.delayedCall(1400, () => this.msg.setText(''));
  }

  render() {
    this.info.setText(`Day ${this.state.day}  W${this.state.weekDay}  ${this.state.timeText}  Gold ${this.state.gold}  HP ${this.state.hp}/${this.state.maxHp}  Water ${this.state.water}/${this.state.waterCapacity}`);
    this.slots.forEach((s, i) => {
      const slot = this.state.inventory[i];
      s.r.setStrokeStyle(i === this.state.hotbarIndex ? 2 : 1, i === this.dragIndex ? 0xff5f8c : 0x79f3ff);
      if (slot) s.t.setText(`${ITEM_DEFS[slot.id].name.slice(0,6)} ${slot.count}`);
      else s.t.setText('');
    });
  }
}
