# SPEC 01 — Tema global de Arcade Vault

> **Status:** Aprobado
> **Depends on:** —
> **Date:** 2026-11-18
> **Objective:** Aplicar a toda la app de Next el tema visual de `references/templates/styles.css`, con sus fuentes y fondos, para que luzca igual que la plantilla.

## Por qué existe esta spec

La plantilla de referencia (`references/templates/Arcade Vault.html` + `styles.css`) es un prototipo en React sin Next. Hay que trasladar su estilo al App Router sin perder fidelidad visual. Al mismo tiempo, hay que exponer la paleta a Tailwind v4 para las pantallas futuras.

## Alcance

**Dentro:**

- Reemplazar `app/globals.css` por el contenido completo de `styles.css`: tokens, base, fondo, utilidades de texto neón y todas las clases de componentes (`.av-nav`, `.btn`, `.card`, `.cover-*`, `.crt`, `.modal`, `.auth-card`, `.av-hall`, `.spinner`, etc.).
- Mantener `@import "tailwindcss";` al inicio de `app/globals.css`.
- Mapear los tokens de la paleta y las fuentes en un bloque `@theme inline` de Tailwind.
- Eliminar los tokens de ejemplo de Create Next App (`--background`, `--foreground`, bloque `prefers-color-scheme`, `font-family: Arial`).
- Cargar las fuentes Press Start 2P, JetBrains Mono (400/500/700) y Courier Prime (400/700) con `<link>` a Google Fonts en el `<head>` del layout raíz, con los `preconnect` de la plantilla.
- Eliminar Geist y Geist Mono (`next/font/google`) del layout.
- En `app/layout.tsx`: `<html lang="es">`, y `<div class="av-bg">`, `<div class="av-noise">` y `<div id="root">` dentro de `<body>`, en ese orden. `children` se renderiza dentro de `#root`.
- Quitar las clases de Tailwind de ejemplo de `<html>` y `<body>` (`h-full`, `antialiased`, `min-h-full flex flex-col`), porque el CSS del tema ya cubre esos estilos.
- Metadata: `title: "Arcade Vault · Portal Retro"` y una descripción en español.
- Reemplazar `app/page.tsx` por un placeholder mínimo que use `.av-hero` (título `ARCADE VAULT` + subtítulo) para comprobar fuentes y colores.

**Fuera de alcance (para futuras specs):**

- Navbar, biblioteca, detalle, reproductor, auth y salón de la fama como componentes.
- Dividir el CSS en varios archivos.
- Modo claro o selector de tema.
- Panel de "tweaks" de la plantilla (las clases `.tw-*` se copian, pero no se usan).
- Borrar los assets de ejemplo de `public/` (`next.svg`, etc.).

## Modelo de datos

Esta feature no introduce estructuras de datos. Solo introduce tokens de diseño.

Tokens CSS (se copian sin cambios de `styles.css`, en `:root`):

```css
--bg, --bg-2, --bg-3, --ink, --ink-dim, --ink-faint,
--cyan, --magenta, --yellow, --green, --gold, --silver, --bronze,
--line, --line-2, --pixel, --mono
```

Mapeo a Tailwind v4 (`@theme inline`):

```css
@theme inline {
  --color-bg: var(--bg);
  --color-bg-2: var(--bg-2);
  --color-bg-3: var(--bg-3);
  --color-ink: var(--ink);
  --color-ink-dim: var(--ink-dim);
  --color-ink-faint: var(--ink-faint);
  --color-cyan: var(--cyan);
  --color-magenta: var(--magenta);
  --color-yellow: var(--yellow);
  --color-green: var(--green);
  --color-gold: var(--gold);
  --color-silver: var(--silver);
  --color-bronze: var(--bronze);
  --color-line: var(--line);
  --color-line-2: var(--line-2);
  --font-pixel: var(--pixel);
  --font-mono: var(--mono);
}
```

Con esto quedan disponibles utilidades como `text-cyan`, `bg-bg-2`, `border-line`, `font-pixel` y `font-mono`.

Estructura del layout raíz:

```tsx
<html lang="es">
  <head>{/* preconnect + <link> de Google Fonts */}</head>
  <body>
    <div className="av-bg" />
    <div className="av-noise" />
    <div id="root">{children}</div>
  </body>
</html>
```

## Plan de implementación

1. Reescribir `app/globals.css`: `@import "tailwindcss";`, el contenido completo de `styles.css` y el bloque `@theme inline`. Borrar los tokens de ejemplo. Prueba manual: `next dev` arranca sin errores de CSS.
2. Reescribir `app/layout.tsx`: quitar Geist, poner `lang="es"`, añadir el `<head>` con los `<link>` de fuentes, los divs `.av-bg` / `.av-noise` / `#root`, quitar las clases de ejemplo y actualizar la metadata. Prueba manual: la página muestra fondo oscuro con cuadrícula animada.
3. Reemplazar `app/page.tsx` por el placeholder con `.av-hero` (`<h1>ARCADE VAULT</h1>` y subtítulo `.sub` con cursor `.blink`). Prueba manual: el título se ve en Press Start 2P con el degradado blanco→cian→magenta.
4. Ejecutar `/verify` (tsc + lint + build).

## Criterios de aceptación

- [ ] `app/globals.css` contiene todas las reglas de `references/templates/styles.css` (líneas 1–951) sin omisiones.
- [ ] `app/globals.css` empieza con `@import "tailwindcss";` y contiene el bloque `@theme inline` del modelo de datos.
- [ ] `app/globals.css` ya no contiene `--background`, `--foreground` ni `Arial`.
- [ ] `app/layout.tsx` no importa `next/font/google`.
- [ ] El HTML servido tiene `<html lang="es">` y `<title>Arcade Vault · Portal Retro</title>`.
- [ ] El `<head>` incluye los `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`, y el `<link>` con Press Start 2P, Courier Prime 400/700 y JetBrains Mono 400/500/700.
- [ ] `<body>` contiene `.av-bg`, `.av-noise` y `#root`, en ese orden, y el contenido de la página está dentro de `#root`.
- [ ] En DevTools, el título de la home usa la fuente Press Start 2P (pestaña "Fonts" / "Rendered fonts").
- [ ] La cuadrícula del fondo se anima y las scanlines son visibles, igual que en `Arcade Vault.html`.
- [ ] Una clase de prueba como `text-cyan` aplica el color `#00f5ff`.
- [ ] `/verify` pasa (tsc, lint y build sin errores).

## Decisiones

- **Sí:** `<link>` a Google Fonts en el layout. Lo eligió el usuario para replicar la plantilla tal cual.
- **No:** `next/font/google`. Evita el FOUT y no hace peticiones externas, pero el usuario prefirió el método de la plantilla.
- **Sí:** `<div id="root">` en el layout. El CSS se copia sin renombrar selectores.
- **No:** renombrar `#root` a `.av-app`. Haría divergir el CSS del original.
- **Sí:** `.av-bg` y `.av-noise` fijos en el layout raíz. Todas las páginas comparten el fondo.
- **Sí:** mapear tokens en `@theme inline` conservando las variables originales. Permite usar tanto las clases de la plantilla como utilidades de Tailwind.
- **Sí:** `--font-mono` de Tailwind apunta a la fuente mono del tema (JetBrains Mono), en lugar de la mono por defecto de Tailwind.
- **Sí:** copiar todo `styles.css` a un solo `app/globals.css`. Es más fácil compararlo con el original.
- **No:** dividir el CSS por secciones. No aporta nada mientras exista un único tema.
- **Sí:** placeholder mínimo en `app/page.tsx`. La página de ejemplo quedaría rota visualmente con el tema nuevo.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El preflight de Tailwind (reset de márgenes, bordes, botones) difiere de los estilos por defecto del navegador sobre los que se diseñó la plantilla. | Comparar la home con `Arcade Vault.html` lado a lado. Si una regla se ve distinta, se corrige en `globals.css` en la spec de esa pantalla. |
| La regla de lint `@next/next/no-page-custom-font` u otra advertencia sobre `<link>` de fuentes. | Revisar la salida de `/verify`. Si la regla aplica, documentarlo y desactivarla de forma puntual con justificación. |
| Sin conexión a Google Fonts, el texto cae a `system-ui` / `monospace`. | Aceptado: las pilas de fuentes de la plantilla ya incluyen esos fallbacks. |
| La regla `#root { height: 100% }` de la plantilla asume que `#root` es hijo directo de `body`. | El layout pone `#root` como hijo directo de `<body>`, igual que la plantilla. |

## Lo que **no** está en esta spec

- Componentes de pantalla (navbar, biblioteca, detalle, reproductor, auth, salón).
- División del CSS en varios archivos.
- Modo claro o selector de tema.
- Panel de tweaks.
- Limpieza de `public/`.

Cada uno de estos, si llega, va en su propia spec.
