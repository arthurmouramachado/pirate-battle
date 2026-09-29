import { Enemy, type EnemyType } from "../entities/Enemy";
import { Texture } from "pixi.js";

interface SpawnTextures {
  chaser: Texture;
  shooter: Texture;
}

interface EnemyHealthTextures {
  frame: Texture;
  green: Texture;
  red: Texture;
}

export class SpawnSystem {
  private elapsed = 0;
  private spawnInterval: number;

  constructor(spawnInterval: number) {
    this.spawnInterval = spawnInterval;
  }

  update(deltaMS: number) {
    this.elapsed += deltaMS;
  }

  canSpawn() {
    return this.elapsed >= this.spawnInterval;
  }

  reset() {
    this.elapsed = 0;
  }

  createEnemy(
    type: EnemyType,
    textures: SpawnTextures,
    healthTextures: EnemyHealthTextures,
    health: number,
    speed: number,
  ) {
    const texture =
      type === "chaser"
        ? textures.chaser
        : textures.shooter;

    return new Enemy(
      type,
      texture,
      health,
      speed,
      healthTextures.frame,
      healthTextures.green,
      healthTextures.red,
    );
  }
}