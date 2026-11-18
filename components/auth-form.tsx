"use client";

// Acceso simulado: no valida credenciales, solo guarda el nombre en la sesión falsa.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/session";

type Tab = "in" | "up";

export function AuthForm() {
  const router = useRouter();
  const { signIn, signOut } = useSession();
  const [tab, setTab] = useState<Tab>("in");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ name: (username || "PLAYER1").toUpperCase().slice(0, 10) });
    router.push("/");
  };

  const playAsGuest = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="av-auth-wrap fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="mark"></div>
          <h2 className="neon-cyan">ARCADE VAULT</h2>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.16em", marginTop: 6 }}>
            ACCESO AL SISTEMA · v2.6
          </div>
        </div>

        <div className="auth-tabs">
          <button type="button" className={tab === "in" ? "on" : ""} aria-pressed={tab === "in"} onClick={() => setTab("in")}>
            INICIAR SESIÓN
          </button>
          <button type="button" className={tab === "up" ? "on" : ""} aria-pressed={tab === "up"} onClick={() => setTab("up")}>
            CREAR CUENTA
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="auth-user">Usuario</label>
            <input id="auth-user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="px_kai" autoComplete="username" />
          </div>
          {tab === "up" && (
            <div className="field slide-in">
              <label htmlFor="auth-email">Correo electrónico</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jugador@vault.gg"
                autoComplete="email"
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="auth-pass">Contraseña</label>
            <input
              id="auth-pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              autoComplete={tab === "in" ? "current-password" : "new-password"}
            />
          </div>

          <button className="btn lg" type="submit" style={{ width: "100%", marginTop: 8 }}>
            {tab === "in" ? "ENTRAR AL VAULT" : "CREAR Y JUGAR"}
          </button>
        </form>

        <button type="button" className="btn ghost" style={{ width: "100%", marginTop: 10 }} onClick={playAsGuest}>
          JUGAR COMO INVITADO
        </button>

        <div className="auth-divider">O CONTINÚA CON</div>
        {/* Sin acción en el MVP: el OAuth real va en otra spec. */}
        <div className="social">
          <button className="btn ghost" type="button">◆  GOOGLE</button>
          <button className="btn ghost" type="button">▣  GITHUB</button>
        </div>

        <div style={{ marginTop: 18, textAlign: "center", fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.1em" }}>
          AL ENTRAR ACEPTAS LOS TÉRMINOS DEL SALÓN ARCADE
        </div>
      </div>
    </div>
  );
}
