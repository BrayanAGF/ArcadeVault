"use client";

import Link from "next/link";
import { useState } from "react";
import { GAMES, seededScores, type ScoreRow } from "@/lib/games";
import { useSession } from "@/lib/session";

const TOP_CLASS = ["top1", "top2", "top3"];
const fmt = (n: number) => n.toLocaleString("es-ES");
const rank = (n: number) => String(n).padStart(2, "0");

function PodiumSlot({ row, variant }: { row: ScoreRow; variant: "silver" | "bronze" }) {
  return (
    <div className={"podium-slot " + variant}>
      <div className="rank-num">{rank(row.rank)}</div>
      <div className="name">{row.name}</div>
      <div className="score">{fmt(row.score)}</div>
      <div className="date">{row.date}</div>
    </div>
  );
}

export function HallOfFame() {
  const { user } = useSession();
  const [gameId, setGameId] = useState(GAMES[0].id);

  const game = GAMES.find((g) => g.id === gameId) ?? GAMES[0];
  const rows = seededScores(gameId.length * 23 + 7, 12);
  // Marca mock del usuario (mismas fórmulas que la plantilla).
  const youRank = 8 + (gameId.length % 4);
  const youScore = rows[5].score - 2400 || 9999;

  return (
    <div className="av-hall fade-in">
      <div className="hall-head">
        <h1>SALÓN DE LA FAMA</h1>
        <p className="pixel" style={{ fontSize: 10 }}>LOS NOMBRES QUE NUNCA SE BORRAN DE LA PANTALLA</p>
      </div>

      <div className="hall-tabs">
        {GAMES.map((g) => (
          <button
            key={g.id}
            className={"chip" + (gameId === g.id ? " active" : "")}
            aria-pressed={gameId === g.id}
            onClick={() => setGameId(g.id)}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="podium">
        <PodiumSlot row={rows[1]} variant="silver" />
        <div className="podium-slot gold">
          <div className="pixel" style={{ fontSize: 9, color: "var(--gold)", letterSpacing: "0.18em" }}>CAMPEÓN</div>
          <div className="rank-num" style={{ fontSize: 36, marginTop: 4 }}>{rank(rows[0].rank)}</div>
          <div className="name">{rows[0].name}</div>
          <div className="score" style={{ fontSize: 20 }}>{fmt(rows[0].score)}</div>
          <div className="date">{rows[0].date}</div>
        </div>
        <PodiumSlot row={rows[2]} variant="bronze" />
      </div>

      <div className="hall-table">
        <div className="th">
          <div>RANGO</div>
          <div>JUGADOR</div>
          <div>PUNTUACIÓN</div>
          <div>FECHA</div>
        </div>
        {rows.map((r, i) => (
          // La key incluye el juego para que la animación de entrada se repita al cambiar de pestaña.
          <div
            key={gameId + r.name}
            className={"tr " + (TOP_CLASS[i] ?? "")}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="rk">#{rank(r.rank)}</div>
            <div className="pl">{r.name}</div>
            <div className="sc">{fmt(r.score)}</div>
            <div className="dt">{r.date}</div>
          </div>
        ))}
        {user && (
          <>
            <div className="tr you-label">▸ TU MEJOR MARCA EN {game.title}</div>
            <div className="tr you" style={{ animationDelay: `${rows.length * 50 + 50}ms` }}>
              <div className="rk" style={{ color: "var(--yellow)" }}>#{rank(youRank)}</div>
              <div className="pl" style={{ color: "var(--yellow)" }}>{user.name}</div>
              <div className="sc" style={{ color: "var(--yellow)", textShadow: "0 0 6px rgba(245,255,0,0.5)" }}>
                {fmt(youScore)}
              </div>
              <div className="dt">11/05/2026</div>
            </div>
          </>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/" className="btn lg">VOLVER A LA BIBLIOTECA</Link>
      </div>
    </div>
  );
}
