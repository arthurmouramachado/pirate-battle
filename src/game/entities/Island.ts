import { Container, Sprite, Texture } from "pixi.js";

export class Island extends Container {
    collisionRadius: number;

    private sprite: Sprite;

    constructor(texture: Texture, collisionRadius: number) {
        super();
        this.collisionRadius = collisionRadius;

        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.8);
        this.addChild(this.sprite);
    }
}