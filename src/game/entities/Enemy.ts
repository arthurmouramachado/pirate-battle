import {
  Container,
  Sprite,
  Texture,
} from "pixi.js";

export type EnemyType =
  | "chaser"
  | "shooter";

export class Enemy extends Container {
  type: EnemyType;

  health: number;
  maxHealth: number;

  speed: number;

  collisionRadius = 30;

  private sprite: Sprite;

  private healthBar: Container;
  private healthFrame: Sprite;
  private healthFill: Sprite;

  private healthGreenTexture: Texture;
  private healthRedTexture: Texture;

  constructor(
    type: EnemyType,
    texture: Texture,
    health: number,
    speed: number,
    healthFrameTexture: Texture,
    healthGreenTexture: Texture,
    healthRedTexture: Texture,
  ) {
    super();

    this.type = type;
    this.health = health;
    this.maxHealth = health;
    this.speed = speed;

    this.sprite = new Sprite(texture);

    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.6);

    this.healthGreenTexture =
      healthGreenTexture;

    this.healthRedTexture =
      healthRedTexture;

    this.healthBar =
      new Container();

    this.healthFrame =
      new Sprite(healthFrameTexture);

    this.healthFill =
      new Sprite(healthGreenTexture);

    this.healthFrame.anchor.set(0.5);
    this.healthFill.anchor.set(0.5);

    this.healthFrame.scale.set(0.5);
    this.healthFill.scale.set(0.5);

    this.healthBar.y = -55;

    this.healthBar.addChild(
      this.healthFill,
      this.healthFrame,
    );

    this.addChild(
      this.sprite,
      this.healthBar,
    );
  }

  takeDamage(amount: number) {
    this.health = Math.max(
      0,
      this.health - amount,
    );

    this.updateHealthBar();
  }

  private updateHealthBar() {
    const healthPercentage =
      this.health / this.maxHealth;

    this.healthFill.scale.x =
      0.5 * healthPercentage;

    if (healthPercentage > 0.3) {
      this.healthFill.texture =
        this.healthGreenTexture;
    } else {
      this.healthFill.texture =
        this.healthRedTexture;
    }
  }
}