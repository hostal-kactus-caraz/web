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

/* --- TARJETA CON GIRO 3D ELEGANTE --- */
.neon-yellow-box {
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(147, 197, 253, 0.4);
  box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.2);
  position: relative;
  perspective: 1000px;
  animation: cardFullSpin 12s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes cardFullSpin {
  0%, 100% { transform: rotateY(0deg) scale(1); }
  25% { transform: rotateY(8deg) scale(1.01); }
  75% { transform: rotateY(-8deg) scale(1.01); }
}

/* --- BOTÓN CELESTE SUAVE / PROFESIONAL (ESTILO MODERN WEB) --- */
.neon-blink-btn {
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: #ffffff;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
  animation: softPulse 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

.neon-blink-btn:hover {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.6);
}

@keyframes softPulse {
  0%, 100% {
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
    filter: brightness(1);
  }
  50% {
    box-shadow: 0 4px 22px rgba(56, 189, 248, 0.8);
    filter: brightness(1.1);
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
