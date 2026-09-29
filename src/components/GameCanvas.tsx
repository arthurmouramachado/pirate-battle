import { useEffect, useRef } from "react";
import { Application, Assets, AnimatedSprite } from "pixi.js";
import { Player } from "../game/entities/Player";
import { GAME_CONFIG } from "../game/config/gameConfig";
import { InputSystem } from "../game/systems/InputSystems";
import { Projectile } from "../game/entities/Projectile";
import { Island } from "../game/entities/Island";
import { Enemy } from "../game/entities/Enemy";
import { SpawnSystem } from "../game/systems/SpawnSystem";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const enemies: Enemy[] = [];

  useEffect(() => {
    let app: Application | null = null;
    let isActive = true;
    let isInitialized = false;
    let input: InputSystem | null = null;

    async function initGame() {
      const gameApp = new Application();

      app = gameApp;

      await gameApp.init({
        width: GAME_CONFIG.arena.width,
        height: GAME_CONFIG.arena.height,
        backgroundColor: 0x2596be,
      });

      if (!isActive) {
        app.destroy(true);
        app = null;
        return;
      }

      isInitialized = true;

      if (containerRef.current) {
        containerRef.current.appendChild(gameApp.canvas);
      }

      input = new InputSystem();

      const spawnSystem = new SpawnSystem(GAME_CONFIG.enemy.spawnInterval);

      const playerTexture = await Assets.load("/assets/ships/ship_1.png");

      const chaserTexture = await Assets.load("/assets/ships/ship_8.png");

      const shooterTexture = await Assets.load("/assets/ships/ship_14.png");

      const cannonBallTexture = await Assets.load(
        "/assets/ship_parts/cannon_ball.png",
      );

      const islandTexture = await Assets.load("/assets/tiles/tile_1.png");

      const fireTexture = await Assets.load("/assets/effects/fire_1.png");

      const healthFrameTexture = await Assets.load(
        "/assets/ui/hud/health_frame.png",
      );

      const healthGreenTexture = await Assets.load(
        "/assets/ui/hud/health_fill_green.png",
      );

      const healthAmberTexture = await Assets.load(
        "/assets/ui/hud/health_fill_amber.png",
      );

      const healthRedTexture = await Assets.load(
        "/assets/ui/hud/health_fill_red.png",
      );

      const enemyHealthFrameTexture = await Assets.load(
        "/assets/ui/hud/enemy_health_frame.png",
      );

      const enemyHealthGreenTexture = await Assets.load(
        "/assets/ui/hud/enemy_health_fill_green.png",
      );

      const enemyHealthRedTexture = await Assets.load(
        "/assets/ui/hud/enemy_health_fill_red.png",
      );

      const explosionTexture1 = await Assets.load(
        "/assets/effects/explosion_1.png",
      );

      const explosionTexture2 = await Assets.load(
        "/assets/effects/explosion_2.png",
      );

      const explosionTexture3 = await Assets.load(
        "/assets/effects/explosion_3.png",
      );

      if (!isActive) {
        app.destroy(true);
        app = null;
        return;
      }

      const player = new Player(
        playerTexture,
        fireTexture,
        healthFrameTexture,
        healthGreenTexture,
        healthAmberTexture,
        healthRedTexture,
      );

      player.x = GAME_CONFIG.arena.width / 2;
      player.y = GAME_CONFIG.arena.height / 2;

      const island = new Island(islandTexture, 70);
      island.x = 350;
      island.y = 250;

      const chaser = new Enemy(
        "chaser",
        chaserTexture,
        GAME_CONFIG.enemy.chaser.health,
        GAME_CONFIG.enemy.chaser.speed,
        enemyHealthFrameTexture,
        enemyHealthGreenTexture,
        enemyHealthRedTexture,
      );
      chaser.x = 150;
      chaser.y = 150;

      const shooter = new Enemy(
        "shooter",
        shooterTexture,
        GAME_CONFIG.enemy.shooter.health,
        GAME_CONFIG.enemy.shooter.speed,
        enemyHealthFrameTexture,
        enemyHealthGreenTexture,
        enemyHealthRedTexture,
      );
      shooter.x = 1100;
      shooter.y = 150;

      gameApp.stage.addChild(island);
      gameApp.stage.addChild(player);
      gameApp.stage.addChild(chaser);
      gameApp.stage.addChild(shooter);

      const projectiles: Projectile[] = [];

      let forntCooldownRemaining = 0;
      let leftSideCooldownRemaining = 0;
      let rightSideCooldownRemaining = 0;

      function createProjectile(
        rotation: number,
        offsetX: number,
        offsetY: number,
      ) {
        const projectile = new Projectile(
          cannonBallTexture,
          GAME_CONFIG.projectile.speed,
          GAME_CONFIG.projectile.damage,
          GAME_CONFIG.projectile.lifetime,
          "player",
        );

        projectile.rotation = rotation;

        projectile.x = player.x + offsetX;
        projectile.y = player.y + offsetY;

        projectiles.push(projectile);

        gameApp.stage.addChild(projectile);
      }

      function createExplosion(x: number, y: number) {
        const explosion = new AnimatedSprite([
          explosionTexture1,
          explosionTexture2,
          explosionTexture3,
        ]);

        explosion.anchor.set(0.5);

        explosion.x = x;
        explosion.y = y;

        explosion.scale.set(0.8);

        explosion.animationSpeed = 0.15;

        explosion.loop = false;

        explosion.onComplete = () => {
          gameApp.stage.removeChild(explosion);

          explosion.destroy();
        };

        gameApp.stage.addChild(explosion);

        explosion.play();
      }

      let chaserAlive = true;
      let shooterCooldownRemaining = 0;
      let shooterAlive = true;

      gameApp.ticker.add((ticker) => {
        const dt = ticker.deltaMS / 1000;

        if (forntCooldownRemaining > 0) {
          forntCooldownRemaining -= ticker.deltaMS;
        }

        if (leftSideCooldownRemaining > 0) {
          leftSideCooldownRemaining -= ticker.deltaMS;
        }

        if (rightSideCooldownRemaining > 0) {
          rightSideCooldownRemaining -= ticker.deltaMS;
        }

        if (shooterCooldownRemaining > 0) {
          shooterCooldownRemaining -= ticker.deltaMS;
        }

        const speed = GAME_CONFIG.player.speed;
        const rotationSpeed = GAME_CONFIG.player.rotationSpeed;

        const previousX = player.x;
        const previousY = player.y;

        if (input?.isPressed("KeyW")) {
          player.x += Math.sin(player.rotation) * speed * dt;
          player.y -= Math.cos(player.rotation) * speed * dt;
        }

        if (input?.isPressed("KeyA")) {
          player.rotation -= rotationSpeed * dt;
        }

        if (input?.isPressed("KeyS")) {
          player.x -= Math.sin(player.rotation) * speed * 0.5 * dt;
          player.y += Math.cos(player.rotation) * speed * 0.5 * dt;
        }

        if (input?.isPressed("KeyD")) {
          player.rotation += rotationSpeed * dt;
        }

        const margin = 40;
        player.x = Math.max(
          margin,
          Math.min(GAME_CONFIG.arena.width - margin, player.x),
        );
        player.y = Math.max(
          margin,
          Math.min(GAME_CONFIG.arena.height - margin, player.y),
        );

        const dx = player.x - island.x;
        const dy = player.y - island.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.collisionRadius + island.collisionRadius) {
          player.x = previousX;
          player.y = previousY;
        }

        if (input?.isPressed("Space") && forntCooldownRemaining <= 0) {
          const projectile = new Projectile(
            cannonBallTexture,
            GAME_CONFIG.projectile.speed,
            GAME_CONFIG.projectile.damage,
            GAME_CONFIG.projectile.lifetime,
            "player",
          );

          projectile.rotation = player.rotation;
          projectile.x = player.x + Math.sin(player.rotation) * 50;
          projectile.y = player.y - Math.cos(player.rotation) * 50;

          projectiles.push(projectile);
          gameApp.stage.addChild(projectile);
          forntCooldownRemaining = GAME_CONFIG.weapons.frontCooldown;
        }

        for (let i = projectiles.length - 1; i >= 0; i--) {
          const projectile = projectiles[i];

          projectile.x += Math.sin(projectile.rotation) * projectile.speed * dt;

          projectile.y -= Math.cos(projectile.rotation) * projectile.speed * dt;

          projectile.lifetime -= ticker.deltaMS;

          const islandDx = projectile.x - island.x;

          const islandDy = projectile.y - island.y;

          const islandDistance = Math.sqrt(
            islandDx * islandDx + islandDy * islandDy,
          );

          if (islandDistance < island.collisionRadius) {
            gameApp.stage.removeChild(projectile);
            projectile.destroy();
            projectiles.splice(i, 1);

            continue;
          }

          if (projectile.owner === "enemy") {
            const dx = projectile.x - player.x;

            const dy = projectile.y - player.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (
              distance <
              projectile.collisionRadius + player.collisionRadius
            ) {
              player.takeDamage(projectile.damage);

              gameApp.stage.removeChild(projectile);

              projectile.destroy();

              projectiles.splice(i, 1);

              console.log("Player health:", player.health);

              continue;
            }
          }

          if (projectile.owner === "player" && chaserAlive) {
            const dx = projectile.x - chaser.x;

            const dy = projectile.y - chaser.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (
              distance <
              projectile.collisionRadius + chaser.collisionRadius
            ) {
              chaser.takeDamage(projectile.damage);

              gameApp.stage.removeChild(projectile);

              projectile.destroy();

              projectiles.splice(i, 1);

              if (chaser.health <= 0) {
                chaserAlive = false;

                const explosionX = chaser.x;
                const explosionY = chaser.y;

                gameApp.stage.removeChild(chaser);

                chaser.destroy();

                createExplosion(explosionX, explosionY);
              }
              continue;
            }
          }

          if (projectile.owner === "player" && shooterAlive) {
            const dx = projectile.x - shooter.x;

            const dy = projectile.y - shooter.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (
              distance <
              projectile.collisionRadius + shooter.collisionRadius
            ) {
              shooter.takeDamage(projectile.damage);

              gameApp.stage.removeChild(projectile);

              projectile.destroy();

              projectiles.splice(i, 1);

              if (shooter.health <= 0) {
                shooterAlive = false;

                const explosionX = shooter.x;
                const explosionY = shooter.y;

                gameApp.stage.removeChild(shooter);

                shooter.destroy();

                createExplosion(explosionX, explosionY);
              }

              continue;
            }
          }

          if (projectile.lifetime <= 0) {
            gameApp.stage.removeChild(projectile);

            projectile.destroy();

            projectiles.splice(i, 1);
          }
        }
        if (input?.isPressed("KeyQ") && leftSideCooldownRemaining <= 0) {
          const sideRotation = player.rotation - Math.PI / 2;

          const offsets = [-20, 0, 20];

          for (const offset of offsets) {
            const offsetX = Math.sin(player.rotation) * offset;

            const offsetY = -Math.cos(player.rotation) * offset;

            createProjectile(sideRotation, offsetX, offsetY);
          }

          leftSideCooldownRemaining = GAME_CONFIG.weapons.sideCooldown;
        }

        if (input?.isPressed("KeyE") && rightSideCooldownRemaining <= 0) {
          const sideRotation = player.rotation + Math.PI / 2;

          const offsets = [-20, 0, 20];

          for (const offset of offsets) {
            const offsetX = Math.sin(player.rotation) * offset;

            const offsetY = -Math.cos(player.rotation) * offset;

            createProjectile(sideRotation, offsetX, offsetY);
          }

          rightSideCooldownRemaining = GAME_CONFIG.weapons.sideCooldown;
        }

        if (chaserAlive) {
          const chaserDx = player.x - chaser.x;

          const chaserDy = player.y - chaser.y;

          const chaserDistance = Math.sqrt(
            chaserDx * chaserDx + chaserDy * chaserDy,
          );

          const chaserAngle = Math.atan2(chaserDy, chaserDx);

          chaser.x += Math.cos(chaserAngle) * chaser.speed * dt;

          chaser.y += Math.sin(chaserAngle) * chaser.speed * dt;

          chaser.rotation = chaserAngle + Math.PI / 2;

          if (
            chaserDistance <
            player.collisionRadius + chaser.collisionRadius
          ) {
            player.takeDamage(GAME_CONFIG.enemy.chaser.collisionDamage);

            chaserAlive = false;

            gameApp.stage.removeChild(chaser);

            chaser.destroy();

            console.log("Player health:", player.health);
          }
        }

        if (shooterAlive) {
          const shooterDx = player.x - shooter.x;

          const shooterDy = player.y - shooter.y;

          const shooterDistance = Math.sqrt(
            shooterDx * shooterDx + shooterDy * shooterDy,
          );

          const shooterAngle = Math.atan2(shooterDy, shooterDx);

          shooter.rotation = shooterAngle + Math.PI / 2;

          if (shooterDistance > GAME_CONFIG.enemy.shooter.attackRange) {
            shooter.x += Math.cos(shooterAngle) * shooter.speed * dt;

            shooter.y += Math.sin(shooterAngle) * shooter.speed * dt;
          } else if (shooterCooldownRemaining <= 0) {
            const enemyProjectile = new Projectile(
              cannonBallTexture,
              GAME_CONFIG.projectile.speed,
              GAME_CONFIG.enemy.shooter.damage,
              GAME_CONFIG.projectile.lifetime,
              "enemy",
            );

            enemyProjectile.rotation = shooter.rotation;

            enemyProjectile.x = shooter.x + Math.sin(shooter.rotation) * 50;

            enemyProjectile.y = shooter.y - Math.cos(shooter.rotation) * 50;

            projectiles.push(enemyProjectile);

            gameApp.stage.addChild(enemyProjectile);

            shooterCooldownRemaining = GAME_CONFIG.enemy.shooter.cooldown;
          }
        }
      });
    }

    void initGame();

    return () => {
      isActive = false;

      if (app && isInitialized) {
        input?.destroy();
        input = null;
        app.destroy(true);
        app = null;
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
