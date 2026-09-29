export const GAME_CONFIG = {
  arena: {
    width: 1280,
    height: 720,
  },

  session: {
    duration: 120,
  },

  player: {
    maxHealth: 100,
    speed: 220,
    rotationSpeed: 2.8,
  },

  enemy: {
    spawnInterval: 4000,

    chaser: {
      health: 40,
      speed: 100,
      collisionDamage: 25,
    },

    shooter: {
      health: 50,
      speed: 70,
      damage: 10,
      attackRange: 350,
      cooldown: 1800,
    },
  },

  projectile: {
    speed: 500,
    damage: 20,
    lifetime: 2000,
  },

  weapons: {
    frontCooldown: 400,
    sideCooldown: 1000,
  },
} as const;