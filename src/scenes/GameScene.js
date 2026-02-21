import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { Hud } from '../ui/Hud';
import { ITEM_DEFS } from '../data/items';
import { makeTextures } from '../utils/textureFactory';
import { gameState } from '../systems/stateSingleton';

const TILE = 32;

export class GameScene extends Phaser.Scene {
  constructor() { super('game'); }


  create() {
    this.state = gameState;
    makeTextures(this);
    this.mapKey = 'city';
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('E,F,M,C,ONE,TWO,THREE,FOUR,FIVE,S');
    this.world = this.physics.add.staticGroup();
    this.dynamicNodes = this.physics.add.group();
    this.npcs = this.physics.add.group();
    this.cropSprites = new Map();

    this.buildMaps();
    this.player = new Player(this, 8 * TILE, 8 * TILE, this.state);
    this.cameras.main.startFollow(this.player, true, 0.2, 0.2).setZoom(1.2);
    this.physics.add.collider(this.player, this.world);
    this.physics.add.overlap(this.player, this.dynamicNodes, (_, n) => this.nearNode = n);
    this.physics.add.overlap(this.player, this.npcs, (_, n) => this.nearNpc = n);

    this.hud = new Hud(this, this.state);
    this.prompt = this.add.text(8, 170, '', { fontFamily: 'monospace', color: '#e4fbff', backgroundColor: '#0008', fontSize: '14px' }).setScrollFactor(0).setDepth(1000);
    this.highlight = this.add.rectangle(0, 0, TILE, TILE).setStrokeStyle(2, 0xf4ff75).setOrigin(0).setVisible(false);
    this.night = this.add.rectangle(0,0,5000,5000,0x081320,0).setOrigin(0).setDepth(500).setScrollFactor(0);

    this.time.addEvent({ delay: 1000, loop: true, callback: () => this.advanceTime() });
    this.input.on('pointerdown', () => this.onAction());
    this.spawnNpcs();
    this.renderFurniture();
  }

  buildMaps() {
    this.locations = {
      city: this.buildArea(40, 26, 'tile-metal', 0x1a212a),
      farm: this.buildArea(36, 26, 'tile-soil', 0x2c4030),
      mine: this.buildArea(36, 26, 'tile-mine', 0x1f1a1a),
      shop: this.buildArea(28, 20, 'tile-metal', 0x2a252f),
      blacksmith: this.buildArea(28, 20, 'tile-metal', 0x2f2a25),
      jewelry: this.buildArea(28, 20, 'tile-metal', 0x252a30),
      furniture: this.buildArea(28, 20, 'tile-metal', 0x20302a),
      med: this.buildArea(28, 20, 'tile-metal', 0x1f2f34)
    };

    for (let x = 0; x < 36; x++) this.placeTile('farm', x, 10, 'tile-water');
    this.addNode('farm', 30, 6, 'tree', 'tree'); this.addNode('farm', 32, 7, 'tree', 'tree');
    this.addNode('mine', 10, 8, 'ore', 'ore'); this.addNode('mine', 15, 12, 'scrapnode', 'scrap'); this.addNode('mine', 20, 6, 'ore', 'ore');

    for (let y = 2; y < 22; y += 3) for (let x = 2; x < 38; x += 4) this.addDecor('city', x, y, ['furniture-lamp','furniture-poster','furniture-crate'][Math.floor(Math.random()*3)]);

    this.portals = [
      { from:'city', x:2, y:2, to:'farm', tx:2, ty:2, label:'To Farm' },
      { from:'farm', x:1, y:1, to:'city', tx:3, ty:3, label:'To City' },
      { from:'city', x:36, y:2, to:'mine', tx:2, ty:2, label:'To Undercroft' },
      { from:'mine', x:1, y:1, to:'city', tx:34, ty:3, label:'To City' },
      { from:'city', x:8, y:20, to:'shop', tx:5, ty:17, label:'General Shop' },
      { from:'city', x:12, y:20, to:'blacksmith', tx:5, ty:17, label:'Blacksmith' },
      { from:'city', x:16, y:20, to:'jewelry', tx:5, ty:17, label:'Jewelry' },
      { from:'city', x:20, y:20, to:'furniture', tx:5, ty:17, label:'Furniture Shop' },
      { from:'city', x:24, y:20, to:'med', tx:5, ty:17, label:'Medical Center' },
      ...['shop','blacksmith','jewelry','furniture','med'].map(id => ({ from:id, x:2, y:17, to:'city', tx:10, ty:19, label:'Exit'}))
    ];
    this.switchMap('city', 8*TILE, 8*TILE);
  }

  buildArea(w, h, tileKey, tint) {
    const c = this.add.container(0, 0).setVisible(false);
    c.bg = this.add.rectangle(0, 0, w*TILE, h*TILE, tint).setOrigin(0);
    c.add(c.bg);
    c.tiles = new Map();
    for (let y=0;y<h;y++) for (let x=0;x<w;x++) this.placeTileObj(c, x, y, tileKey);
    c.w=w; c.h=h;
    return c;
  }

  placeTileObj(container, x, y, key) {
    const s = this.add.image(x*TILE, y*TILE, key).setOrigin(0);
    container.add(s);
    container.tiles.set(`${x},${y}`, s);
  }
  placeTile(map, x, y, key){ this.locations[map]?.tiles.get(`${x},${y}`)?.setTexture(key); }
  addDecor(map, x, y, key){ const s=this.add.image(x*TILE,y*TILE,key).setOrigin(0); this.locations[map].add(s); }

  addNode(map, x, y, key, kind) {
    const n = this.dynamicNodes.create(x*TILE+16, y*TILE+16, key);
    n.map = map; n.kind = kind; n.tileX = x; n.tileY = y;
  }

  spawnNpcs() {
    ['Mira','Forge','Lumen','Yori'].forEach((n,i) => {
      const npc = new NPC(this, (10+i*2)*TILE, 10*TILE, n);
      npc.map='city';
      this.npcs.add(npc);
    });
  }

  renderFurniture() {
    Object.entries(this.state.placedFurniture).forEach(([map, items]) => {
      items.forEach(f => {
        const sprite = this.add.image(f.x*TILE, f.y*TILE, `furniture-${f.id==='lamp'?'lamp':f.id==='poster'?'poster':'crate'}`).setOrigin(0);
        sprite.map = map;
      });
    });
  }

  switchMap(map, px, py) {
    this.mapKey = map;
    Object.entries(this.locations).forEach(([k,c]) => c.setVisible(k===map));
    this.dynamicNodes.children.each(n => n.setVisible(n.map===map).setActive(n.map===map));
    this.npcs.children.each(n => n.setVisible(n.map===map).setActive(n.map===map));
    this.children.list.forEach(o => { if (o.map) o.setVisible(o.map===map); });
    if (this.player) this.player.setPosition(px, py);
    this.physics.world.setBounds(0,0,this.locations[map].w*TILE,this.locations[map].h*TILE);
  }

  advanceTime() {
    this.state.tick(10);
    const h = this.state.time/60;
    const alpha = h < 6 || h > 20 ? 0.45 : h < 8 ? 0.2 : h > 18 ? 0.25 : 0;
    this.night.setAlpha(alpha);
    if (this.state.time >= 3*60 && this.state.time < 3*60+10) {
      this.hud.toast('You passed out and wake at 06:00');
      this.sleep();
    }
    this.refreshCrops();
  }

  sleep() {
    this.state.time = 6*60;
    this.state.onNewDay();
    this.switchMap('farm', 4*TILE, 4*TILE);
  }

  onAction() {
    const tx = Math.floor(this.player.x / TILE), ty = Math.floor(this.player.y / TILE);
    const slot = this.state.selectedItem();
    if (this.mapKey === 'farm') {
      const k = `${tx},${ty}`;
      const plot = this.state.farmPlots.get(k) ?? { tilled:false, planted:false, watered:false, stage:0 };
      if (!plot.tilled) {
        plot.tilled = true; this.placeTile('farm', tx, ty, 'tile-tilled'); this.state.farmPlots.set(k, plot); return;
      }
      if (slot?.id === 'seed' && plot.tilled && !plot.planted) {
        this.state.removeItem('seed',1); plot.planted=true; plot.stage=0; this.state.farmPlots.set(k,plot); this.refreshCrop(tx,ty,plot); return;
      }
      if (plot.planted && !plot.watered && this.state.water > 0) {
        this.state.water--; plot.watered=true; this.state.farmPlots.set(k,plot); return;
      }
      if (plot.stage >= 3) {
        plot.planted=false; plot.stage=0; this.state.addItem('crop',1); this.refreshCrop(tx,ty,plot); return;
      }
      if (this.locations.farm.tiles.get(`${tx},${ty}`)?.texture.key === 'tile-water') { this.state.water=this.state.waterCapacity; this.hud.toast('Water refilled'); }
    }

    if (this.nearNode && Phaser.Math.Distance.Between(this.player.x,this.player.y,this.nearNode.x,this.nearNode.y)<42) {
      if (this.nearNode.kind==='tree') this.state.addItem('wood',3);
      if (this.nearNode.kind==='ore') this.state.addItem('ore',2);
      if (this.nearNode.kind==='scrap') this.state.addItem('scrap',3);
      this.nearNode.destroy();
    }

    if (slot && ITEM_DEFS[slot.id].type==='furniture') {
      this.state.removeItem(slot.id,1);
      this.state.placedFurniture[this.mapKey].push({id:slot.id,x:tx,y:ty});
      const key = slot.id==='lamp'?'furniture-lamp':slot.id==='poster'?'furniture-poster':'furniture-crate';
      const s=this.add.image(tx*TILE,ty*TILE,key).setOrigin(0); s.map=this.mapKey;
    }
  }

  refreshCrops() {
    for (const [k,plot] of this.state.farmPlots.entries()) {
      const [x,y]=k.split(',').map(Number);
      this.refreshCrop(x,y,plot);
    }
  }

  refreshCrop(x,y,plot){
    const key=`${x},${y}`;
    if (this.cropSprites.has(key)) this.cropSprites.get(key).destroy();
    if (!plot.planted) return;
    const s=this.add.image(x*TILE,y*TILE,`crop${plot.stage}`).setOrigin(0); s.map='farm'; this.cropSprites.set(key,s);
  }

  handleInteractions() {
    this.prompt.setText('');
    this.nearNpc = null;
    const portal = this.portals.find(p => p.from===this.mapKey && Math.abs(p.x*TILE-this.player.x)<20 && Math.abs(p.y*TILE-this.player.y)<20);
    if (portal) {
      this.prompt.setText(`[E] ${portal.label}`);
      if (Phaser.Input.Keyboard.JustDown(this.keys.E)) this.switchMap(portal.to, portal.tx*TILE, portal.ty*TILE);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.S) && this.mapKey==='farm') this.sleep();
    if (Phaser.Input.Keyboard.JustDown(this.keys.C) && this.mapKey==='city' && (this.state.weekDay===2||this.state.weekDay===6)) {
      this.state.cartStock.forEach(i => { if (this.state.gold>=i.price) { this.state.gold-=i.price; this.state.addItem(i.id,1);} });
      this.hud.toast('Traveling cart traded.');
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.ONE)) this.state.hotbarIndex=0;
    if (Phaser.Input.Keyboard.JustDown(this.keys.TWO)) this.state.hotbarIndex=1;
    if (Phaser.Input.Keyboard.JustDown(this.keys.THREE)) this.state.hotbarIndex=2;
    if (Phaser.Input.Keyboard.JustDown(this.keys.FOUR)) this.state.hotbarIndex=3;
    if (Phaser.Input.Keyboard.JustDown(this.keys.FIVE)) this.state.hotbarIndex=4;

    const sel = this.state.selectedItem();
    if (Phaser.Input.Keyboard.JustDown(this.keys.F) && sel) {
      this.state.shippingBin.push({id: sel.id, count: 1});
      this.state.removeItem(sel.id, 1);
      this.hud.toast(`${sel.id} added to shipping bin`);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.M) && this.mapKey==='jewelry') {
      this.state.equipRing(0, this.state.inventory.findIndex(s => s?.id==='speedRing'));
      this.state.equipRing(1, this.state.inventory.findIndex(s => s?.id==='hpRing'));
      this.hud.toast('Rings equipped from inventory slots when present');
    }

    this.npcs.children.each(n => {
      if (n.map===this.mapKey && Phaser.Math.Distance.Between(this.player.x,this.player.y,n.x,n.y)<30) {
        this.prompt.setText(`[E] Talk to ${n.name}`);
        if (Phaser.Input.Keyboard.JustDown(this.keys.E)) this.hud.toast(`${n.dialogue} ♥`);
      }
    });
    const pointer = this.input.activePointer;
    const wx = pointer.worldX, wy = pointer.worldY;
    const tx=Math.floor(wx/TILE), ty=Math.floor(wy/TILE);
    this.highlight.setPosition(tx*TILE, ty*TILE).setVisible(true);
  }

  update(_, dt) {
    this.player.update(this.cursors);
    this.npcs.children.each(n => { if (n.map===this.mapKey) n.update(dt); else n.setVelocity(0); });
    this.handleInteractions();
    this.hud.render();
  }
}
