export function makeTextures(scene) {
  const t = scene.textures;
  if (t.exists('tile-metal')) return;
  const mk = (key, draw) => {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    draw(g);
    g.generateTexture(key, 32, 32);
    g.destroy();
  };
  mk('tile-metal', g => { g.fillStyle(0x4f5964).fillRect(0,0,32,32); g.lineStyle(1,0x6b7785).strokeRect(0,0,32,32); g.fillStyle(0x37414d).fillRect(8,8,16,4); });
  mk('tile-soil', g => { g.fillStyle(0x6a4a2a).fillRect(0,0,32,32); g.fillStyle(0x7f5b35).fillRect(2,4,5,4); g.fillRect(20,16,6,4); });
  mk('tile-tilled', g => { g.fillStyle(0x4a3218).fillRect(0,0,32,32); g.lineStyle(1,0x2f2010); for(let y=6;y<32;y+=6)g.lineBetween(0,y,32,y); });
  mk('tile-water', g => { g.fillStyle(0x2f6ea8).fillRect(0,0,32,32); g.fillStyle(0x4d8fd4).fillRect(2,6,10,4); g.fillRect(16,18,12,5); });
  mk('tile-mine', g => { g.fillStyle(0x3b3634).fillRect(0,0,32,32); g.fillStyle(0x55504d).fillRect(6,8,8,6); g.fillRect(18,16,7,6); });
  mk('tree', g => { g.fillStyle(0x6f4a25).fillRect(12,16,8,14); g.fillStyle(0x2d8f4f).fillRect(6,4,20,14); g.fillStyle(0x3da863).fillRect(10,2,12,6); });
  mk('ore', g => { g.fillStyle(0x525b66).fillRect(4,8,24,20); g.fillStyle(0x65c6d8).fillRect(10,14,4,4); g.fillRect(18,20,5,4); });
  mk('scrapnode', g => { g.fillStyle(0x757f8a).fillRect(6,10,20,16); g.fillStyle(0xbd8b4a).fillRect(8,14,7,3); g.fillRect(17,20,6,4); });
  mk('crop0', g => { g.fillStyle(0x4a3218).fillRect(0,0,32,32); g.fillStyle(0x34a44f).fillRect(14,18,4,6); });
  mk('crop1', g => { g.fillStyle(0x4a3218).fillRect(0,0,32,32); g.fillStyle(0x34a44f).fillRect(10,14,12,10); });
  mk('crop2', g => { g.fillStyle(0x4a3218).fillRect(0,0,32,32); g.fillStyle(0x5fcc72).fillRect(8,10,16,14); });
  mk('crop3', g => { g.fillStyle(0x4a3218).fillRect(0,0,32,32); g.fillStyle(0x9fe36f).fillRect(8,12,16,12); g.fillStyle(0xe7f08b).fillRect(12,8,8,6); });
  mk('player', g => { g.fillStyle(0x2f2f2f).fillRect(10,4,12,8); g.fillStyle(0x5be1ff).fillRect(8,12,16,12); g.fillStyle(0xeeeeee).fillRect(10,24,5,6); g.fillRect(17,24,5,6); });
  mk('npc', g => { g.fillStyle(0x57345f).fillRect(10,4,12,8); g.fillStyle(0xdd9076).fillRect(8,12,16,12); g.fillStyle(0xeeeeee).fillRect(10,24,5,6); g.fillRect(17,24,5,6); });
  mk('furniture-lamp', g => { g.fillStyle(0x303744).fillRect(13,6,6,20); g.fillStyle(0x79f3ff).fillRect(10,2,12,8); });
  mk('furniture-poster', g => { g.fillStyle(0x25303f).fillRect(6,4,20,24); g.fillStyle(0xff5f8c).fillRect(10,8,12,6); g.fillStyle(0x79f3ff).fillRect(10,16,10,8); });
  mk('furniture-crate', g => { g.fillStyle(0x8b6435).fillRect(5,8,22,18); g.lineStyle(2,0x5d3f1e).strokeRect(5,8,22,18); });
}
