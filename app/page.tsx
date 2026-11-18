// Placeholder de la home: replica el hero de la plantilla para comprobar fuentes y colores del tema.
// La biblioteca de juegos completa llega en su propia spec.
export default function Home() {
  return (
    <main className="av-main">
      <section className="av-hero">
        <h1 className="flicker">ARCADE VAULT</h1>
        <div className="sub">
          INSERTA UNA MONEDA PARA JUGAR{" "}
          <span className="blink" aria-hidden="true">
            _
          </span>
        </div>
      </section>
    </main>
  );
}
