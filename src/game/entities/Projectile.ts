import { Container, Sprite, Texture } from "pixi.js";

export type ProjectileOwner = "player" | "enemy";

export class Projectile extends Container {
    speed: number;
    damage: number;
    lifetime: number;
    owner: ProjectileOwner;

    collisionRadius = 8;

    private sprite: Sprite;

    constructor(texture: Texture, speed: number, damage: number, lifetime: number, owner: ProjectileOwner) {
        super();
        this.speed = speed;
        this.damage = damage;
        this.lifetime = lifetime;
        this.owner = owner;

        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.4);
        this.addChild(this.sprite);
    }
}