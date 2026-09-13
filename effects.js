/* ==========================================================
   HOSTAL KACTUS - MOTOR DE EFECTOS, THREE.JS Y TRADUCCIÓN (effects.js)
   ========================================================== */

let currentLang = 'es';

document.addEventListener("DOMContentLoaded", function() {
  // 1. Inicializar Fondo Animado WebGL (Three.js) en el Banner
  initThreeBackground();

  // 2. Ajustar fechas iniciales en la calculadora de reservas
  const today = new Date();
  const checkinDate = new Date(today);
  const checkoutDate = new Date(today);
  checkoutDate.setDate(today.getDate() + 2);

  const checkinEl = document.getElementById('calcCheckin');
  const checkoutEl = document.getElementById('calcCheckout');
  if (checkinEl && checkoutEl) {
    checkinEl.valueAsDate = checkinDate;
    checkoutEl.valueAsDate = checkoutDate;
    calculateTotal();
  }
});

/* Fondo dinámico sutil con Three.js */
function initThreeBackground() {
  const container = document.getElementById('webgl-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const count = 70;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x10b981, size: 0.05, transparent: true, opacity: 0.6 });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0005;
    points.rotation.x += 0.0002;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });
}
