import Link from "next/link";

export default function NotFound() {
  return (
    <section className="av-hero fade-in">
      <h1 className="flicker">404</h1>
      <div className="sub">
        ESTE JUEGO NO ESTÁ EN EL VAULT <span className="blink" aria-hidden="true">_</span>
      </div>
      <p className="mono" style={{ color: "var(--ink-dim)", marginTop: 24, fontSize: 13 }}>
        Revisa la dirección o vuelve a la biblioteca para elegir otro.
      </p>
      <Link href="/" className="btn lg" style={{ marginTop: 32 }}>
        VOLVER AL VAULT
      </Link>
    </section>
  );
}
