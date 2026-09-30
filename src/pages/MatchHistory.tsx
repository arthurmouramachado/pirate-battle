import { useQuery } from "@tanstack/react-query";

import { getMatches } from "../api/matchApi";

interface MatchHistoryProps {
  onBack: () => void;
}

export function MatchHistory({ onBack }: MatchHistoryProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["matches"],

    queryFn: getMatches,
  });

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1 style={styles.title}>Match History</h1>

        {isLoading && <p style={styles.message}>Loading matches...</p>}

        {isError && (
          <div style={styles.message}>
            <p>Unable to load match history.</p>

            <button onClick={() => void refetch()}>Try Again</button>
          </div>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <p style={styles.message}>No matches played yet.</p>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <div style={styles.matches}>
            {data.map((match) => (
              <article key={match.id} style={styles.match}>
                <div>
                  <strong>Score {match.score}</strong>

                  <p style={styles.date}>
                    {new Date(match.endedAt).toLocaleString()}
                  </p>
                </div>

                <span>
                  {match.reason === "time" ? "Time Up" : "Ship Destroyed"}
                </span>
              </article>
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
    width: "min(90%, 650px)",

    maxHeight: "80vh",

    overflowY: "auto",

    padding: "36px",

    borderRadius: "20px",

    background: "rgba(15,23,42,0.94)",
  },

  title: {
    marginTop: 0,

    color: "#facc15",

    textAlign: "center",

    fontSize: "40px",
  },

  matches: {
    display: "flex",

    flexDirection: "column",

    gap: "10px",
  },

  match: {
    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    padding: "16px",

    borderRadius: "10px",

    background: "rgba(255,255,255,0.06)",
  },

  date: {
    margin: "5px 0 0",

    color: "#94a3b8",

    fontSize: "13px",
  },

  message: {
    padding: "30px",

    textAlign: "center",

    color: "#cbd5e1",
  },

  backButton: {
    width: "100%",

    marginTop: "24px",

    padding: "13px",

    border: "none",

    borderRadius: "9px",

    cursor: "pointer",

    fontWeight: 700,
  },
};
