@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --primary: #10b981;
  --primary-glow: rgba(16, 185, 129, 0.4);
  --accent: #fbbf24;
  --bg-slate: #f8fafc;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-slate);
  color: #1e293b;
  overflow-x: hidden;
}

/* --- TARJETA CON EFECTO DE GIRO CONSTANTE EN 3D --- */
.neon-yellow-box {
  background: rgba(15, 23, 42, 0.92);
  border: 2px solid #fbbf24;
  box-shadow: 0 0 35px rgba(251, 191, 36, 0.8), inset 0 0 20px rgba(251, 191, 36, 0.3);
  position: relative;
  perspective: 1000px;
  animation: cardFullSpin 10s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes cardFullSpin {
  0%, 100% {
    transform: rotateY(0deg) scale(1);
  }
  20% {
    transform: rotateY(15deg) scale(1.02);
  }
  40% {
    transform: rotateY(0deg) scale(1);
  }
  60% {
    transform: rotateY(-15deg) scale(1.02);
  }
  80% {
    transform: rotateY(0deg) scale(1);
  }
}

/* --- BOTÓN AMARILLO "DESBLOQUEAR" CON PARPARDEO INTENSO --- */
.neon-blink-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #0f172a;
  font-weight: 800;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.9);
  animation: neonBlinkFast 0.8s ease-in-out infinite;
  transition: transform 0.2s ease;
}

.neon-blink-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 0 30px rgba(251, 191, 36, 1);
}

@keyframes neonBlinkFast {
  0%, 100% {
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
    filter: brightness(1);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 25px rgba(251, 191, 36, 1), 0 0 45px rgba(255, 255, 255, 0.9);
    filter: brightness(1.3);
    transform: scale(1.05);
  }
}

/* --- FOTOS DE EQUIPOS CLICKEABLES --- */
.zoomable-img {
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.zoomable-img:hover {
  transform: scale(1.03);
  filter: brightness(1.05);
}

#imageModal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  align-items: center;
  justify-content: center;
  padding: 20px;
}

#imageModal img {
  max-width: 90%;
  max-height: 90vh;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  border: 2px solid #10b981;
}

/* Tarjetas generales */
.kactus-card {
  background: #ffffff;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.kactus-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -12px rgba(16, 185, 129, 0.2);
  border-color: #10b981;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}

.carousel-slide {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.lang-container::-webkit-scrollbar {
  height: 4px;
}
.lang-container::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #10b981, #3b82f6);
  border-radius: 4px;
}
