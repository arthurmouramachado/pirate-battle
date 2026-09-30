/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/refs */
import { useEffect, useRef } from "react";

import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Sprite,
  Text,
} from "pixi.js";

import { Player } from "../game/entities/Player";
import { Projectile } from "../game/entities/Projectile";
import { Island } from "../game/entities/Island";

import { Enemy, type EnemyType } from "../game/entities/Enemy";

import { GAME_CONFIG } from "../game/config/gameConfig";

import { InputSystem } from "../game/systems/InputSystems";
import { SpawnSystem } from "../game/systems/SpawnSystem";
import { AudioManager } from "../game/audio/AudioManager";

export interface TouchControlsState {
  forward: boolean;
  backward: boolean;

  turnLeft: boolean;
  turnRight: boolean;

  fireFront: boolean;
  fireLeft: boolean;
  fireRight: boolean;

  pause: boolean;
}

export interface GameResult {
  score: number;

  reason: "time" | "player";

  duration: number;

  remainingTime: number;

  endedAt: string;
}

interface StoredGameSettings {
  sessionDuration?: number;

  volume?: number;

  difficulty?: "easy" | "normal" | "hard";
}

interface GameCanvasProps {
  onGameEnd?: (result: GameResult) => void;

  onExitToMenu?: () => void;

  touchControls?: Partial<TouchControlsState>;
}

const DEFAULT_TOUCH_CONTROLS: TouchControlsState = {
  forward: false,
  backward: false,

  turnLeft: false,
  turnRight: false,

  fireFront: false,
  fireLeft: false,
  fireRight: false,

  pause: false,
};

export function GameCanvas({
  onGameEnd,
  onExitToMenu,
  touchControls,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const touchControlsRef = useRef<TouchControlsState>(DEFAULT_TOUCH_CONTROLS);

  touchControlsRef.current = {
    ...DEFAULT_TOUCH_CONTROLS,
    ...touchControls,
  };

  useEffect(() => {
    let app: Application | null = null;
    let audioManager: AudioManager | null = null;

    let isActive = true;

    let isInitialized = false;

    let input: InputSystem | null = null;

    let handleVisibilityChange: (() => void) | null = null;

    let handleWindowBlur: (() => void) | null = null;

    async function initGame() {
      const gameApp = new Application();

      app = gameApp;

      await gameApp.init({
        width: GAME_CONFIG.arena.width,

        height: GAME_CONFIG.arena.height,

        backgroundColor: 0x2596be,
      });

      if (!isActive) {
        gameApp.destroy(true);

        app = null;

        return;
      }

      isInitialized = true;

      if (containerRef.current) {
        containerRef.current.appendChild(gameApp.canvas);
      }

      gameApp.canvas.style.maxWidth = "100%";

      gameApp.canvas.style.height = "auto";

      gameApp.canvas.style.display = "block";

      gameApp.stage.sortableChildren = true;

      input = new InputSystem();

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

      const scoreIconTexture = await Assets.load(
        "/assets/ui/hud/icon_score.png",
      );

      const timeIconTexture = await Assets.load("/assets/ui/hud/icon_time.png");

      if (!isActive) {
        gameApp.destroy(true);

        app = null;

        return;
      }

      let storedSettings: StoredGameSettings = {};

      try {
        const savedSettings = localStorage.getItem("pirate-battle-settings");

        if (savedSettings) {
          storedSettings = JSON.parse(savedSettings);
        }
      } catch {
        storedSettings = {};
      }

      const configuredDuration =
        storedSettings.sessionDuration && storedSettings.sessionDuration > 0
          ? storedSettings.sessionDuration
          : GAME_CONFIG.session.duration;

      const configuredVolume =
        typeof storedSettings.volume === "number" ? storedSettings.volume : 0.8;

      audioManager = new AudioManager(configuredVolume);

      audioManager.play("gameStart");

      audioManager.startLoop("oceanAmbience", 0.35);

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

      gameApp.stage.addChild(island);

      gameApp.stage.addChild(player);

      const projectiles: Projectile[] = [];

      const enemies: Enemy[] = [];

      const spawnSystem = new SpawnSystem(GAME_CONFIG.enemy.spawnInterval);

      let spawnCount = 0;

      const shooterCooldowns = new Map<Enemy, number>();

      let score = 0;

      let timeRemaining = configuredDuration;

      let timeAccumulator = 0;

      let gameEnded = false;

      let isPaused = false;

      let lowHealthWarningPlayed = false;

      let escapeWasPressed = false;

      let menuWasPressed = false;

      let touchPauseWasPressed = false;

      function formatTime(totalSeconds: number) {
        const minutes = Math.floor(totalSeconds / 60);

        const seconds = totalSeconds % 60;

        return `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }
      const hud = new Container();

      hud.zIndex = 1000;

      const scoreIcon = new Sprite(scoreIconTexture);

      scoreIcon.x = 20;

      scoreIcon.y = 20;

      scoreIcon.scale.set(0.5);

      const scoreText = new Text({
        text: "0",

        style: {
          fontFamily: "Arial",
          fontSize: 26,

          fill: 0xffffff,

          fontWeight: "bold",

          stroke: {
            color: 0x000000,

            width: 4,
          },
        },
      });

      scoreText.x = 60;

      scoreText.y = 20;

      const timeIcon = new Sprite(timeIconTexture);

      timeIcon.x = 20;

      timeIcon.y = 65;

      timeIcon.scale.set(0.5);

      const timerText = new Text({
        text: formatTime(timeRemaining),

        style: {
          fontFamily: "Arial",

          fontSize: 26,

          fill: 0xffffff,

          fontWeight: "bold",

          stroke: {
            color: 0x000000,

            width: 4,
          },
        },
      });

      timerText.x = 60;

      timerText.y = 65;

      hud.addChild(scoreIcon, scoreText, timeIcon, timerText);

      gameApp.stage.addChild(hud);

      const pauseContainer = new Container();

      pauseContainer.zIndex = 1500;

      pauseContainer.visible = false;

      const pauseTitle = new Text({
        text: "PAUSED",

        style: {
          fontFamily: "Arial",

          fontSize: 52,

          fill: 0xffffff,

          fontWeight: "bold",

          stroke: {
            color: 0x000000,

            width: 5,
          },
        },
      });

      pauseTitle.anchor.set(0.5);

      pauseTitle.x = GAME_CONFIG.arena.width / 2;

      pauseTitle.y = GAME_CONFIG.arena.height / 2 - 30;

      const pauseInstruction = new Text({
        text: "ESC to resume • M for menu",

        style: {
          fontFamily: "Arial",

          fontSize: 22,

          fill: 0xffffff,

          stroke: {
            color: 0x000000,

            width: 3,
          },
        },
      });

      pauseInstruction.anchor.set(0.5);

      pauseInstruction.x = GAME_CONFIG.arena.width / 2;

      pauseInstruction.y = GAME_CONFIG.arena.height / 2 + 35;

      pauseContainer.addChild(pauseTitle, pauseInstruction);

      gameApp.stage.addChild(pauseContainer);

      function endGame(reason: "time" | "player") {
        if (gameEnded) {
          return;
        }

        gameEnded = true;

        isPaused = false;

        pauseContainer.visible = false;

        // SONS
        audioManager?.stopLoop("oceanAmbience");

        if (reason === "time") {
          audioManager?.play("gameComplete");
        } else {
          audioManager?.play("gameOver");
        }

        const result: GameResult = {
          score,

          reason,

          duration: configuredDuration,

          remainingTime: timeRemaining,

          endedAt: new Date().toISOString(),
        };

        onGameEnd?.(result);
      }

      function togglePause() {
        if (gameEnded) {
          return;
        }

        isPaused = !isPaused;

        pauseContainer.visible = isPaused;

        if (isPaused) {
          audioManager?.play("gamePause");
        } else {
          audioManager?.play("gameResume");
        }
      }

      function autoPause() {
        if (gameEnded || isPaused) {
          return;
        }

        isPaused = true;

        pauseContainer.visible = true;

        audioManager?.play("gamePause");

        escapeWasPressed = false;

        touchPauseWasPressed = false;
      }

      handleVisibilityChange = () => {
        if (document.hidden) {
          autoPause();
        }
      };

      handleWindowBlur = () => {
        autoPause();
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      window.addEventListener("blur", handleWindowBlur);

      let frontCooldownRemaining = 0;

      let leftSideCooldownRemaining = 0;

      let rightSideCooldownRemaining = 0;

      function createExplosion(x: number, y: number) {
        audioManager?.play("explosion", 0.8);
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

      function checkLowHealthSound() {
        if (
          player.health > 0 &&
          player.health / player.maxHealth <= 0.3 &&
          !lowHealthWarningPlayed
        ) {
          lowHealthWarningPlayed = true;

          audioManager?.play("healthLow");
        }
      }

      function collidesWithIsland(x: number, y: number, radius: number) {
        const dx = x - island.x;

        const dy = y - island.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < radius + island.collisionRadius;
      }

      function getSpawnPosition() {
        const margin = 80;

        let x = margin;

        let y = margin;

        let valid = false;

        let attempts = 0;

        while (!valid && attempts < 50) {
          attempts++;

          x = margin + Math.random() * (GAME_CONFIG.arena.width - margin * 2);

          y = margin + Math.random() * (GAME_CONFIG.arena.height - margin * 2);

          const playerDx = x - player.x;

          const playerDy = y - player.y;

          const playerDistance = Math.sqrt(
            playerDx * playerDx + playerDy * playerDy,
          );

          valid = playerDistance > 300 && !collidesWithIsland(x, y, 80);
        }

        return {
          x,
          y,
        };
      }

      function spawnEnemy() {
        let type: EnemyType;

        if (spawnCount === 0) {
          type = "chaser";
        } else if (spawnCount === 1) {
          type = "shooter";
        } else {
          type = Math.random() < 0.5 ? "chaser" : "shooter";
        }

        spawnCount++;

        const position = getSpawnPosition();

        let enemy: Enemy;

        if (type === "chaser") {
          enemy = spawnSystem.createEnemy(
            "chaser",

            {
              chaser: chaserTexture,

              shooter: shooterTexture,
            },

            {
              frame: enemyHealthFrameTexture,

              green: enemyHealthGreenTexture,

              red: enemyHealthRedTexture,
            },

            GAME_CONFIG.enemy.chaser.health,

            GAME_CONFIG.enemy.chaser.speed,
          );
        } else {
          enemy = spawnSystem.createEnemy(
            "shooter",

            {
              chaser: chaserTexture,

              shooter: shooterTexture,
            },

            {
              frame: enemyHealthFrameTexture,

              green: enemyHealthGreenTexture,

              red: enemyHealthRedTexture,
            },

            GAME_CONFIG.enemy.shooter.health,

            GAME_CONFIG.enemy.shooter.speed,
          );

          shooterCooldowns.set(enemy, 0);
        }

        enemy.x = position.x;

        enemy.y = position.y;

        enemies.push(enemy);

        gameApp.stage.addChild(enemy);
      }

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

        audioManager?.play("cannonFire", 0.55);
      }

      gameApp.ticker.add((ticker) => {
        if (gameEnded) {
          return;
        }

        const touch = touchControlsRef.current;

        const escapePressed = input?.isPressed("Escape") ?? false;

        const touchPausePressed = touch.pause;

        if (
          (escapePressed && !escapeWasPressed) ||
          (touchPausePressed && !touchPauseWasPressed)
        ) {
          togglePause();
        }

        escapeWasPressed = escapePressed;

        touchPauseWasPressed = touchPausePressed;

        const menuPressed = input?.isPressed("KeyM") ?? false;

        if (isPaused && menuPressed && !menuWasPressed) {
          audioManager?.destroy();

          onExitToMenu?.();

          return;
        }

        menuWasPressed = menuPressed;

        if (isPaused) {
          return;
        }

        const dt = ticker.deltaMS / 1000;

        timeAccumulator += ticker.deltaMS;

        while (timeAccumulator >= 1000 && timeRemaining > 0) {
          timeAccumulator -= 1000;

          timeRemaining--;

          timerText.text = formatTime(timeRemaining);
        }

        if (timeRemaining <= 0) {
          endGame("time");

          return;
        }

        spawnSystem.update(ticker.deltaMS);

        if (spawnSystem.canSpawn()) {
          spawnEnemy();

          spawnSystem.reset();
        }

        if (frontCooldownRemaining > 0) {
          frontCooldownRemaining -= ticker.deltaMS;
        }

        if (leftSideCooldownRemaining > 0) {
          leftSideCooldownRemaining -= ticker.deltaMS;
        }

        if (rightSideCooldownRemaining > 0) {
          rightSideCooldownRemaining -= ticker.deltaMS;
        }

        const speed = GAME_CONFIG.player.speed;

        const rotationSpeed = GAME_CONFIG.player.rotationSpeed;

        const previousX = player.x;

        const previousY = player.y;

        const moveForward =
          (input?.isPressed("KeyW") ?? false) || touch.forward;

        const moveBackward =
          (input?.isPressed("KeyS") ?? false) || touch.backward;

        const turnLeft = (input?.isPressed("KeyA") ?? false) || touch.turnLeft;

        const turnRight =
          (input?.isPressed("KeyD") ?? false) || touch.turnRight;

        const fireFront =
          (input?.isPressed("Space") ?? false) || touch.fireFront;

        const fireLeft = (input?.isPressed("KeyQ") ?? false) || touch.fireLeft;

        const fireRight =
          (input?.isPressed("KeyE") ?? false) || touch.fireRight;

        if (moveForward) {
          player.x += Math.sin(player.rotation) * speed * dt;

          player.y -= Math.cos(player.rotation) * speed * dt;
        }

        if (turnLeft) {
          player.rotation -= rotationSpeed * dt;
        }

        if (moveBackward) {
          player.x -= Math.sin(player.rotation) * speed * 0.5 * dt;

          player.y += Math.cos(player.rotation) * speed * 0.5 * dt;
        }

        if (turnRight) {
          player.rotation += rotationSpeed * dt;
        }

        const margin = 40;

        player.x = Math.max(
          margin,

          Math.min(
            GAME_CONFIG.arena.width - margin,

            player.x,
          ),
        );

        player.y = Math.max(
          margin,

          Math.min(
            GAME_CONFIG.arena.height - margin,

            player.y,
          ),
        );

        if (collidesWithIsland(player.x, player.y, player.collisionRadius)) {
          player.x = previousX;

          player.y = previousY;
        }

        if (fireFront && frontCooldownRemaining <= 0) {
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

          audioManager?.play("cannonFire");

          frontCooldownRemaining = GAME_CONFIG.weapons.frontCooldown;
        }

        if (fireLeft && leftSideCooldownRemaining <= 0) {
          const sideRotation = player.rotation - Math.PI / 2;

          const offsets = [-20, 0, 20];

          for (const offset of offsets) {
            const offsetX = Math.sin(player.rotation) * offset;

            const offsetY = -Math.cos(player.rotation) * offset;

            createProjectile(sideRotation, offsetX, offsetY);
          }

          audioManager?.play("cannonBroadside");

          leftSideCooldownRemaining = GAME_CONFIG.weapons.sideCooldown;
        }

        if (fireRight && rightSideCooldownRemaining <= 0) {
          const sideRotation = player.rotation + Math.PI / 2;

          const offsets = [-20, 0, 20];

          for (const offset of offsets) {
            const offsetX = Math.sin(player.rotation) * offset;

            const offsetY = -Math.cos(player.rotation) * offset;

            createProjectile(sideRotation, offsetX, offsetY);
          }

          audioManager?.play("cannonBroadside");
          rightSideCooldownRemaining = GAME_CONFIG.weapons.sideCooldown;
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
          const enemy = enemies[i];

          const dx = player.x - enemy.x;

          const dy = player.y - enemy.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          const angle = Math.atan2(dy, dx);

          const previousEnemyX = enemy.x;

          const previousEnemyY = enemy.y;

          if (enemy.type === "chaser") {
            enemy.x += Math.cos(angle) * enemy.speed * dt;

            enemy.y += Math.sin(angle) * enemy.speed * dt;

            enemy.rotation = angle + Math.PI / 2;

            if (collidesWithIsland(enemy.x, enemy.y, enemy.collisionRadius)) {
              enemy.x = previousEnemyX;

              enemy.y = previousEnemyY;
            }

            if (distance < player.collisionRadius + enemy.collisionRadius) {
              audioManager?.play("collision");
              player.takeDamage(GAME_CONFIG.enemy.chaser.collisionDamage);
              checkLowHealthSound();

              const explosionX = enemy.x;

              const explosionY = enemy.y;

              gameApp.stage.removeChild(enemy);

              enemy.destroy();

              enemies.splice(i, 1);

              createExplosion(explosionX, explosionY);

              if (player.health <= 0) {
                endGame("player");

                return;
              }

              continue;
            }
          }

          if (enemy.type === "shooter") {
            enemy.rotation = angle + Math.PI / 2;

            let cooldown = shooterCooldowns.get(enemy) ?? 0;

            if (cooldown > 0) {
              cooldown -= ticker.deltaMS;

              shooterCooldowns.set(enemy, cooldown);
            }

            if (distance > GAME_CONFIG.enemy.shooter.attackRange) {
              enemy.x += Math.cos(angle) * enemy.speed * dt;

              enemy.y += Math.sin(angle) * enemy.speed * dt;
              if (collidesWithIsland(enemy.x, enemy.y, enemy.collisionRadius)) {
                enemy.x = previousEnemyX;

                enemy.y = previousEnemyY;
              }
            } else if (cooldown <= 0) {
              const projectile = new Projectile(
                cannonBallTexture,

                GAME_CONFIG.projectile.speed,

                GAME_CONFIG.enemy.shooter.damage,

                GAME_CONFIG.projectile.lifetime,

                "enemy",
              );

              projectile.rotation = enemy.rotation;

              projectile.x = enemy.x + Math.sin(enemy.rotation) * 50;

              projectile.y = enemy.y - Math.cos(enemy.rotation) * 50;

              projectiles.push(projectile);

              gameApp.stage.addChild(projectile);

              shooterCooldowns.set(
                enemy,

                GAME_CONFIG.enemy.shooter.cooldown,
              );
            }
          }
        }

        for (let i = projectiles.length - 1; i >= 0; i--) {
          const projectile = projectiles[i];

          projectile.x += Math.sin(projectile.rotation) * projectile.speed * dt;

          projectile.y -= Math.cos(projectile.rotation) * projectile.speed * dt;

          projectile.lifetime -= ticker.deltaMS;

          if (collidesWithIsland(projectile.x, projectile.y, 0)) {
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
              checkLowHealthSound();

              gameApp.stage.removeChild(projectile);

              projectile.destroy();

              projectiles.splice(i, 1);

              if (player.health <= 0) {
                endGame("player");

                return;
              }

              continue;
            }
          }

          if (projectile.owner === "player") {
            let enemyHit = false;

            for (
              let enemyIndex = enemies.length - 1;
              enemyIndex >= 0;
              enemyIndex--
            ) {
              const enemy = enemies[enemyIndex];

              const dx = projectile.x - enemy.x;

              const dy = projectile.y - enemy.y;

              const distance = Math.sqrt(dx * dx + dy * dy);

              if (
                distance <
                projectile.collisionRadius + enemy.collisionRadius
              ) {
                enemy.takeDamage(projectile.damage);

                gameApp.stage.removeChild(projectile);

                projectile.destroy();

                projectiles.splice(i, 1);

                if (enemy.health <= 0) {
                  const explosionX = enemy.x;

                  const explosionY = enemy.y;

                  gameApp.stage.removeChild(enemy);

                  enemy.destroy();

                  enemies.splice(enemyIndex, 1);

                  shooterCooldowns.delete(enemy);

                  createExplosion(explosionX, explosionY);

                  score += 1;

                  scoreText.text = String(score);

                  audioManager?.play("scorePoint", 0.65);
                }

                enemyHit = true;

                break;
              }
            }

            if (enemyHit) {
              continue;
            }
          }

          if (projectile.lifetime <= 0) {
            gameApp.stage.removeChild(projectile);

            projectile.destroy();

            projectiles.splice(i, 1);
          }
        }
      });
    }

    void initGame();

    return () => {
      isActive = false;

      input?.destroy();

      input = null;

      audioManager?.destroy();

      audioManager = null;

      if (handleVisibilityChange) {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );

        handleVisibilityChange = null;
      }

      if (handleWindowBlur) {
        window.removeEventListener("blur", handleWindowBlur);

        handleWindowBlur = null;
      }

      if (app && isInitialized) {
        app.destroy(true);

        app = null;
      }
    };
  }, [onGameEnd, onExitToMenu]);

  return <div ref={containerRef} data-testid="game-canvas" />;
}
