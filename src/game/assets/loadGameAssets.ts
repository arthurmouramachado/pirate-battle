import { Assets } from "pixi.js";

export async function loadGameAssets() {
  return Assets.load({
    playerShip: "/assets/ships/ship_1.png",

    chaserShip: "/assets/ships/ship_8.png",

    shooterShip: "/assets/ships/ship_14.png",

    cannonBall:
      "/assets/ship_parts/cannon_ball.png",

    explosion1:
      "/assets/effects/explosion_1.png",

    explosion2:
      "/assets/effects/explosion_2.png",

    explosion3:
      "/assets/effects/explosion_3.png",

    fire:
      "/assets/effects/fire_1.png",

    healthFrame:
      "/assets/ui/hud/health_frame.png",

    healthGreen:
      "/assets/ui/hud/health_fill_green.png",

    healthAmber:
      "/assets/ui/hud/health_fill_amber.png",

    healthRed:
      "/assets/ui/hud/health_fill_red.png",
  });
}