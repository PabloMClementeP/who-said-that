# Quien Lo Dijo

![QuienLoDijo Banner](https://placehold.co/800x200/FFFFFF/000000?text=Quien+Lo+Dijo)

## 📝 Descripción

**QuienLoDijo** es un juego social interactivo donde los participantes responden preguntas en una sala virtual y luego deben adivinar quién dio cada respuesta. El sistema de puntuación recompensa a quienes logran identificar correctamente a los autores de las respuestas.

## ✨ Características

- 🔄 Actualización en tiempo real con Firebase Realtime Database
- 👥 Sistema de salas para múltiples partidas simultáneas
- 🎮 Interfaz intuitiva desarrollada con React y Next
- 📱 Diseño responsivo para jugar desde cualquier dispositivo
- 🏆 Sistema de puntuación y ranking de jugadores

## 🛠️ Tecnologías

- **Frontend**: React, Next
- **Backend**: Firebase (Authentication, Realtime Database)
- **Estilizado**: CSS Modules / Styled Components
- **Despliegue**: Vercel Hosting

## 📋 Requisitos previos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en Firebase

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/PabloMClementeP/who-said-it.git
cd who-said-it
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firebase Authentication y Realtime Database
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_DATABASE_URL=tu_database_url
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
```

### 5. Construir para producción

```bash
npm run build
# o
yarn build
```

## 🎮 Cómo jugar

1. **Crear o unirse a una sala**: Introduce un código de sala para unirte o crea una nueva.
2. **Fase de respuestas**: Todos los jugadores responden a las preguntas mostradas.
3. **Fase de adivinanza**: El sistema muestra una respuesta aleatoria y todos los jugadores deben adivinar quién la escribió.
4. **Puntuación**: Acertar suma 10 puntos al jugador.
5. **Repetición**: Se continúa con todas las respuestas de todos los jugadores.
6. **Ganador**: El jugador con más puntos al final gana la partida.

## 🔥 Integración con Firebase

El proyecto utiliza varias funcionalidades de Firebase:

- **Authentication**: Para el registro y acceso de usuarios
- **Realtime Database**: Para sincronizar en tiempo real:
  - Salas de juego
  - Respuestas de los jugadores
  - Puntuaciones
  - Estado del juego

## 🧠 Lógica del juego

1. **Creación de sala**: Un jugador crea una sala y obtiene un código único
2. **Unirse**: Otros jugadores se unen utilizando el código
3. **Inicio**: Cuando todos están listos, comienza el juego
4. **Preguntas**: Los jugadores responden a preguntas mostradas secuencialmente
5. **Adivinanza**: Se muestran respuestas aleatorias y los jugadores votan
6. **Puntuación**: Se asignan puntos por aciertos
7. **Resultados**: Al final se muestra la clasificación

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## 📞 Contacto

pclementep@gmail.com

Link del proyecto: [proximamente](/)

---

Desarrollado por [Pablo Clemente](https://github.com/PabloMClementeP)
