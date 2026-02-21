export const ITEM_DEFS = {
  wood: { id: 'wood', name: 'Wood', stack: 999, value: 8, type: 'resource' },
  scrap: { id: 'scrap', name: 'Scrap', stack: 999, value: 12, type: 'resource' },
  ore: { id: 'ore', name: 'Titan Ore', stack: 999, value: 20, type: 'resource' },
  seed: { id: 'seed', name: 'Glow Seed', stack: 999, value: 6, type: 'seed', cropId: 'glowRoot' },
  crop: { id: 'crop', name: 'Glow Root', stack: 999, value: 24, type: 'crop' },
  water: { id: 'water', name: 'Water', stack: 999, value: 0, type: 'resource' },
  speedRing: { id: 'speedRing', name: 'Current Ring', stack: 1, value: 340, type: 'ring', buff: { speed: 25 } },
  hpRing: { id: 'hpRing', name: 'Guard Ring', stack: 1, value: 320, type: 'ring', buff: { hp: 20 } },
  lamp: { id: 'lamp', name: 'Neon Lamp', stack: 32, value: 50, type: 'furniture', placement: 'floor' },
  poster: { id: 'poster', name: 'Wall Poster', stack: 32, value: 45, type: 'furniture', placement: 'wall' },
  crate: { id: 'crate', name: 'Storage Crate', stack: 32, value: 35, type: 'furniture', placement: 'floor' }
};

export const TRAVELING_CART_STOCK = ['speedRing', 'hpRing', 'poster', 'lamp', 'seed'];
