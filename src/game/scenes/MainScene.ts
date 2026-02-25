import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private enemies!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;
  private stats = { lvl: 1, xp: 0, nextLvl: 100, fireRate: 600, damage: 10, health: 100 };
  private lastFired: number = 0;

  constructor() { super('MainScene'); }

  create() {
    const { width, height } = this.scale;
    // Background Grid
    this.add.grid(width / 2, height / 2, width * 2, height * 2, 40, 40, 0, 0, 0xE056FD, 0.05);

    this.player = this.add.rectangle(width / 2, height / 2, 24, 24, 0xFFFFFF);
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group();

    this.physics.add.overlap(this.bullets, this.enemies, (b, e) => this.handleHit(b, e));
    this.physics.add.overlap(this.player, this.enemies, () => this.handlePlayerDamage());

    this.time.addEvent({ delay: 800, callback: this.spawnEnemy, callbackScope: this, loop: true });
  }

  update(time: number) {
    if (time > this.lastFired) {
      this.fireWeapon();
      this.lastFired = time + this.stats.fireRate;
    }

    this.enemies.getChildren().forEach((enemy: any) => {
      if (enemy.active) {
        this.physics.moveToObject(enemy, this.player, 80 + (this.stats.lvl * 5));
      }
    });
  }

  private fireWeapon() {
    const nearest = this.physics.closest(this.player, this.enemies.getChildren());
    if (nearest) {
      const bullet = this.add.circle(this.player.x, this.player.y, 4, 0xE056FD);
      this.bullets.add(bullet);
      this.physics.moveToObject(bullet, nearest, 400);
      this.time.addEvent({ delay: 2000, callback: () => bullet.destroy() });
    }
  }

  private spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const x = this.player.x + Math.cos(angle) * 500;
    const y = this.player.y + Math.sin(angle) * 500;
    const enemy = this.add.triangle(x, y, 0, 15, 7, 0, 15, 15, 0xFF003C);
    this.enemies.add(enemy);
  }

  private handleHit(bullet: any, enemy: any) {
    bullet.destroy();
    enemy.destroy();
    this.stats.xp += 20;
    this.game.events.emit('UPDATE_XP', this.stats.xp);

    if (this.stats.xp >= this.stats.nextLvl) {
      this.levelUp();
    }
  }

  private handlePlayerDamage() {
    this.stats.health -= 0.5;
    this.game.events.emit('UPDATE_HEALTH', this.stats.health);
  }

  private levelUp() {
    this.stats.lvl++;
    this.stats.xp = 0;
    this.stats.nextLvl *= 1.2;
    this.scene.pause();
    this.game.events.emit('LEVEL_UP', this.stats.lvl);
  }

  applyUpgrade(id: string) {
    if (id === 'fire_rate') this.stats.fireRate *= 0.8;
    if (id === 'damage') this.stats.damage += 5;
    if (id === 'health') this.stats.health = 100;
    this.scene.resume();
  }
}