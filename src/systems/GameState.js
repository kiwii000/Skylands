import { ITEM_DEFS, TRAVELING_CART_STOCK } from '../data/items';

export class GameState {
  constructor() {
    this.day = 1;
    this.weekDay = 1;
    this.time = 6 * 60;
    this.gold = 200;
    this.hp = 100;
    this.maxHp = 100;
    this.baseSpeed = 110;
    this.inventory = Array.from({ length: 24 }, () => null);
    this.hotbarIndex = 0;
    this.shippingBin = [];
    this.waterCapacity = 20;
    this.water = 20;
    this.equipped = [null, null];
    this.placedFurniture = { farm: [], city: [], mine: [], shop: [] };
    this.farmPlots = new Map();
    this.cartStock = [];
    this.addItem('seed', 12);
    this.addItem('lamp', 2);
    this.addItem('poster', 2);
    this.addItem('crate', 2);
  }

  tick(minutes) {
    this.time += minutes;
    if (this.time >= 24 * 60) {
      this.time -= 24 * 60;
      this.day++;
      this.weekDay = ((this.weekDay) % 7) + 1;
      this.onNewDay();
    }
  }

  onNewDay() {
    let sold = 0;
    this.shippingBin.forEach(({ id, count }) => sold += ITEM_DEFS[id].value * count);
    this.gold += sold;
    this.shippingBin = [];
    for (const [, plot] of this.farmPlots) {
      if (plot.planted && plot.watered && plot.stage < 3) plot.stage++;
      plot.watered = false;
    }
    this.refreshCart();
  }

  refreshCart() {
    const appears = this.weekDay === 2 || this.weekDay === 6;
    if (!appears) {
      this.cartStock = [];
      return;
    }
    this.cartStock = [...TRAVELING_CART_STOCK].sort(() => Math.random() - 0.5).slice(0, 3).map(id => ({ id, price: Math.floor(ITEM_DEFS[id].value * 1.6) }));
  }

  get timeText() {
    const h = Math.floor(this.time / 60);
    const m = this.time % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  addItem(id, count = 1) {
    let remaining = count;
    for (const slot of this.inventory) {
      if (slot?.id === id && slot.count < ITEM_DEFS[id].stack) {
        const add = Math.min(remaining, ITEM_DEFS[id].stack - slot.count);
        slot.count += add;
        remaining -= add;
      }
    }
    for (let i = 0; i < this.inventory.length && remaining > 0; i++) {
      if (!this.inventory[i]) {
        const add = Math.min(remaining, ITEM_DEFS[id].stack);
        this.inventory[i] = { id, count: add };
        remaining -= add;
      }
    }
    return remaining === 0;
  }

  removeItem(id, count = 1) {
    let remaining = count;
    for (const slot of this.inventory) {
      if (slot?.id === id && remaining > 0) {
        const take = Math.min(remaining, slot.count);
        slot.count -= take;
        remaining -= take;
        if (slot.count === 0) Object.assign(slot, { id: undefined, count: 0 });
      }
    }
    this.inventory = this.inventory.map(s => (s?.id ? s : null));
    return remaining === 0;
  }

  selectedItem() {
    return this.inventory[this.hotbarIndex];
  }

  equipRing(slotIndex, inventoryIndex) {
    const slot = this.inventory[inventoryIndex];
    if (!slot || ITEM_DEFS[slot.id].type !== 'ring') return;
    const prev = this.equipped[slotIndex];
    this.equipped[slotIndex] = slot.id;
    this.inventory[inventoryIndex] = prev ? { id: prev, count: 1 } : null;
    this.applyBuffs();
  }

  applyBuffs() {
    this.maxHp = 100;
    this.baseSpeed = 110;
    for (const ring of this.equipped) {
      if (!ring) continue;
      const buff = ITEM_DEFS[ring].buff;
      if (buff.hp) this.maxHp += buff.hp;
      if (buff.speed) this.baseSpeed += buff.speed;
    }
    this.hp = Math.min(this.hp, this.maxHp);
  }
}
