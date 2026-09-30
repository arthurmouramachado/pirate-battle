interface MainMenuProps {
  onPlay: () => void;
  onOptions: () => void;
  onRanking: () => void;
  onHistory: () => void;
}

export function MainMenu({
  onPlay,
  onOptions,
  onRanking,
  onHistory,
}: MainMenuProps) {
  return (
    <main style={styles.container}>
      <div style={styles.overlay} />

      <section style={styles.content}>
        <h1 style={styles.title}>Pirate Battle</h1>

        <p style={styles.subtitle}>
          Survive the battle. Destroy enemy ships. Reach the highest score.
        </p>

        <div style={styles.menu}>
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
            }}
            onClick={onPlay}
          >
            Play
          </button>

          <button style={styles.button} onClick={onOptions}>
            Options
          </button>

          <button style={styles.button} onClick={onRanking}>
            Ranking
          </button>

          <button style={styles.button} onClick={onHistory}>
            Match History
          </button>
        </div>

        <div style={styles.controls}>
          <p>
            <strong>W / S</strong> Move
          </p>

          <p>
            <strong>A / D</strong> Turn
          </p>

          <p>
            <strong>Space</strong> Front cannon
          </p>

          <p>
            <strong>Q / E</strong> Side cannons
          </p>

          <p>
            <strong>ESC</strong> Pause
          </p>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",

    width: "100vw",
    minHeight: "100vh",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",

    background:
      "linear-gradient(180deg, #082f49 0%, #0c4a6e 45%, #0369a1 100%)",

    fontFamily: "Arial, Helvetica, sans-serif",
  },

  overlay: {
    position: "absolute",

    inset: 0,

    background:
      "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)",

    pointerEvents: "none",
  },

  content: {
    position: "relative",

    zIndex: 1,

    width: "min(90%, 520px)",

    padding: "40px",

    borderRadius: "20px",

    textAlign: "center",

    background: "rgba(3, 22, 35, 0.82)",

    border: "1px solid rgba(255,255,255,0.15)",

    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },

  title: {
    margin: 0,

    color: "#facc15",

    fontSize: "56px",
    fontWeight: 900,

    letterSpacing: "2px",

    textShadow: "3px 3px 0 #7c2d12",
  },

  subtitle: {
    marginTop: "14px",
    marginBottom: "30px",

    color: "#e2e8f0",

    lineHeight: 1.5,
  },

  menu: {
    display: "flex",

    flexDirection: "column",

    gap: "12px",
  },

  button: {
    width: "100%",

    padding: "14px 20px",

    border: "none",

    borderRadius: "10px",

    background: "#0f172a",

    color: "#ffffff",

    fontSize: "18px",

    fontWeight: 700,

    cursor: "pointer",

    transition: "transform 0.15s ease, background 0.15s ease",
  },

  primaryButton: {
    background: "#f59e0b",

    color: "#1c1917",
  },

  controls: {
    marginTop: "28px",

    paddingTop: "20px",

    borderTop: "1px solid rgba(255,255,255,0.15)",

    display: "grid",

    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

    gap: "8px",

    color: "#cbd5e1",

    fontSize: "14px",
  },
};
