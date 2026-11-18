"use client";

// Reproductor simulado: no hay juego real, la puntuación sube sola para mostrar el HUD y el modal.
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Game } from "@/lib/games";
import { useSession } from "@/lib/session";

const LIVES = 3;
const INITIAL = { score: 0, level: 1 };

export function GamePlayer({ game }: { game: Game }) {
  const { user } = useSession();
  const playerName = user?.name ?? "INVITADO";

  // Puntuación y nivel en un solo estado: el nivel depende de la puntuación de cada tick.
  const [run, setRun] = useState(INITIAL);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [initials, setInitials] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (over || paused) return;
    const t = setInterval(() => {
      setRun(({ score, level }) => {
        const next = score + Math.floor(10 + Math.random() * 90);
        return { score: next, level: next % 2500 < 100 ? level + 1 : level };
      });
    }, 220);
    return () => clearInterval(t);
  }, [over, paused]);

  const endGame = () => {
    setInitials(playerName);
    setOver(true);
  };
  const restart = () => {
    setRun(INITIAL);
    setPaused(false);
    setOver(false);
    setSaved(false);
  };

  const score = run.score.toLocaleString("es-ES");

  return (
    <div className="av-player fade-in">
      <div className="player-hud">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div className="hud-stat">
            <div className="l">Jugador</div>
            <div className="v" style={{ color: "var(--ink)" }}>{playerName}</div>
          </div>
          <div className="hud-stat">
            <div className="l">Puntuación</div>
            <div className="v">{score}</div>
          </div>
          <div className="hud-stat lives">
            <div className="l">Vidas</div>
            <div className="v">{"♥ ".repeat(LIVES).trim()}</div>
          </div>
          <div className="hud-stat level">
            <div className="l">Nivel</div>
            <div className="v">{String(run.level).padStart(2, "0")}</div>
          </div>
        </div>
        <div className="hud-actions">
          <button className="btn yellow" onClick={() => setPaused((p) => !p)}>
            {paused ? "REANUDAR" : "PAUSA"}
          </button>
          <button className="btn magenta" onClick={endGame}>
            FIN
          </button>
          <Link href={`/juegos/${game.id}`} className="btn ghost">
            SALIR
          </Link>
        </div>
      </div>

      <div className="crt">
        <div className="crt-screen">
          <div className="game-arena" aria-hidden="true">
            <div className="grid-floor"></div>
            <div className="enemy e1"></div>
            <div className="enemy e2"></div>
            <div className="enemy e3"></div>
            <div className="player-ship"></div>
          </div>
          {paused && (
            <div className="crt-content" style={{ background: "rgba(0,0,0,0.6)", zIndex: 5 }}>
              <div>
                <div className="pixel neon-yellow" style={{ fontSize: 22 }}>EN PAUSA</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 10, letterSpacing: "0.16em" }}>
                  PULSA REANUDAR PARA CONTINUAR
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="crt-bottom">
          <span className="led">SEÑAL OK</span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>CARGA · 1MB</span>
        </div>
      </div>

      {over && (
        <div className="modal-bd">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
            <h2 id="game-over-title">FIN DEL JUEGO</h2>
            <div className="final-label">PUNTUACIÓN FINAL</div>
            <div className="final">{score}</div>
            {!saved ? (
              <div className="input-row">
                <input
                  value={initials}
                  onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 10))}
                  placeholder="TUS INICIALES"
                  aria-label="Tus iniciales"
                />
                {/* Solo visual en el MVP: no se persiste nada (SPEC 02). */}
                <button className="btn yellow" onClick={() => setSaved(true)}>
                  GUARDAR PUNTUACIÓN
                </button>
              </div>
            ) : (
              <div className="toast-saved">▸ PUNTUACIÓN GUARDADA_</div>
            )}
            <div className="actions">
              <button className="btn" onClick={restart}>
                JUGAR DE NUEVO
              </button>
              <Link href="/" className="btn magenta">
                VOLVER AL VAULT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
