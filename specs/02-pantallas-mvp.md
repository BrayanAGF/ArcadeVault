# SPEC 02 — Pantallas del MVP de Arcade Vault

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-11-18
> **Objective:** Trasladar a rutas del App Router las cinco pantallas de `references/templates/` (biblioteca, detalle, reproductor, auth y salón de la fama) con navbar, footer, datos mock y sesión falsa, sin implementar ningún juego.

## Por qué existe esta spec

La plantilla es una SPA en React sin Next que navega con un estado serializado en el hash. Esta spec la convierte en rutas reales, separa servidor y cliente, y conserva la fidelidad visual que dejó lista la SPEC 01 (todo el CSS ya está en `app/globals.css`). Es solo la capa visual: los datos son mock y el "juego" es una simulación.

## Alcance

**Dentro:**

- Datos mock de `data.jsx` tipados en `lib/games.ts`: `GAMES`, `CATS`, `seededScores` y `getGame(id)`.
- Sesión falsa en `lib/session.tsx`: contexto cliente que lee y escribe `localStorage["av_user"]`.
- Navbar (`components/nav.tsx`) con logo, enlaces, contador `CRÉDITOS · 03`, botón de sesión, hamburguesa y panel móvil.
- Footer (`components/footer.tsx`) con el texto `© 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0`.
- Layout raíz: `SessionProvider` envolviendo `Nav`, `<main className="av-main">` y `Footer` dentro de `#root`.
- Rutas:
  - `/` → biblioteca (hero, búsqueda, chips de categoría, grilla de tarjetas con efecto tilt, estado "NO HAY RESULTADOS").
  - `/juegos/[id]` → detalle (portada, tags, descripción larga, stat-strip, acciones y leaderboard de 10 filas).
  - `/juegos/[id]/jugar` → reproductor (HUD, arena CRT animada por CSS, simulación de puntuación, pausa, fin, modal de fin de juego).
  - `/auth` → acceso (pestañas iniciar sesión / crear cuenta, formulario, invitado, botones sociales sin acción).
  - `/salon` → salón de la fama (pestañas por juego, podio, tabla de 12 filas, fila "TU MEJOR MARCA" si hay sesión).
- `app/not-found.tsx` con la estética arcade y un enlace `VOLVER AL VAULT`.
- `generateStaticParams` para los 8 juegos en `/juegos/[id]` y `/juegos/[id]/jugar`.
- `metadata` / `generateMetadata` con título por pantalla.
- Reemplazar el placeholder de `app/page.tsx` de la SPEC 01 por la biblioteca.

**Fuera de alcance (para futuras specs):**

- Cualquier juego real (canvas, controles, lógica).
- Autenticación real, backend, validación de formularios, OAuth de Google/GitHub.
- Persistir puntuaciones (`av_scores` de la plantilla no se implementa).
- Leaderboards reales: el salón y el detalle usan `seededScores`.
- Filtros y pestañas en la URL (`?q=`, `?cat=`, `?juego=`).
- Menú desplegable de cuenta (el `▾` del botón de usuario es decorativo, como en la plantilla).
- Sistema de créditos (el `CRÉDITOS · 03` es texto fijo).
- Panel de tweaks (`.tw-*`).

## Modelo de datos

`lib/games.ts` (módulo compartido, sin `"use client"`):

```ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GameColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string;        // slug, p. ej. "bloque-buster"
  title: string;
  short: string;
  long: string;
  cat: Category;
  cover: string;     // clase CSS, p. ej. "cover-bricks"
  color: GameColor;
  best: number;
  plays: string;     // "12.4K"
};

export type ScoreRow = { rank: number; name: string; score: number; date: string };

export const GAMES: Game[];                        // los 8 de data.jsx, mismos valores
export const CATS = ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"] as const;
export function seededScores(seed: number, count?: number): ScoreRow[]; // mismo algoritmo
export function getGame(id: string): Game | undefined;
```

`lib/session.tsx` (`"use client"`):

```ts
export type User = { name: string };          // nombre en mayúsculas, máx. 10 caracteres
// Clave de localStorage: "av_user" → JSON de User o ausente
export function SessionProvider(props: { children: React.ReactNode }): JSX.Element;
export function useSession(): {
  user: User | null;
  signIn: (user: User) => void;   // guarda en estado y en localStorage
  signOut: () => void;            // limpia estado y localStorage
};
```

Convenciones:

- Las semillas de `seededScores` son las de la plantilla: detalle `id.length * 17 + 3` (10 filas), salón `id.length * 23 + 7` (12 filas).
- Los números se formatean con `toLocaleString("es-ES")`, igual que la plantilla.
- El estado local de pantallas (filtros, pestañas, puntuación del reproductor) no se persiste.

## Plan de implementación

Antes de escribir código de rutas, leer en `node_modules/next/dist/docs/` las guías de rutas dinámicas, `generateStaticParams`, `not-found` y `migrating-to-cache-components.md`.

1. Crear `lib/games.ts` con tipos, `GAMES`, `CATS`, `seededScores` y `getGame`, copiando valores de `data.jsx`. La home sigue mostrando el placeholder.
2. Crear `lib/session.tsx` (`SessionProvider`, `useSession`; lee `av_user` en un `useEffect` tras montar, con `try/catch`). Crear `components/footer.tsx`. Envolver el contenido de `#root` en el layout con `SessionProvider` + `Footer`, y mover `<main className="av-main">` al layout (quitarlo de `app/page.tsx`). Prueba manual: el footer se ve bajo el hero.
3. Crear `components/nav.tsx` (`"use client"`): logo y enlaces con `next/link`, estado activo con `usePathname` (`/` y `/juegos/*` activan "Biblioteca"; `/salon` activa "Salón de la Fama"), botón `Iniciar Sesión` → `/auth` o `{user.name} ▾` que ejecuta `signOut`, hamburguesa que abre `.av-mobile-panel` y `.av-mobile-backdrop`; el panel se cierra al navegar o al pulsar el fondo. Añadirlo al layout. Prueba manual: navbar visible y panel móvil funcional en ancho < 760px.
4. Biblioteca: `components/game-card.tsx` (`"use client"`, tilt con `onMouseMove`/`onMouseLeave`, clic en la tarjeta → `router.push`, botón `JUGAR` como `Link` a `/juegos/[id]` con color según `game.color`) y `components/library.tsx` (`"use client"`, hero, búsqueda, chips, grilla, estado vacío). `app/page.tsx` renderiza `<Library />`. Prueba manual: filtrar por "PUZZLE" deja solo CAÍDA; buscar "zzz" muestra "NO HAY RESULTADOS".
5. Detalle: `app/juegos/[id]/page.tsx` (Server Component) con `generateStaticParams`, `generateMetadata` y `notFound()` si `getGame` devuelve `undefined`. Botones `▶  JUGAR AHORA` → `/juegos/[id]/jugar` y `VOLVER AL VAULT` → `/` como `Link` con clases `.btn`. Crear `app/not-found.tsx` con estilo arcade. Prueba manual: `/juegos/caida` muestra el detalle; `/juegos/nada` muestra la 404 con estilo.
6. Reproductor: `app/juegos/[id]/jugar/page.tsx` (servidor: params, `generateStaticParams`, `notFound`) que renderiza `components/game-player.tsx` (`"use client"`). El cliente replica la plantilla: intervalo de 220 ms que suma 10–99 puntos, subida de nivel, `PAUSA`/`REANUDAR` con overlay `EN PAUSA`, `FIN` abre el modal, `SALIR` → `/juegos/[id]`. El HUD muestra `user?.name ?? "INVITADO"`. El modal: input de iniciales (mayúsculas, máx. 10) inicializado con ese nombre al abrirse, `GUARDAR PUNTUACIÓN` solo cambia a `▸ PUNTUACIÓN GUARDADA_`, `JUGAR DE NUEVO` reinicia, `VOLVER AL VAULT` → `/`. Prueba manual: la puntuación sube, se detiene en pausa y el modal aparece con FIN.
7. Auth: `app/auth/page.tsx` + `components/auth-form.tsx` (`"use client"`). Pestañas `INICIAR SESIÓN` / `CREAR CUENTA` (esta añade el campo de correo con `.slide-in`). Enviar → `signIn({ name: (usuario || "PLAYER1").toUpperCase().slice(0, 10) })` y `router.push("/")`. `JUGAR COMO INVITADO` → `signOut()` y `/`. Google/GitHub sin acción. Prueba manual: entrar como `px_kai` muestra `PX_KAI ▾` en la navbar y sobrevive a recargar.
8. Salón: `app/salon/page.tsx` + `components/hall-of-fame.tsx` (`"use client"`). Pestañas por juego (inicial: `GAMES[0]`), podio 02-01-03, tabla con `animationDelay` de 50 ms por fila, y con sesión la fila `▸ TU MEJOR MARCA EN {título}` + fila `.you` con rango `8 + (id.length % 4)`, puntuación `rows[5].score - 2400` y fecha `11/05/2026`. Botón `VOLVER A LA BIBLIOTECA` → `/`. Prueba manual: cambiar de pestaña cambia podio y tabla.
9. Ejecutar `/verify` (tsc + lint + build).

## Criterios de aceptación

- [ ] `/`, `/juegos/[id]` (×8), `/juegos/[id]/jugar` (×8), `/auth` y `/salon` responden 200 y `next build` los lista como pre-renderizados.
- [ ] `/juegos/no-existe` y `/juegos/no-existe/jugar` muestran `app/not-found.tsx` con estilo arcade y enlace a `/`.
- [ ] Cada pantalla coincide visualmente con su equivalente en `Arcade Vault.html` (comparación lado a lado en escritorio y en ancho < 760px).
- [ ] La navbar marca "Biblioteca" activa en `/`, `/juegos/*` y `/juegos/*/jugar`, y "Salón de la Fama" en `/salon`.
- [ ] En ancho móvil la hamburguesa abre el panel lateral; pulsar el fondo o un enlace lo cierra.
- [ ] En la biblioteca, el chip "SHOOTER" muestra solo INVASORES y ROCAS; buscar "ser" muestra solo SERPENTINA; una búsqueda sin coincidencias muestra "NO HAY RESULTADOS".
- [ ] Pasar el ratón por una tarjeta aplica el tilt y al salir se restablece.
- [ ] El clic en una tarjeta o en su botón `JUGAR` lleva a `/juegos/[id]`.
- [ ] El detalle muestra 10 filas de leaderboard y las 3 primeras con clases `top1`/`top2`/`top3`.
- [ ] En el reproductor la puntuación sube sola; `PAUSA` la detiene y muestra `EN PAUSA`; `FIN` abre el modal con la puntuación final.
- [ ] `GUARDAR PUNTUACIÓN` muestra `▸ PUNTUACIÓN GUARDADA_` y no escribe nada en `localStorage`.
- [ ] `JUGAR DE NUEVO` deja puntuación 0, vidas 3, nivel 01 y cierra el modal.
- [ ] Iniciar sesión como `px_kai` guarda `{"name":"PX_KAI"}` en `localStorage["av_user"]`, redirige a `/` y la navbar muestra `PX_KAI ▾`.
- [ ] Recargar la página conserva la sesión; pulsar `PX_KAI ▾` la cierra y borra `av_user`.
- [ ] Con sesión, el HUD del reproductor muestra el nombre del usuario; sin sesión muestra `INVITADO`.
- [ ] Con sesión, el salón muestra la fila `TU MEJOR MARCA`; sin sesión no aparece.
- [ ] Cambiar la pestaña del salón cambia el podio y las 12 filas de la tabla.
- [ ] Cada ruta tiene su propio `<title>` (p. ej. `CAÍDA · Arcade Vault`).
- [ ] No hay errores de hidratación ni errores en la consola del navegador en ninguna ruta.
- [ ] `/verify` pasa (tsc, lint y build sin errores).

## Decisiones

- **Sí:** rutas reales del App Router (`/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/auth`, `/salon`). URLs compartibles y navegación nativa de Next.
- **No:** SPA con estado en el hash como la plantilla. Desaprovecha el router y complica el SEO.
- **Sí:** rutas en español (`juegos`, `jugar`, `salon`), coherentes con la UI.
- **Sí:** sesión mock en `localStorage["av_user"]` vía contexto cliente. Replica la plantilla y permite ver los estados con y sin usuario.
- **Sí:** leer `av_user` en `useEffect` tras montar. Evita discrepancias de hidratación entre servidor y cliente.
- **No:** autenticación real. Va en su propia spec.
- **Sí:** simulación del reproductor como la plantilla (intervalo de puntuación, pausa, fin, modal).
- **No:** reproductor estático. Se pierde la demo de los estados del HUD y del modal.
- **Sí:** `GUARDAR PUNTUACIÓN` solo visual. Ninguna pantalla leería `av_scores` todavía.
- **No:** persistir `av_scores`. Llega con las puntuaciones reales.
- **Sí:** filtros y pestañas en estado local. Las páginas quedan estáticas y no hace falta `<Suspense>` por `searchParams` con `cacheComponents`.
- **No:** filtros en la URL. Obliga a renderizado dinámico sin necesidad en un MVP.
- **Sí:** `lib/` para datos y sesión, `components/` para UI compartida, páginas finas en `app/`.
- **Sí:** páginas de detalle y reproductor como Server Components con `generateStaticParams` y `notFound()`; solo las partes interactivas son `"use client"`.
- **Sí:** `app/not-found.tsx` con estética arcade. La 404 por defecto rompe la experiencia.
- **Sí:** enlaces con `next/link` y clases `.btn` en lugar de `<a onClick>`/`<button>` que navegan. `.btn` ya es `inline-flex` y funciona en `<a>`.
- **Sí:** la tarjeta conserva el clic de ratón (con `router.push`), pero el camino accesible por teclado es el `Link` `JUGAR`. Evita anidar un enlace dentro de otro.
- **Sí:** el botón `{user.name} ▾` cierra sesión directamente, como en la plantilla.
- **Sí:** una sola spec con un paso por pantalla. El CSS ya existe y cada paso deja una pantalla funcionando.
- **No:** dividir en varias specs. El volumen (~500 líneas de JSX de referencia) no lo justifica.
- **Sí:** fidelidad a la plantilla como criterio de diseño. `/frontend-design` se usa solo para lo que la plantilla no cubre (la página 404).

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Con `cacheComponents`, leer `params` o usar `usePathname` sin `generateStaticParams` / `<Suspense>` puede romper el build ("uncached data outside Suspense"). | `generateStaticParams` en ambas rutas dinámicas. Si el build lo exige, envolver `Nav` en `<Suspense>`. Consultar la guía antes de implementar. |
| Parpadeo inicial: la navbar muestra `Iniciar Sesión` hasta que el efecto lee `av_user`. | Aceptado para el MVP. Es el precio de evitar errores de hidratación. |
| `localStorage` bloqueado (modo privado, cookies desactivadas). | `try/catch` en lectura y escritura; la sesión vive solo en memoria. |
| `toLocaleString("es-ES")` distinto entre Node y navegador. | El detalle se renderiza en servidor y los demás números en cliente; si aparece un error de hidratación, mover el formateo a un helper común con `Intl.NumberFormat("es-ES")`. |
| El intervalo del reproductor sigue corriendo al salir de la ruta. | Limpiar el intervalo en el cleanup del `useEffect`, como la plantilla. |
| El preflight de Tailwind altera `<input>`, `<button>` o `<form>` frente a la plantilla. | Comparar lado a lado; corregir en `globals.css` si algo difiere. |

## Lo que **no** está en esta spec

- Juegos reales.
- Autenticación real, backend u OAuth.
- Persistencia de puntuaciones y leaderboards reales.
- Filtros o pestañas en la URL.
- Menú de cuenta, sistema de créditos y panel de tweaks.

Cada uno de estos, si llega, va en su propia spec.
