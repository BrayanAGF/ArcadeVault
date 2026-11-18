"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/session";

type Section = "biblioteca" | "salon" | "auth";

// "/" y "/juegos/*" (detalle y reproductor) pertenecen a la biblioteca.
function sectionOf(pathname: string): Section | null {
  if (pathname === "/" || pathname.startsWith("/juegos/")) return "biblioteca";
  if (pathname === "/salon") return "salon";
  if (pathname === "/auth") return "auth";
  return null;
}

export function Nav() {
  const pathname = usePathname();
  const { user, signOut } = useSession();
  const [open, setOpen] = useState(false);

  const section = sectionOf(pathname);
  const activeClass = (s: Section) => (section === s ? "active" : "");
  const close = () => setOpen(false);

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark"></div>
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>
        <div className="links">
          <Link href="/" className={activeClass("biblioteca")}>
            Biblioteca
          </Link>
          <Link href="/salon" className={activeClass("salon")}>
            Salón de la Fama
          </Link>
        </div>
        <div className="spacer"></div>
        <div className="coin-counter">
          <span className="coin"></span>
          <span>CRÉDITOS · 03</span>
        </div>
        {user ? (
          <button className="btn ghost auth-btn" onClick={signOut}>
            {user.name} ▾
          </button>
        ) : (
          <Link href="/auth" className="btn auth-btn">
            Iniciar Sesión
          </Link>
        )}
        <button
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menú"
          aria-expanded={open}
          aria-controls="av-mobile-panel"
        >
          ≡
        </button>
      </nav>

      <div className={"av-mobile-backdrop" + (open ? " open" : "")} onClick={close}></div>
      <aside id="av-mobile-panel" className={"av-mobile-panel" + (open ? " open" : "")} inert={!open}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENÚ
        </div>
        <Link href="/" className={activeClass("biblioteca")} onClick={close}>
          Biblioteca
        </Link>
        <Link href="/salon" className={activeClass("salon")} onClick={close}>
          Salón de la Fama
        </Link>
        <Link href="/auth" className={activeClass("auth")} onClick={close}>
          {user ? "Cuenta" : "Iniciar Sesión"}
        </Link>
        <div style={{ flex: 1 }}></div>
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  );
}
