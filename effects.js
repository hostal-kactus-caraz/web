/* ==========================================================
   HOSTAL KACTUS - MOTOR DE EFECTOS 3D Y LÓGICA (effects.js)
   ========================================================== */

let currentLang = 'es';

document.addEventListener("DOMContentLoaded", function() {
  // 1. Notificación de Visita en Telegram
  const visitorKey = "kactus_visited_session";
  if (!sessionStorage.getItem(visitorKey)) {
    sessionStorage.setItem(visitorKey, "true");
    const botToken = "8868918432:AAFUcTrY3FvY-dJwrvwnH8-IZ2kP_TIVpG0"; 
    const chatId = "2071321925"; 
    const horaLocal = new Date().toLocaleTimeString();
    const idiomaNavegador = navigator.language || navigator.userLanguage;
    const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? "📱 Celular / Móvil" : "💻 Computadora / PC";
    const mensaje = `🚨 *¡Nuevo visitante en Hostal Kactus!*\n\n`+
                    `🕒 Hora: ${horaLocal}\n`+
                    `🌐 Idioma: ${idiomaNavegador}\n`+
                    `💻 Dispositivo: ${dispositivo}\n`+
                    `📍 Caraz, Perú`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(mensaje)}&parse_mode=Markdown`;
    const img = new Image();
    img.src = url;
  }

  // 2. Acceso directo por URL (?acceso=vip)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('acceso') === 'vip') {
    const secretSection = document.getElementById('secretGuide');
    if (secretSection) {
      secretSection.classList.remove('hidden');
      setTimeout(() => secretSection.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  }

  // 3. Inicializar Fechas en Calculadora
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

  // 4. Inicializar Motor 3D & Glare en elementos con .effect-3d
  init3DEffects();

  // 5. Inicializar Canvas del Banner (Partículas / Estrellas andinas)
  initHeroCanvas();
});

/* Motor de Inclinación 3D y Efecto Glare */
function init3DEffects() {
  const cards = document.querySelectorAll('.effect-3d');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = -((y - centerY) / centerY) * 7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* Canvas Dinámico de Fondo para el Banner */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.offsetWidth;
  let height = canvas.height = canvas.parentElement.offsetHeight;

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const particles = [];
  const count = Math.floor(width / 30);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#10b981';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
      ctx.fill();
      p.y -= p.speedY;
      if (p.y < 0) p.y = height;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* Control de Carruseles */
const slideIndexes = { carousel1: 0, carousel2: 0, pubCarousel1: 0, pubCarousel2: 0, pubCarousel3: 0 };

function moveSlide(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  const slide = carousel.querySelector('.carousel-slide');
  const items = slide.children;
  slideIndexes[carouselId] = (slideIndexes[carouselId] + direction + items.length) % items.length;
  slide.style.transform = `translateX(-${slideIndexes[carouselId] * 100}%)`;
}

function openModal(imgSrc) {
  document.getElementById('modalImg').src = imgSrc;
  document.getElementById('imageModal').style.display = 'flex';
}

function toggleCalculator() {
  const panel = document.getElementById('calculatorPanel');
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function calculateTotal() {
  const roomPrice = parseFloat(document.getElementById('calcRoom').value) || 0;
  const checkinVal = document.getElementById('calcCheckin').value;
  const checkoutVal = document.getElementById('calcCheckout').value;
  let nights = 1;
  if (checkinVal && checkoutVal) {
    const d1 = new Date(checkinVal);
    const d2 = new Date(checkoutVal);
    const diffTime = d2 - d1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) nights = diffDays;
  }
  document.getElementById('calcNightsDisplay').value = `${nights} ${nights === 1 ? 'noche' : 'noches'}`;
  let grandTotal = roomPrice * nights;
  document.getElementById('totalPriceDisplay').innerText = `S/ ${grandTotal.toFixed(2)}`;
}

function sendInteractiveReservation() {
  const roomSelect = document.getElementById('calcRoom');
  const roomName = roomSelect.options[roomSelect.selectedIndex].text;
  const checkin = document.getElementById('calcCheckin').value || 'Por coordinar';
  const checkout = document.getElementById('calcCheckout').value || 'Por coordinar';
  const nightsDisplay = document.getElementById('calcNightsDisplay').value;
  const guests = document.getElementById('calcGuests').value;
  const totalPrice = document.getElementById('totalPriceDisplay').innerText;
  const msg = `Hola Hostal Kactus 👋, deseo confirmar mi reserva:\n\n🛏️ *Habitación:* ${roomName}\n📅 *Entrada:* ${checkin}\n🚪 *Salida:* ${checkout}\n🌙 *Estadía:* ${nightsDisplay}\n👥 *Huéspedes:* ${guests}\n💰 *Total:* ${totalPrice}`;
  window.open(`https://wa.me/51974364826?text=${encodeURIComponent(msg)}`, '_blank');
}

function bookRoomDirect(price, roomKey) {
  const roomNames = {
    es: { eco: 'Habitación Matrimonial Económica', med: 'Habitación Matrimonial Mediana' },
    en: { eco: 'Economy Double Room', med: 'Medium Double Room' },
    fr: { eco: 'Chambre Double Économique', med: 'Chambre Double Standard' },
    cs: { eco: 'Ekonomický dvoulůžkový pokoj', med: 'Standardní dvoulůžkový pokoj' },
    zh: { eco: '经济双人房', med: '中等双人房' },
    pt: { eco: 'Quarto Matrimonial Econômico', med: 'Quarto Matrimonial Médio' },
    de: { eco: 'Wirtschaftliches Doppelzimmer', med: 'Mittelgroßes Doppelzimmer' },
    ru: { eco: 'Эконом двухместный номер', med: 'Стандартный двухместный номер' }
  };
  const langDict = roomNames[currentLang] || roomNames['es'];
  const roomTitle = langDict[roomKey] || 'Habitación Matrimonial Mediana';
  const msg = `Hola Hostal Kactus 👋, deseo reservar la *${roomTitle}* (S/ ${price}.00 por noche). ¡Gracias!`;
  window.open(`https://wa.me/51974364826?text=${encodeURIComponent(msg)}`, '_blank');
}

function sendGlobalWhatsApp() {
  const msg = "Hola Hostal Kactus 👋, quisiera hacer una consulta o reserva.";
  window.open(`https://wa.me/51974364826?text=${encodeURIComponent(msg)}`, '_blank');
}

function unlockGuide() {
  const pass = document.getElementById('passInput').value.trim();
  const secretSection = document.getElementById('secretGuide');
  if (pass === '301298') {
    secretSection.classList.remove('hidden');
    secretSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert('Contraseña incorrecta. Solicita la clave oficial en recepción.');
  }
}

function unlockTopGuide() {
  const pass = document.getElementById('topPassInput').value.trim();
  const secretSection = document.getElementById('secretGuide');
  if (pass === '301298') {
    secretSection.classList.remove('hidden');
    secretSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert('Contraseña incorrecta. Solicita la clave oficial en recepción.');
  }
}

function handleKey(e) { if (e.key === 'Enter') unlockGuide(); }
function handleTopKey(e) { if (e.key === 'Enter') unlockTopGuide(); }

const translations = {
  es: {
    whatsappFloatText: "¡Reserva o consúltanos!",
    navLocationSub: "Caraz · Perú",
    navCodeText: "Código de Huésped",
    topAccessTitle: "¿Ya tienes tu código de bienvenida?",
    topAccessDesc: "Ingrésalo aquí para acceder de inmediato a la guía completa de la zona, recomendaciones locales, Wi-Fi de alta velocidad y tarifas especiales.",
    topPassPlaceholder: "Escribe tu código aquí...",
    topUnlockBtn: "Ver Contenido",
    heroTitleStart: "Tu descanso cómodo, seguro y completo en",
    heroSubtitle: "Disfruta de habitaciones acogedoras, agua caliente 24/7 y la mejor ubicación para tus aventuras en la Cordillera Blanca.",
    btnOpenCalc: "🗓️ ¡Reserva / Cotiza en Línea!",
    btnWhatsappDir: "Contacto Directo WhatsApp",
    lblBadgePay: "Aceptamos Todas las Tarjetas & Efectivo",
    calcPanelTitle: "Calculadora y Cotización en Línea",
    btnCloseCalc: "✕ Cerrar",
    lblRoomType: "Tipo de Habitación",
    optEco: "Matrimonial Económica (S/ 35)",
    optMed: "Matrimonial Mediana (S/ 45)",
    lblCheckinDate: "Día de Entrada",
    lblCheckoutDate: "Check-out (Salida)",
    lblNights: "Número de Noches",
    lblGuests: "Cantidad de Huéspedes",
    optG1: "1 Huésped",
    optG2: "2 Huéspedes",
    lblTotalEst: "Cotización Estimada Total",
    btnConfirmRes: "Confirmar y Reservar por WhatsApp",
    badgeBooking: "Fabuloso · Excelente Ubicación",
    publicAttractionsTitle: "Maravillas Naturales que Debes Visitar",
    publicAttractionsDesc: "Hostal Kactus es tu punto de partida ideal para conocer los paisajes más imponentes de la Cordillera Blanca y los Conchucos.",
    badgeParon: "Laguna Parón",
    badgeL69: "Laguna 69",
    badgeCanon: "Cañón del Pato",
    pubParonTitle: "La Laguna Turquesa Más Grande",
    pubParonDesc: "Impresionante espejo de agua rodeado por imponentes picos nevados como el Artesonraju.",
    pubL69Title: "Trekking de Alta Montaña",
    pubL69Desc: "Una aventura inolvidable bajo los nevados Huascarán y Chacraraju con aguas de intenso color celeste.",
    pubCanonTitle: "Ruta de Túneles y Acantilados",
    pubCanonDesc: "Un impresionante desfiladero donde convergen la Cordillera Negra y Blanca con decenas de túneles en la roca.",
    pubViewGuide: "Ver detalles y precios en guía",
    titleRooms: "Nuestras Habitaciones",
    roomsBadge: "Garantía Mejor Precio Directo",
    room1Tag: "ECONÓMICA & CONFORT",
    bannerCodeTitle: "¿Tienes tu código de reserva?",
    bannerCodeDesc: "Usa aquí tu código brindado por el alojamiento y encuentra precios protegidos, indicaciones y más.",
    bannerCodeBtn: "Ir a Sección Reservada",
    room1Title: "Habitación Matrimonial Económica",
    room1Desc: "Habitación pequeña y acogedora con cama de 2 plazas. Ideal para parejas o viajeros solos.",
    perNight1: "promedio por noche",
    perNight2: "promedio por noche",
    btnBookDirectText: "Reservar Habitación",
    room2Tag: "MÁS POPULAR",
    room2Title: "Habitación Matrimonial Mediana",
    room2Desc: "Habitación espaciosa con cama de 2 plazas, gran iluminación natural y armario.",
    titleCamping: "Alquiler de Equipos de Camping y Trekking",
    gear1Name: "Carpa 3 Estaciones",
    gear1Desc: "Carpa resistente para alta montaña.",
    gear3Name: "Bastones de Trekking",
    gear3Desc: "Par de bastones ergonómicos.",
    gearColchoneta: "Colchoneta Isolante",
    gearColchonetaDesc: "Aislamiento térmico para carpa.",
    gearKit: "Kit de Cocina Portátil",
    gearKitDesc: "Horninillo compacto con accesorios.",
    gear5Name: "Cocina de Campaña & Ollas",
    gear5Desc: "Incluye set completo de utensilios.",
    gear6Name: "Balón de Gas Nuevo",
    gear6Desc: "Balón sellado para montaña.",
    titleServices: "Servicios e Instalaciones",
    sBath: "Baño Privado",
    sWater: "Agua Caliente 24/7",
    sTv: "TV Smart",
    sWifi: "Wi-Fi Gratis",
    sParking: "Estacionamiento Gratis",
    sLuggage: "Guardado de Equipaje",
    sKitchen: "Cocina Compartida",
    sBreakfast: "Desayunos",
    titleGuideHeading: "Guía Turística de Caraz & Área Reservada",
    gPubDesc: "Bienvenido a nuestra guía oficial. Explora los atractivos imperdibles de la Cordillera Blanca desde Hostal Kactus.",
    privSectionTitle: "🔐 Sección Reservada de Huéspedes (Wi-Fi, Normas, Comodidades y Tours)",
    gPrivDesc: "Ingresa la contraseña proporcionada en recepción para desbloquear toda la información detallada:",
    passPlaceholder: "Contraseña de huésped",
    btnUnlockText: "Desbloquear Sección",
    wifiStickySub: "Conexión de Alta Velocidad (Fija)",
    wifiNetLabel: "Red:",
    wifiNetName: "Segundo Piso",
    wifiPassLabel: "Contraseña:",
    directoryTitle: "📍 Directorio de Lugares Clave en Caraz",
    dirComisariaTitle: "Comisaría PNP Caraz",
    dirComisariaDesc: "Seguridad y apoyo policial ante cualquier emergencia.",
    dirFarmaciaTitle: "Farmacias del Centro",
    dirFarmaciaDesc: "Abastecimiento médico y medicamentos de urgencia.",
    dirEconolicaTitle: "Botica Económica",
    dirEconolicaDesc: "Atención farmacéutica económica y accesible en Caraz.",
    btnMaps: "Ver en Google Maps",
    stkFrom: "Desde",
    stkCalc: "Cotizar",
    stkBtn: "Reservar Ahora"
  }
};

function changeLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('bg-emerald-600', 'text-white'));
  const activeBtn = document.getElementById(`btn-${lang}`);
  if (activeBtn) activeBtn.classList.add('bg-emerald-600', 'text-white');
  const t = translations[lang] || translations['es'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  calculateTotal();
}
