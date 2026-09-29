import {
  Container,
  Sprite,
  Texture,
} from "pixi.js";

export class Player extends Container {
  health = 100;
  maxHealth = 100;

  collisionRadius = 30;

  private shipSprite: Sprite;

  private healthBar: Container;
  private healthFrame: Sprite;
  private healthFill: Sprite;

  private healthGreenTexture: Texture;
  private healthAmberTexture: Texture;
  private healthRedTexture: Texture;

  private fireEffect: Sprite;

  constructor(
    shipTexture: Texture,
    fireTexture: Texture,
    healthFrameTexture: Texture,
    healthGreenTexture: Texture,
    healthAmberTexture: Texture,
    healthRedTexture: Texture,
  ) {
    super();

    this.shipSprite =
      new Sprite(shipTexture);

    this.shipSprite.anchor.set(0.5);
    this.shipSprite.scale.set(0.6);

    this.healthGreenTexture =
      healthGreenTexture;

    this.healthAmberTexture =
      healthAmberTexture;

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

    this.fireEffect =
      new Sprite(fireTexture);

    this.fireEffect.anchor.set(0.5);

    this.fireEffect.visible = false;
    this.addChild(
      this.shipSprite,
      this.healthBar,
      this.fireEffect,
    );
  }

  takeDamage(amount: number) {
    this.health = Math.max(
      0,
      this.health - amount,
    );

    this.updateHealthBar();

    if (
      this.health / this.maxHealth <= 0.3
    ) {
      this.fireEffect.visible = true;
    }
  }

  private updateHealthBar() {
    const healthPercentage =
      this.health / this.maxHealth;

    this.healthFill.scale.x =
      0.5 * healthPercentage;

    if (healthPercentage > 0.6) {
      this.healthFill.texture =
        this.healthGreenTexture;
    } else if (
      healthPercentage > 0.3
    ) {
      this.healthFill.texture =
        this.healthAmberTexture;
    } else {
      this.healthFill.texture =
        this.healthRedTexture;
    }
  }
}