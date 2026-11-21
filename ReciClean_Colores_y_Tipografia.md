# ReciClean: colores, tipografía y paletas web

> Documento de referencia para el diseño de la página web y materiales de marca.

---

## 1. Colores del logo

| Color | HEX | RGB | Uso en el logo |
|---|---|---|---|
| **Morado ReciClean** | `#6E257B` | 110, 37, 123 | Insignia de fondo, texto "Reciclaje y Limpieza" |
| **Turquesa ReciClean** | `#0797B6` | 7, 151, 182 | "Clean", símbolo de reciclaje, eslogan "¡A tu servicio!" |
| **Blanco** | `#FFFFFF` | 255, 255, 255 | Texto "Reci", fondo |

### Notas de uso
- **Morado:** color principal de la marca. Sirve para títulos, botones y fondos de secciones destacadas. Tiene muy buen contraste sobre blanco (9.5:1), así que funciona también para texto.
- **Turquesa:** color secundario, transmite limpieza y frescura. Sobre blanco tiene contraste bajo (3.4:1), así que úsalo solo en títulos grandes, íconos y detalles.
- **Turquesa oscuro `#056E86`:** variante para texto pequeño, enlaces o botones en turquesa. Cumple contraste de lectura (5.9:1 sobre blanco).

---

## 2. Tipografía

La tipografía exacta del logo no está confirmada. Si la persona que diseñó el logo tiene el archivo original, conviene pedirle el nombre de las fuentes. Mientras tanto, estas son las alternativas gratuitas de Google Fonts más parecidas:

| Elemento del logo | Fuente sugerida | Peso | Uso en la web |
|---|---|---|---|
| "Reci Clean" | **Fredoka** | SemiBold (600) | Títulos y encabezados |
| "Reciclaje y Limpieza" | **Comfortaa** | Bold (700) | Subtítulos cortos, etiquetas, con letras espaciadas |
| "¡A tu servicio!" | **Sacramento** | Regular | Solo frases cortas decorativas, nunca párrafos |
| *(texto general)* | **Nunito** | Regular (400) / Bold (700) | Párrafos, botones, menú. Redondeada como el logo y muy legible |

### Jerarquía sugerida para la web

| Elemento | Fuente | Tamaño escritorio | Tamaño móvil |
|---|---|---|---|
| Título principal (H1) | Fredoka SemiBold | 48 px | 32 px |
| Título de sección (H2) | Fredoka SemiBold | 36 px | 26 px |
| Subtítulo (H3) | Fredoka SemiBold | 22 px | 20 px |
| Etiqueta / sobretítulo | Comfortaa Bold, mayúsculas, espaciado 0.1em | 14 px | 13 px |
| Párrafo | Nunito Regular | 18 px | 16 px |
| Botón | Nunito Bold | 16 px | 16 px |
| Frase decorativa | Sacramento | 40 px | 32 px |

### Código para cargar las fuentes

```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600&family=Comfortaa:wght@700&family=Sacramento&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
```

---

## 3. Paletas para la página web

Las tres paletas mantienen el morado y el turquesa del logo. Lo que cambia es el color de apoyo y el tono general.

### Paleta A · Fresca y limpia ⭐ *(recomendada)*
Mucho blanco, el turquesa da sensación de limpieza y el morado ancla la marca. Es la más fiel al logo.

| Rol | Color | HEX |
|---|---|---|
| Principal (títulos, botón de contacto) | Morado | `#6E257B` |
| Secundario (íconos, detalles) | Turquesa | `#0797B6` |
| Texto y enlaces en turquesa | Turquesa oscuro | `#056E86` |
| Fondo de secciones y tarjetas | Agua | `#EEF8FB` |
| Fondo principal | Blanco | `#FFFFFF` |
| Texto | Ciruela oscuro | `#2B1A33` |

### Paleta B · Eco natural
Suma un verde hoja para reforzar el mensaje de reciclaje y fondos crema más cálidos y humanos.

| Rol | Color | HEX |
|---|---|---|
| Principal (títulos) | Morado | `#6E257B` |
| Secundario (íconos, detalles) | Turquesa | `#0797B6` |
| Acento ecológico (botón de contacto, sección sostenible) | Verde hoja | `#2E7D32` |
| Fondo de secciones y tarjetas | Menta | `#E9F6EE` |
| Fondo principal | Crema | `#FAF7F2` |
| Texto | Verde noche | `#23302A` |

### Paleta C · Institucional
Morado profundo en encabezado y pie para transmitir seriedad ante empresas e instituciones. El amarillo cálido se usa solo para el botón de contacto.

| Rol | Color | HEX |
|---|---|---|
| Encabezado, pie, títulos | Morado profundo | `#3D1347` |
| Secciones destacadas | Morado | `#6E257B` |
| Íconos y detalles | Turquesa | `#0797B6` |
| Botón de contacto | Amarillo acento | `#FFC845` |
| Fondo de secciones y tarjetas | Gris perla | `#F4F3F6` |
| Fondo principal / texto | Blanco `#FFFFFF` / Casi negro `#1E1424` | |

---

## 4. Contraste (legibilidad)

| Combinación | Contraste | ¿Apta para texto? |
|---|---|---|
| Morado `#6E257B` sobre blanco | 9.5:1 | ✅ Sí |
| Blanco sobre morado `#6E257B` | 9.5:1 | ✅ Sí |
| Turquesa `#0797B6` sobre blanco | 3.4:1 | ⚠️ Solo títulos grandes o íconos |
| Turquesa oscuro `#056E86` sobre blanco | 5.9:1 | ✅ Sí |
| Verde hoja `#2E7D32` sobre blanco | 5.1:1 | ✅ Sí |
| Blanco sobre morado profundo `#3D1347` | 15.2:1 | ✅ Sí |
| Morado profundo `#3D1347` sobre amarillo `#FFC845` | 9.8:1 | ✅ Sí |

---

## 5. Variables CSS (Paleta A)

```css
:root {
  --color-morado: #6E257B;
  --color-turquesa: #0797B6;
  --color-turquesa-oscuro: #056E86;
  --color-agua: #EEF8FB;
  --color-blanco: #FFFFFF;
  --color-texto: #2B1A33;

  --font-titulos: 'Fredoka', sans-serif;
  --font-etiquetas: 'Comfortaa', sans-serif;
  --font-decorativa: 'Sacramento', cursive;
  --font-texto: 'Nunito', sans-serif;
}
```

---

## 6. Reglas rápidas

- **Regla 60-30-10:** 60 % fondo claro, 30 % morado, 10 % turquesa o acento.
- **Un solo color para el botón de contacto** en toda la web, siempre el mismo.
- **Máximo dos fuentes por pantalla** además de la decorativa, y la decorativa solo una vez por sección.
- Deja alrededor del logo un **margen libre** igual al alto de la letra "R".
- No estires, rotes ni cambies los colores del logo.
- Tamaño mínimo del logo en pantalla: **120 px de ancho**.
