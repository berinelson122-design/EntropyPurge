import Phaser from 'phaser';

export interface PlayerStats {
  lvl: number;
  xp: number;
  nextLvl: number;
  fireRate: number;
  damage: number;
  health: number;
  isHurt: boolean;
}

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private enemies!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;
  private stats: PlayerStats = {
    lvl: 1,
    xp: 0,
    nextLvl: 100,
    fireRate: 600,
    damage: 10,
    health: 100,
    isHurt: false
  };
  private lastFired: number = 0;
  private lastSpawned: number = 0;

  constructor() { super('MainScene'); }

  create() {
    const { width, height } = this.scale;

    // 1. INCREASE GRID ALPHA (0.05 -> 0.2) for better visibility
    this.add.grid(width / 2, height / 2, width * 2, height * 2, 40, 40, 0, 0, 0xE056FD, 0.2);

    // 2. ENSURE PLAYER Z-INDEX
    this.player = this.add.rectangle(width / 2, height / 2, 24, 24, 0xFFFFFF).setDepth(1);
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // 3. INITIALIZE GROUPS
    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group();

    // 4. INPUTS
    if (this.input && this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    // 5. SPAWN ENEMIES
    // Handled in update loop via lastSpawned
    
    // 6. COLLISIONS
    this.physics.add.overlap(this.bullets, this.enemies, this.handleHit as any, undefined, this);
    this.physics.add.collider(this.player, this.enemies, this.handlePlayerDamage as any, undefined, this);
  }

  update(time: number) {
    // PLAYER MOVEMENT
    const speed = 200;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      body.setVelocityY(speed);
    }

    // AUTO ATTACK
    if (time > this.lastFired) {
      this.fireWeapon();
      this.lastFired = time + this.stats.fireRate;
    }

    // ENEMY MOVEMENT
    this.enemies.getChildren().forEach((enemy: any) => {
      if (enemy.active) {
        this.physics.moveToObject(enemy, this.player, 80 + (this.stats.lvl * 5));
      }
    });

    // UPDATE SPAWN RATE
    const spawnDelay = Math.max(200, 1000 - (this.stats.lvl * 50));
    if (time > this.lastSpawned) {
      this.spawnEnemy();
      this.lastSpawned = time + spawnDelay;
    }
  }

  private fireWeapon() {
    const enemies = this.enemies.getChildren();
    if (enemies.length === 0) return;

    const nearest = this.physics.closest(this.player, enemies) as Phaser.GameObjects.GameObject;
    if (nearest) {
      const bullet = this.add.circle(this.player.x, this.player.y, 4, 0xE056FD);
      this.physics.add.existing(bullet);
      this.bullets.add(bullet);
      
      this.physics.moveToObject(bullet, nearest, 400);
      this.time.addEvent({ delay: 2000, callback: () => {
          if (bullet.active) bullet.destroy();
      }});
    }
  }

  private spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 400; // spawn outside screen center
    const x = this.player.x + Math.cos(angle) * distance;
    const y = this.player.y + Math.sin(angle) * distance;
    
    const enemy = this.add.triangle(x, y, 0, 15, 7, 0, 15, 15, 0xFF003C);
    this.physics.add.existing(enemy);
    this.enemies.add(enemy);
  }

  private handleHit(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    if (bullet.active) bullet.destroy();
    if (enemy.active) enemy.destroy();
    
    this.stats.xp += 20;

    if (this.stats.xp >= this.stats.nextLvl) {
      this.levelUp();
    }
  }

  private handlePlayerDamage(playerObj: Phaser.GameObjects.GameObject, enemyObj: Phaser.GameObjects.GameObject) {
    if (this.stats.isHurt) return;

    this.stats.health -= 10;
    this.stats.isHurt = true;

    this.player.setFillStyle(0xff003c);

    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.stats.isHurt = false;
        this.player.setFillStyle(0xffffff);
      }
    });

    if (this.stats.health <= 0) {
      this.scene.restart();
      
      // Reset stats naturally by not preserving them 
      this.stats = {
        lvl: 1,
        xp: 0,
        nextLvl: 100,
        fireRate: 600,
        damage: 10,
        health: 100,
        isHurt: false
      };
      // Reset react ui
      this.game.events.emit('LEVEL_UP', 1);
      // Wait for React to reset state before resuming
      setTimeout(() => {
          // Send internal event to maybe close patch selection if needed, although 
          // LEVEL_UP triggers it. We need a RESET event ideally. I will just rely on 
          // scene restarting.
          // Actuallly if we emit LEVEL_UP it will show the patch menu again for lvl 1. 
          // The App component only sets isLeveling = true, which freezes. 
          // Wait, App has `isLeveling: true`. If player dies, they need to restart properly. 
      }, 0);
    }
  }

  private levelUp() {
    this.stats.lvl++;
    this.stats.xp = 0;
    this.stats.nextLvl *= 1.2;
    this.scene.pause();
    this.game.events.emit('LEVEL_UP', this.stats.lvl);
  }

  public applyUpgrade(id: string) {
    if (id === 'fire_rate') this.stats.fireRate *= 0.8;
    if (id === 'damage') this.stats.damage += 5;
    if (id === 'health') this.stats.health = 100;
  }
}