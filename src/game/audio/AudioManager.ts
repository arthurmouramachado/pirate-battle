export type SoundName =
  | "gameStart"
  | "cannonFire"
  | "cannonBroadside"
  | "explosion"
  | "collision"
  | "scorePoint"
  | "gamePause"
  | "gameResume"
  | "gameOver"
  | "gameComplete"
  | "healthLow"
  | "oceanAmbience";

const SOUND_PATHS: Record<
  SoundName,
  string
> = {
  gameStart:
    "/assets/sounds/game_start.wav",

  cannonFire:
    "/assets/sounds/cannon_fire_1.wav",

  cannonBroadside:
    "/assets/sounds/cannon_broadside.wav",

  explosion:
    "/assets/sounds/ship_explosion_1.wav",

  collision:
    "/assets/sounds/ship_collision.wav",

  scorePoint:
    "/assets/sounds/score_point.wav",

  gamePause:
    "/assets/sounds/game_pause.wav",

  gameResume:
    "/assets/sounds/game_resume.wav",

  gameOver:
    "/assets/sounds/game_over.wav",

  gameComplete:
    "/assets/sounds/game_complete.wav",

  healthLow:
    "/assets/sounds/health_low.wav",

  oceanAmbience:
    "/assets/sounds/ocean_ambience_loop.wav",
};

export class AudioManager {
  private volume: number;

  private loops =
    new Map<
      SoundName,
      HTMLAudioElement
    >();

  constructor(
    volume = 0.8,
  ) {
    this.volume =
      this.clampVolume(
        volume,
      );
  }

  setVolume(
    volume: number,
  ) {
    this.volume =
      this.clampVolume(
        volume,
      );

    for (
      const audio of this.loops.values()
    ) {
      audio.volume =
        this.volume;
    }
  }

  play(
    sound: SoundName,
    volumeMultiplier = 1,
  ) {
    const audio =
      new Audio(
        SOUND_PATHS[
          sound
        ],
      );

    audio.volume =
      this.clampVolume(
        this.volume *
          volumeMultiplier,
      );

    void audio
      .play()
      .catch(() => {
        // Navegadores podem bloquear áudio
        // antes da primeira interação.
      });

    return audio;
  }

  startLoop(
    sound: SoundName,
    volumeMultiplier = 1,
  ) {
    if (
      this.loops.has(
        sound,
      )
    ) {
      return;
    }

    const audio =
      new Audio(
        SOUND_PATHS[
          sound
        ],
      );

    audio.loop = true;

    audio.volume =
      this.clampVolume(
        this.volume *
          volumeMultiplier,
      );

    this.loops.set(
      sound,
      audio,
    );

    void audio
      .play()
      .catch(() => {
        // Pode ser bloqueado pela política
        // de autoplay do navegador.
      });
  }

  stopLoop(
    sound: SoundName,
  ) {
    const audio =
      this.loops.get(
        sound,
      );

    if (!audio) {
      return;
    }

    audio.pause();

    audio.currentTime = 0;

    this.loops.delete(
      sound,
    );
  }

  stopAllLoops() {
    for (
      const audio of this.loops.values()
    ) {
      audio.pause();

      audio.currentTime =
        0;
    }

    this.loops.clear();
  }

  destroy() {
    this.stopAllLoops();
  }

  private clampVolume(
    volume: number,
  ) {
    return Math.min(
      1,
      Math.max(
        0,
        volume,
      ),
    );
  }
}