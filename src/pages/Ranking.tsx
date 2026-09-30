import { useQuery } from "@tanstack/react-query";

import { getRanking } from "../api/rankingApi";

interface RankingProps {
  onBack: () => void;
}

export function Ranking({ onBack }: RankingProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["ranking"],

    queryFn: getRanking,
  });

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1 style={styles.title}>Ranking</h1>

        <p style={styles.subtitle}>Top Pirate Captains</p>

        {isLoading && <p style={styles.message}>Loading ranking...</p>}

        {isError && (
          <div style={styles.message}>
            <p>Unable to load ranking.</p>

            <button style={styles.smallButton} onClick={() => void refetch()}>
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <p style={styles.message}>
            No scores yet. Be the first captain on the ranking!
          </p>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <div style={styles.table}>
            {data.map((entry) => (
              <div key={`${entry.rank}-${entry.endedAt}`} style={styles.row}>
                <strong style={styles.position}>#{entry.rank}</strong>

                <span style={styles.player}>{entry.playerName}</span>

                <strong style={styles.score}>{entry.score}</strong>
              </div>
            ))}
          </div>
        )}

        <button style={styles.backButton} onClick={onBack}>
          Back to Menu
        </button>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100vw",
    minHeight: "100vh",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "linear-gradient(180deg, #082f49, #075985)",

    color: "#ffffff",

    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "min(90%, 600px)",

    padding: "36px",

    borderRadius: "20px",

    background: "rgba(15,23,42,0.94)",
  },

  title: {
    margin: 0,

    textAlign: "center",

    color: "#facc15",

    fontSize: "42px",
  },

  subtitle: {
    textAlign: "center",

    color: "#94a3b8",

    marginBottom: "26px",
  },

  table: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },

  row: {
    display: "grid",

    gridTemplateColumns: "70px 1fr 80px",

    alignItems: "center",

    padding: "14px",

    borderRadius: "10px",

    background: "rgba(255,255,255,0.06)",
  },

  position: {
    color: "#facc15",
  },

  player: {
    color: "#e2e8f0",
  },

  score: {
    textAlign: "right",

    fontSize: "20px",
  },

  message: {
    textAlign: "center",

    padding: "30px",

    color: "#cbd5e1",
  },

  smallButton: {
    padding: "8px 14px",

    cursor: "pointer",
  },

  backButton: {
    width: "100%",

    marginTop: "26px",

    padding: "13px",

    border: "none",

    borderRadius: "9px",

    cursor: "pointer",

    fontWeight: 700,
  },
};
