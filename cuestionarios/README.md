# Cuestionarios para Llégate a Lechería

Cada cuestionario se abre con un enlace público, sin iniciar sesión, y las respuestas
llegan solas a un Google Sheet tuyo (una fila por persona, una columna por pregunta).
Se guardan mientras la persona escribe, así que ves el avance aunque no haya tocado "Enviar".

| Archivo | Qué es |
|---|---|
| `Code.gs` | Servidor: publica la página y guarda las respuestas en el Sheet |
| `Formulario.html` | Diseño y funcionamiento del cuestionario (compartido por todos) |
| `preguntas_alejandro.html` | Preguntas de Alejandro para Naylu |

## Publicarlo (una sola vez, unos 5 minutos)

1. Crea un Google Sheet nuevo, por ejemplo **"Cuestionarios Llégate"**.
2. En el Sheet: **Extensiones → Apps Script**.
3. En el editor:
   - Borra lo que trae `Code.gs` y pega el contenido de `Code.gs`.
   - **+ → HTML**, nómbralo `Formulario` (sin `.html`) y pega `Formulario.html`.
   - **+ → HTML**, nómbralo `preguntas_alejandro` y pega `preguntas_alejandro.html`.
   - Guarda (icono del disquete).
4. **Implementar → Nueva implementación → Tipo: Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
5. Autoriza los permisos que pide Google (es tu propio script accediendo a tu Sheet).
   Si sale "Google no ha verificado esta app": **Configuración avanzada → Ir a (nombre del proyecto)**.
6. Copia la **URL de la aplicación web** (termina en `/exec`). Ese es el enlace para Naylu.

Las respuestas aparecen en la pestaña **"Respuestas Alejandro"** del Sheet.

## Cambiar preguntas después de publicar

Edita el archivo en Apps Script y luego **Implementar → Gestionar implementaciones → ✏️ →
Versión: Nueva versión → Implementar**. El enlace no cambia.

## Añadir el cuestionario del chatbot (Luis Enrique)

1. Crear `preguntas_chatbot.html` con el mismo formato que `preguntas_alejandro.html`.
2. En `Code.gs`, activar la línea `chatbot` dentro de `FORMS`.
3. Nueva versión de la implementación. Su enlace es el mismo con `?f=chatbot` al final.
   Sus respuestas van a la pestaña **"Respuestas Chatbot"**.
