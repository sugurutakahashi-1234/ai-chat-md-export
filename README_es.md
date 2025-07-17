# exportación ai-chat-md

[](https://www.npmjs.com/package/ai-chat-md-export)![versión npm](https://img.shields.io/npm/v/ai-chat-md-export.svg)[](https://github.com/sugurutakahashi-1234/homebrew-tap)![Cerveza casera](https://img.shields.io/badge/Homebrew-tap-orange.svg)[](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci-push-main.yml)![CI](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci-push-main.yml/badge.svg)[](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-npm-release.yml)![Versión de npm](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-npm-release.yml/badge.svg)[](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-homebrew-release.yml)![Lanzamiento de Homebrew](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-homebrew-release.yml/badge.svg)[](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export)![código decodificador](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export/graph/badge.svg?token=KPN7UZ7ATY)[](https://opensource.org/licenses/MIT)![Licencia: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)[![Descargas de npm](https://img.shields.io/npm/dm/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)[](https://bundlephobia.com/package/ai-chat-md-export)![tamaño del paquete npm](https://img.shields.io/bundlephobia/min/ai-chat-md-export)[![Tipos](https://img.shields.io/npm/types/ai-chat-md-export)](https://www.npmjs.com/package/ai-chat-md-export)

Convierte el historial de chat de ChatGPT y Claude en archivos Markdown legibles

[Inglés](README.md) |[日本語](README.ja.md)|[简体中文](README.zh-CN.md)

## Inicio rápido

```bash
# 1. Install the tool
npm install -g ai-chat-md-export

# 2. Export your conversations from ChatGPT or Claude
# → Get conversations.json file (see "Getting conversations.json" section below)

# 3. Convert to Markdown
ai-chat-md-export -i conversations.json
```

¡Listo! Tus conversaciones ahora son archivos Markdown organizados y con capacidad de búsqueda.

### Ejemplo de salida

Al ejecutar el comando anterior se generarán archivos como:

```
2025-01-15_Math_Question.md
2025-01-16_Recipe_Help.md
```

Cada archivo contiene una conversación bien formateada con marcas de tiempo, marcadores de usuario/asistente y formato conservado.

## Lo que obtendrás

Transforme exportaciones JSON complejas en Markdown limpio y legible:

### Entrada (conversations.json de ChatGPT)

```json
{
  "title": "Hello World",
  "create_time": 1736899200,
  "mapping": {
    "msg-1": {
      "message": {
        "author": { "role": "user" },
        "content": {
          "parts": ["Hello! How are you?"]
        }
      }
    },
    "msg-2": {
      "message": {
        "author": { "role": "assistant" },
        "content": {
          "parts": ["Hi there! I'm doing well, thank you for asking. How can I help you today?"]
        }
      }
    }
  }
}
```

### → Salida (2025-01-15_Hello_World.md)

```markdown
# Hello World
Date: 2025-01-15 18:00:00 +09:00

---

## 👤 User
Date: 2025-01-15 18:00:00 +09:00

Hello! How are you?

---

## 🤖 Assistant
Date: 2025-01-15 18:00:10 +09:00

Hi there! I'm doing well, thank you for asking. How can I help you today?

---
```

✨ **Características** : Formato limpio • Marcas de tiempo • Marcadores visuales • Conserva bloques de código y formato

## Instalación

### Homebrew (macOS/Linux)

```bash
brew tap sugurutakahashi-1234/tap
brew install ai-chat-md-export
```

### npm

```bash
npm install -g ai-chat-md-export
```

### Descarga directa (Windows/Otros)

Los binarios prediseñados están disponibles en la [página de lanzamientos](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases/latest) .

#### Ventanas

1. Descargar [ai-chat-md-export-windows-amd64.zip](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases/latest/download/ai-chat-md-export-windows-amd64.zip)
2. Extraer el archivo zip
3. Agregue la carpeta extraída a su PATH o ejecute directamente:
    ```cmd
    ai-chat-md-export.exe -i conversations.json
    ```

#### macOS / Linux

Descargue el archivo `.tar.gz` apropiado de la página de versiones para su plataforma.

## ¿Qué es ai-chat-md-export?

`ai-chat-md-export` es una herramienta CLI que convierte sus conversaciones de ChatGPT y Claude en archivos Markdown organizados y legibles.

### Beneficios clave

- **Conserva tus chats de IA** antes de que se pierdan o se eliminen
- **Formato legible** para una fácil visualización en cualquier editor Markdown
- **Busca y organiza** tu historial de chat con herramientas estándar
- **Compartir o controlar versiones** de conversaciones según sea necesario

## Privacidad y seguridad

### Diseño offline primero

Esta herramienta está diseñada para funcionar **localmente en su dispositivo** sin necesidad de conexión a Internet:

- **Sin solicitudes de red** : la herramienta en sí no realiza ninguna llamada API externa ni conexiones de red
- **Solo procesamiento local** : todas las operaciones de conversión se realizan completamente en su máquina
- **Sin recopilación de datos** : no incluimos ninguna funcionalidad de análisis, telemetría o seguimiento.
- **Sus datos permanecen locales** : las conversaciones se leen y escriben únicamente en su sistema de archivos local.

Ideal para organizaciones y personas que priorizan la privacidad de sus datos. Puede revisar nuestro [código fuente](https://github.com/sugurutakahashi-1234/ai-chat-md-export) para verificar que la herramienta no contenga código relacionado con la red. Tenga en cuenta que, aunque nuestro código no establece conexiones externas, no podemos garantizar el funcionamiento de todas las dependencias.

## Uso

### Uso básico

```bash
# Convert a single conversations.json file
ai-chat-md-export -i conversations.json

# Convert all JSON files in a directory
ai-chat-md-export -i exports/ -o output/

# Specify output directory
ai-chat-md-export -i conversations.json -o markdown/
```

### Opciones de filtrado

```bash
# Filter by date range
ai-chat-md-export -i conversations.json --since 2024-01-01 --until 2024-12-31

# Search for specific keywords
ai-chat-md-export -i conversations.json --search "API"

# Combine filters
ai-chat-md-export -i conversations.json --since 2024-01-01 --search "Python"
```

### Otras opciones

```bash
# Preview what would be converted without creating files
ai-chat-md-export -i conversations.json --dry-run

# Quiet mode (suppress progress messages)
ai-chat-md-export -i conversations.json --quiet
```

## Opciones de la línea de comandos

Opción | Descripción | Por defecto
--- | --- | ---
`-i, --input <path>` | Ruta del archivo o directorio de entrada (obligatorio) | -
`-o, --output <path>` | Directorio de salida | `.`
`-f, --format <format>` | Formato de entrada ( `chatgpt` / `claude` / `auto` ) | `auto`
`--since <date>` | Filtrar por fecha (AAAA-MM-DD) | -
`--until <date>` | Filtrar hasta fecha (AAAA-MM-DD) | -
`--search <keyword>` | Buscar en conversaciones | -
`--filename-encoding <encoding>` | Codificación de nombre de archivo ( `standard` / `preserve` ) | `standard`
`-q, --quiet` | Suprimir mensajes de progreso | -
`--dry-run` | Modo de vista previa sin crear archivos | -

## Obtener conversaciones.json

Tanto ChatGPT como Claude te permiten exportar tu historial de chat como un archivo `conversations.json` . Este archivo contiene todas tus conversaciones en un formato estructurado que nuestra herramienta puede procesar.

### Exportar desde ChatGPT (OpenAI)

1. Inicie sesión en ChatGPT (https://chat.openai.com)
2. Haz clic en tu foto de perfil → Configuración
3. Abra "Controles de datos" desde el menú de la izquierda
4. Haga clic en "Exportar datos" → "Exportar"
5. Confirme haciendo clic en "Confirmar exportación"
6. En unos minutos, recibirás un correo electrónico que dice "Tu exportación de datos de ChatGPT está lista".
7. Descargue `chatgpt-data.zip` desde el enlace (caduca en 24 horas)
8. Extraiga el archivo ZIP para encontrar `conversations.json` en el directorio raíz

Nota: El enlace de descarga caduca después de 24 horas, así que descárguelo lo antes posible.

### Exportación de Claude (Antrópico)

1. Inicia sesión en Claude (https://claude.ai)
2. Haz clic en tus iniciales en la parte inferior izquierda → Configuración
3. Abra la pestaña "Privacidad" (o "Administración de datos" para empresas)
4. Haga clic en "Exportar datos" y confirme.
5. En unos minutos, recibirás un correo electrónico que dice "Tu exportación de datos de Claude está lista".
6. Descargue el archivo `claude-export.dms` o ZIP
7. Si recibió un archivo `.dms` , cámbiele el nombre a `.zip` y extráigalo
8. Encuentra `conversations.json` en el directorio raíz

## Cómo funciona

La herramienta detecta automáticamente si tu entrada proviene de ChatGPT o de Claude y gestiona la conversión según corresponda. ChatGPT utiliza una estructura de conversación basada en árbol, mientras que Claude utiliza una matriz de mensajes plana; sin embargo, no tienes que preocuparte por estas diferencias: la herramienta se encarga de todo.

Características principales:

- **Detección automática** : identifica automáticamente el formato
- **Conserva el formato** : se mantienen los bloques de código, las listas y los caracteres especiales.
- **Marcas de tiempo** : convierte todas las marcas de tiempo a su zona horaria local
- **Salida limpia** : genera Markdown legible con una clara separación de mensajes

## Detalles del filtrado de fechas

Las opciones `--since` y `--until` filtran las conversaciones según cuándo se **iniciaron** , no cuándo se actualizaron por última vez:

- **ChatGPT** : utiliza el campo `create_time` de la exportación
- **Claude** : utiliza el campo `created_at` de la exportación
- **Formato de fecha** : AAAA-MM-DD (p. ej., 15/01/2024)
- **Zona horaria** : todas las fechas se interpretan en su zona horaria local
- **Filtrado inclusivo** : las fechas --desde y --hasta son inclusivas

Ejemplos:

```bash
# Conversations from 2024
ai-chat-md-export -i data.json --since 2024-01-01 --until 2024-12-31

# Conversations from the last 30 days (if today is 2024-12-15)
ai-chat-md-export -i data.json --since 2024-11-15

# Only conversations from a specific day
ai-chat-md-export -i data.json --since 2024-06-01 --until 2024-06-01
```

## Funcionalidad de búsqueda

La opción `--search` proporciona potentes capacidades de filtrado:

- **No distingue entre mayúsculas y minúsculas** : coincide con "API", "api", "Api", etc.
- **Busca en todas partes** : tanto en los títulos de las conversaciones como en todo el contenido de los mensajes.
- **Coincidencia parcial** : "aprender" coincide con "aprendizaje", "aprendizaje automático", etc.
- **Varias palabras** : busca la frase exacta tal como se ingresó

Ejemplos:

```bash
# Find all conversations about Python
ai-chat-md-export -i data.json --search "python"

# Search for a specific error message
ai-chat-md-export -i data.json --search "TypeError: cannot read property"

# Combine with date filtering
ai-chat-md-export -i data.json --search "docker" --since 2024-01-01
```

## Más ejemplos

Para obtener ejemplos completos con múltiples conversaciones, consulte el directorio de [ejemplos](examples/) :

- **ChatGPT** : [ejemplos de conversaciones](examples/chatgpt/) con diálogos de varios turnos
- **Claude** : [Ejemplos de conversaciones](examples/claude/) con varios tipos de conversación

## Solución de problemas

### Los archivos grandes tardan demasiado en procesarse

La herramienta procesa archivos por lotes. Para historiales de conversaciones muy extensos:

- Utilice `--since` y `--until` para procesar rangos de fechas específicos
- Divida su exportación en varios archivos más pequeños
- Utilice `--search` para extraer solo las conversaciones relevantes

### Problemas de codificación de caracteres

Si ve texto ilegible en su salida:

- Asegúrese de que su terminal admita la codificación UTF-8
- Comprueba que tu archivo `conversations.json` esté codificado correctamente

Para problemas de codificación de nombre de archivo:

- `--filename-encoding standard` (predeterminado): desinfecta los nombres de archivos para lograr la máxima compatibilidad entre sistemas operativos
- `--filename-encoding preserve` : conserva los caracteres originales de los títulos de las conversaciones, pero puede causar problemas en algunos sistemas con caracteres especiales

### Conversaciones perdidas

Si algunas conversaciones no aparecen en la salida:

- Verifique la fecha de exportación: solo se incluyen las conversaciones hasta la fecha de exportación
- Verifique que la estructura JSON coincida con el formato ChatGPT o Claude
- Utilice `--dry-run` para obtener una vista previa de qué conversaciones se convertirán

## Hoja de ruta

### ✅ Funciones completadas

- [x] Soporte para exportación de conversaciones ChatGPT
- [x] Soporte para exportación de conversaciones de Claude
- [x] Detección automática de formato ( `--format auto` )
- [x] Filtrado de rango de fechas ( `--since` , `--until` )
- [x] Funcionalidad de búsqueda de palabras clave ( `--search` )
- [x] Conversión de marca de tiempo teniendo en cuenta la zona horaria
- [x] Modo de ejecución en seco para vista previa ( `--dry-run` )
- [x] Distribución de paquetes npm
- [x] Compatibilidad con fórmulas caseras

### 🚧 En progreso

- [ ] **Exportar a formato JSON** - Opción de salida JSON estructurada
- [ ] **Barra de progreso** : retroalimentación visual para operaciones largas

### 📋 Funciones planificadas

- [ ] **Soporte de Gemini** : Exportar conversaciones desde Google Gemini
- [ ] **Exportar estadísticas** : muestra el recuento de conversaciones, el recuento de mensajes y el rango de fechas

## Contribuyendo

Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## Contacto

Si tienes alguna pregunta o comentario, puedes comunicarte conmigo en X/Twitter: [@ikuraikuraaaaaa](https://x.com/ikuraikuraaaaaa)

## Licencia

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)
