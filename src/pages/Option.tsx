import { useState } from "react";

interface GameSettings {
  sessionDuration: number;

  volume: number;

  difficulty: "easy" | "normal" | "hard";
}

interface OptionsProps {
  onBack: () => void;
}

const STORAGE_KEY = "pirate-battle-settings";

const DEFAULT_SETTINGS: GameSettings = {
  sessionDuration: 120,

  volume: 0.8,

  difficulty: "normal",
};

export function Option({ onBack }: OptionsProps) {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  const [saved, setSaved] = useState(false);

  function handleDurationChange(duration: number) {
    setSettings((current) => ({
      ...current,

      sessionDuration: duration,
    }));

    setSaved(false);
  }

  function handleVolumeChange(volume: number) {
    setSettings((current) => ({
      ...current,

      volume,
    }));

    setSaved(false);
  }

  function handleDifficultyChange(difficulty: "easy" | "normal" | "hard") {
    setSettings((current) => ({
      ...current,

      difficulty,
    }));

    setSaved(false);
  }

  function handleSave() {
    localStorage.setItem(
      STORAGE_KEY,

      JSON.stringify(settings),
    );

    setSaved(true);
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem(
      STORAGE_KEY,

      JSON.stringify(DEFAULT_SETTINGS),
    );

    setSaved(true);
  }

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1 style={styles.title}>Options</h1>

        <p style={styles.subtitle}>Customize your battle settings.</p>

        <div style={styles.option}>
          <div>
            <strong>Match Duration</strong>

            <p style={styles.description}>Choose how long each battle lasts.</p>
          </div>

          <select
            style={styles.select}
            value={settings.sessionDuration}
            onChange={(event) =>
              handleDurationChange(Number(event.target.value))
            }
          >
            <option value={60}>1 minute</option>

            <option value={120}>2 minutes</option>

            <option value={180}>3 minutes</option>
          </select>
        </div>

        <div style={styles.option}>
          <div>
            <strong>Volume</strong>

            <p style={styles.description}>Game sound volume.</p>
          </div>

          <div style={styles.volumeArea}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(event) =>
                handleVolumeChange(Number(event.target.value))
              }
            />

            <span>{Math.round(settings.volume * 100)}%</span>
          </div>
        </div>

        <div style={styles.option}>
          <div>
            <strong>Difficulty</strong>

            <p style={styles.description}>
              Difficulty preset for future balancing.
            </p>
          </div>

          <select
            style={styles.select}
            value={settings.difficulty}
            onChange={(event) =>
              handleDifficultyChange(
                event.target.value as "easy" | "normal" | "hard",
              )
            }
          >
            <option value="easy">Easy</option>

            <option value="normal">Normal</option>

            <option value="hard">Hard</option>
          </select>
        </div>

        {saved && <p style={styles.success}>Settings saved successfully.</p>}

        <div style={styles.actions}>
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
            }}
            onClick={handleSave}
          >
            Save Settings
          </button>

          <button style={styles.button} onClick={handleReset}>
            Reset Defaults
          </button>

          <button style={styles.backButton} onClick={onBack}>
            Back to Menu
          </button>
        </div>
      </section>
    </main>
  );
}

function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(saved) as Partial<GameSettings>;

    return {
      sessionDuration:
        parsed.sessionDuration ?? DEFAULT_SETTINGS.sessionDuration,

      volume: parsed.volume ?? DEFAULT_SETTINGS.volume,

      difficulty: parsed.difficulty ?? DEFAULT_SETTINGS.difficulty,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100vw",

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background: "linear-gradient(180deg, #082f49, #075985)",

    color: "#ffffff",

    fontFamily: "Arial, Helvetica, sans-serif",
  },

  card: {
    width: "min(90%, 600px)",

    padding: "40px",

    borderRadius: "20px",

    background: "rgba(15, 23, 42, 0.94)",

    border: "1px solid rgba(255,255,255,0.15)",

    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },

  title: {
    margin: 0,

    textAlign: "center",

    fontSize: "42px",

    color: "#facc15",
  },

  subtitle: {
    textAlign: "center",

    color: "#94a3b8",

    marginBottom: "32px",
  },

  option: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    padding: "18px 0",

    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  description: {
    margin: "6px 0 0",

    color: "#94a3b8",

    fontSize: "14px",
  },

  select: {
    padding: "10px 12px",

    minWidth: "140px",

    borderRadius: "8px",

    border: "1px solid #475569",

    background: "#0f172a",

    color: "#ffffff",
  },

  volumeArea: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    minWidth: "180px",
  },

  success: {
    padding: "12px",

    marginTop: "20px",

    borderRadius: "8px",

    background: "rgba(34,197,94,0.15)",

    color: "#86efac",

    textAlign: "center",
  },

  actions: {
    display: "flex",

    flexDirection: "column",

    gap: "10px",

    marginTop: "28px",
  },

  button: {
    padding: "13px 18px",

    border: "none",

    borderRadius: "9px",

    background: "#1e293b",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "16px",

    fontWeight: 700,
  },

  primaryButton: {
    background: "#f59e0b",

    color: "#1c1917",
  },

  backButton: {
    padding: "13px 18px",

    border: "1px solid #475569",

    borderRadius: "9px",

    background: "transparent",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "16px",
  },
};
