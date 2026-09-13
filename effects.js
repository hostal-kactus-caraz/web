/* ==========================================================
   HOSTAL KACTUS - MOTOR DE EFECTOS 3D Y TRADUCCIÓN (effects.js)
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
    const mensaje = `🚨 *¡Nuevo visitante en Hostal Kactus!*\n\n🕒 Hora: ${horaLocal}\n🌐 Idioma: ${idiomaNavegador}\n💻 Dispositivo: ${dispositivo}\n📍 Caraz, Perú`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(mensaje)}&parse_mode=Markdown`;
    const img = new Image();
    img.src = url;
  }

  // 2. Acceso VIP por URL (?acceso=vip)
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

  // 4. Inicializar Motor 3D & Glare
  init3DEffects();

  // 5. Inicializar Canvas del Banner
  initHeroCanvas();

  // 6. Aplicar idioma por defecto
  changeLanguage('es');
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
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
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
  if (!carousel) return;
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

/* Objeto de Traducciones Globales */
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
  },
  en: {
    whatsappFloatText: "Book or ask us!",
    navLocationSub: "Caraz · Peru",
    navCodeText: "Guest Code",
    topAccessTitle: "Already have your welcome code?",
    topAccessDesc: "Enter it here for immediate access to the full local guide, local recommendations, high-speed Wi-Fi, and special rates.",
    topPassPlaceholder: "Type your code here...",
    topUnlockBtn: "View Content",
    heroTitleStart: "Your comfortable, safe and complete stay in",
    heroSubtitle: "Enjoy cozy rooms, 24/7 hot water and the best location for your adventures in the Cordillera Blanca.",
    btnOpenCalc: "🗓️ Book / Quote Online!",
    btnWhatsappDir: "Direct WhatsApp Contact",
    lblBadgePay: "All Cards & Cash Accepted",
    calcPanelTitle: "Online Calculator & Quote",
    btnCloseCalc: "✕ Close",
    lblRoomType: "Room Type",
    optEco: "Economy Double (S/ 35)",
    optMed: "Medium Double (S/ 45)",
    lblCheckinDate: "Check-in Date",
    lblCheckoutDate: "Check-out Date",
    lblNights: "Number of Nights",
    lblGuests: "Number of Guests",
    optG1: "1 Guest",
    optG2: "2 Guests",
    lblTotalEst: "Estimated Total Quote",
    btnConfirmRes: "Confirm and Book via WhatsApp",
    badgeBooking: "Fabulous · Excellent Location",
    publicAttractionsTitle: "Natural Wonders You Must Visit",
    publicAttractionsDesc: "Hostal Kactus is your ideal starting point to explore the most stunning landscapes of the Cordillera Blanca and Conchucos.",
    badgeParon: "Parón Lagoon",
    badgeL69: "Lagoon 69",
    badgeCanon: "Canon del Pato",
    pubParonTitle: "The Largest Turquoise Lagoon",
    pubParonDesc: "Breathtaking mirror of water surrounded by majestic snowy peaks like Artesonraju.",
    pubL69Title: "High Mountain Trekking",
    pubL69Desc: "An unforgettable adventure beneath Huascarán and Chacraraju with intense sky-blue waters.",
    pubCanonTitle: "Tunnel and Cliff Route",
    pubCanonDesc: "An impressive gorge where the Black and White Cordilleras converge with dozens of tunnels carved in rock.",
    pubViewGuide: "View details and prices in guide",
    titleRooms: "Our Rooms",
    roomsBadge: "Best Direct Price Guarantee",
    room1Tag: "ECONOMY & COMFORT",
    bannerCodeTitle: "Do you have your booking code?",
    bannerCodeDesc: "Use your lodging code here to find protected rates, directions, and more.",
    bannerCodeBtn: "Go to Reserved Section",
    room1Title: "Economy Double Room",
    room1Desc: "Cozy small room with a double bed. Ideal for couples or solo travelers.",
    perNight1: "average per night",
    perNight2: "average per night",
    btnBookDirectText: "Book Room",
    room2Tag: "MOST POPULAR",
    room2Title: "Medium Double Room",
    room2Desc: "Spacious room with a double bed, great natural lighting, and wardrobe.",
    titleCamping: "Camping & Trekking Equipment Rental",
    gear1Name: "3-Season Tent",
    gear1Desc: "Durable tent for high mountain.",
    gear3Name: "Trekking Poles",
    gear3Desc: "Pair of ergonomic poles.",
    gearColchoneta: "Insulating Mat",
    gearColchonetaDesc: "Thermal insulation for tent.",
    gearKit: "Portable Cooking Kit",
    gearKitDesc: "Compact stove with accessories.",
    gear5Name: "Camp Stove & Pots",
    gear5Desc: "Includes complete utensil set.",
    gear6Name: "New Gas Canister",
    gear6Desc: "Sealed canister for mountain.",
    titleServices: "Services & Facilities",
    sBath: "Private Bathroom",
    sWater: "24/7 Hot Water",
    sTv: "Smart TV",
    sWifi: "Free Wi-Fi",
    sParking: "Free Parking",
    sLuggage: "Luggage Storage",
    sKitchen: "Shared Kitchen",
    sBreakfast: "Breakfasts",
    titleGuideHeading: "Caraz Tourist Guide & Reserved Area",
    gPubDesc: "Welcome to our official guide. Explore the must-see attractions of the Cordillera Blanca from Hostal Kactus.",
    privSectionTitle: "🔐 Reserved Guest Section (Wi-Fi, Rules, Amenities & Tours)",
    gPrivDesc: "Enter the password provided at reception to unlock all detailed information:",
    passPlaceholder: "Guest password",
    btnUnlockText: "Unlock Section",
    wifiStickySub: "High-Speed Connection (Fixed)",
    wifiNetLabel: "Network:",
    wifiNetName: "Segundo Piso",
    wifiPassLabel: "Password:",
    directoryTitle: "📍 Key Places Directory in Caraz",
    dirComisariaTitle: "PNP Police Station Caraz",
    dirComisariaDesc: "Security and police support for any emergency.",
    dirFarmaciaTitle: "Downtown Pharmacies",
    dirFarmaciaDesc: "Medical supplies and emergency medications.",
    dirEconolicaTitle: "Botica Económica",
    dirEconolicaDesc: "Affordable and accessible pharmaceutical care in Caraz.",
    btnMaps: "View on Google Maps",
    stkFrom: "From",
    stkCalc: "Quote",
    stkBtn: "Book Now"
  },
  fr: {
    whatsappFloatText: "Réservez ou contactez-nous !",
    navLocationSub: "Caraz · Pérou",
    navCodeText: "Code Invité",
    topAccessTitle: "Avez-vous votre code de bienvenue ?",
    topAccessDesc: "Entrez-le ici pour accéder immédiatement au guide complet, recommandations, Wi-Fi haut débit et tarifs spéciaux.",
    topPassPlaceholder: "Entrez votre code ici...",
    topUnlockBtn: "Voir le contenu",
    heroTitleStart: "Votre séjour confortable, sûr et complet à",
    heroSubtitle: "Profitez de chambres chaleureuses, eau chaude 24h/24 et du meilleur emplacement pour vos aventures dans la Cordillère Blanche.",
    btnOpenCalc: "🗓️ Réserver / Devis en ligne !",
    btnWhatsappDir: "Contact Direct WhatsApp",
    lblBadgePay: "Cartes & Espèces Acceptées",
    calcPanelTitle: "Calculatrice et Devis en Ligne",
    btnCloseCalc: "✕ Fermer",
    lblRoomType: "Type de Chambre",
    optEco: "Double Économique (S/ 35)",
    optMed: "Double Standard (S/ 45)",
    lblCheckinDate: "Date d'Arrivée",
    lblCheckoutDate: "Date de Départ",
    lblNights: "Nombre de Nuits",
    lblGuests: "Nombre d'Invités",
    optG1: "1 Invité",
    optG2: "2 Invités",
    lblTotalEst: "Devis Total Estimé",
    btnConfirmRes: "Confirmer et Réserver par WhatsApp",
    badgeBooking: "Fabuleux · Excellent Emplacement",
    publicAttractionsTitle: "Merveilles Naturelles à Visiter",
    publicAttractionsDesc: "Hostal Kactus est votre point de départ idéal pour explorer les paysages de la Cordillère Blanche.",
    badgeParon: "Lagune Parón",
    badgeL69: "Lagune 69",
    badgeCanon: "Canyon du Pato",
    pubParonTitle: "La Plus Grande Lagune Turquoise",
    pubParonDesc: "Impressionnant miroir d'eau entouré de sommets enneigés comme l'Artesonraju.",
    pubL69Title: "Trekking de Haute Montagne",
    pubL69Desc: "Une aventure inoubliable sous les sommets enneigés avec des eaux bleu intense.",
    pubCanonTitle: "Route des Tunnels et Falaises",
    pubCanonDesc: "Une gorge impressionnante où convergent les Cordillères Noire et Blanche avec des dizaines de tunnels.",
    pubViewGuide: "Voir détails et prix dans le guide",
    titleRooms: "Nos Chambres",
    roomsBadge: "Garantie Meilleur Prix Direct",
    room1Tag: "ÉCONOMIQUE & CONFORT",
    bannerCodeTitle: "Avez-vous votre code de réservation ?",
    bannerCodeDesc: "Utilisez votre code d'hébergement ici pour trouver des tarifs protégés et des indications.",
    bannerCodeBtn: "Aller à la Section Réservée",
    room1Title: "Chambre Double Économique",
    room1Desc: "Petite chambre confortable avec lit double. Idéale pour couples ou voyageurs solos.",
    perNight1: "moyenne par nuit",
    perNight2: "moyenne par nuit",
    btnBookDirectText: "Réserver la Chambre",
    room2Tag: "PLUS POPULAIRE",
    room2Title: "Chambre Double Standard",
    room2Desc: "Chambre spacieuse avec lit double, grande lumière naturelle et placard.",
    titleCamping: "Location d'Équipement de Camping",
    gear1Name: "Tente 3 Saisons",
    gear1Desc: "Tente résistante pour haute montagne.",
    gear3Name: "Bâtons de Trekking",
    gear3Desc: "Paire de bâtons ergonomiques.",
    gearColchoneta: "Matelas Isolant",
    gearColchonetaDesc: "Isolation thermique pour tente.",
    gearKit: "Kit de Cuisine Portable",
    gearKitDesc: "Réchaud compact avec accessoires.",
    gear5Name: "Réchaud de Camp & Casseroles",
    gear5Desc: "Ensemble complet d'ustensiles.",
    gear6Name: "Cartouche de Gaz Neuf",
    gear6Desc: "Cartouche scellée pour la montagne.",
    titleServices: "Services & Installations",
    sBath: "Salle de Bain Privée",
    sWater: "Eau Chaude 24h/24",
    sTv: "TV Smart",
    sWifi: "Wi-Fi Gratuit",
    sParking: "Parking Gratuit",
    sLuggage: "Consigne à Bagages",
    sKitchen: "Cuisine Partagée",
    sBreakfast: "Petits Déjeuners",
    titleGuideHeading: "Guide Touristique de Caraz & Espace Réservé",
    gPubDesc: "Bienvenue dans notre guide officiel. Explorez les incontournables depuis Hostal Kactus.",
    privSectionTitle: "🔐 Section Réservée (Wi-Fi, Règles, Commodités et Tours)",
    gPrivDesc: "Entrez le mot de passe fourni à la réception pour débloquer toutes les informations :",
    passPlaceholder: "Mot de passe invité",
    btnUnlockText: "Débloquer",
    wifiStickySub: "Connexion Haut Débit (Fixe)",
    wifiNetLabel: "Réseau :",
    wifiNetName: "Segundo Piso",
    wifiPassLabel: "Mot de passe :",
    directoryTitle: "📍 Lieux Clés à Caraz",
    dirComisariaTitle: "Commissariat de Police Caraz",
    dirComisariaDesc: "Sécurité et soutien policier en cas d'urgence.",
    dirFarmaciaTitle: "Pharmacies du Centre",
    dirFarmaciaDesc: "Fournitures médicales et médicaments d'urgence.",
    dirEconolicaTitle: "Botica Económica",
    dirEconolicaDesc: "Soins pharmaceutiques abordables et accessibles à Caraz.",
    btnMaps: "Voir sur Google Maps",
    stkFrom: "À partir de",
    stkCalc: "Devis",
    stkBtn: "Réserver"
  },
  cs: {
    whatsappFloatText: "Zarezervujte nebo se zeptejte!",
    navLocationSub: "Caraz · Peru",
    navCodeText: "Kód hosta",
    topAccessTitle: "Máte svůj uvítací kód?",
    topAccessDesc: "Zadejte jej zde pro okamžitý přístup ke kompletnímu průvodci, doporučením, rychlé Wi-Fi a speciálním cenám.",
    topPassPlaceholder: "Zde zadejte svůj kód...",
    topUnlockBtn: "Zobrazit obsah",
    heroTitleStart: "Váš pohodlný, bezpečný a kompletní pobyt v",
    heroSubtitle: "Užijte si útulné pokoje, teplou vodu 24/7 a skvělou polohu pro vaše dobrodružství v Cordillera Blanca.",
    btnOpenCalc: "🗓️ Rezervovat / Spočítat online!",
    btnWhatsappDir: "Přímý kontakt WhatsApp",
    lblBadgePay: "Přijímáme karty i hotovost",
    calcPanelTitle: "Online kalkulačka a nabídka",
    btnCloseCalc: "✕ Zavřít",
    lblRoomType: "Typ pokoje",
    optEco: "Ekonomický dvoulůžkový (S/ 35)",
    optMed: "Střední dvoulůžkový (S/ 45)",
    lblCheckinDate: "Datum příjezdu",
    lblCheckoutDate: "Datum odjezdu",
    lblNights: "Počet nocí",
    lblGuests: "Počet hostů",
    optG1: "1 host",
    optG2: "2 hosté",
    lblTotalEst: "Odhadovaná celková cena",
    btnConfirmRes: "Potvrdit a rezervovat přes WhatsApp",
    badgeBooking: "Báječné · Vynikající poloha",
    publicAttractionsTitle: "Přírodní divy, které musíte navštívit",
    publicAttractionsDesc: "Hostal Kactus je ideálním výchozím bodem pro objevování krajiny v Cordillera Blanca.",
    badgeParon: "Laguna Parón",
    badgeL69: "Laguna 69",
    badgeCanon: "Kaňon del Pato",
    pubParonTitle: "Největší tyrkysová laguna",
    pubParonDesc: "Úchvatné zrcadlo vody obklopené zasněženými vrcholky jako Artesonraju.",
    pubL69Title: "Vysokohorský trek",
    pubL69Desc: "Nezapomenutelné dobrodružství pod Huascaránem s intenzivně modrou vodou.",
    pubCanonTitle: "Trasa tunelů a útesů",
    pubCanonDesc: "Působivá roklina, kde se sbíhají Černá a Bílá kordiléra s desítkami tunelů ve skále.",
    pubViewGuide: "Zobrazit podrobnosti a ceny v průvodci",
    titleRooms: "Naše pokoje",
    roomsBadge: "Záruka nejlepší přímé ceny",
    room1Tag: "EKONOMICKÝ & POHODLNÝ",
    bannerCodeTitle: "Máte svůj rezervační kód?",
    bannerCodeDesc: "Zde použijte svůj kód ubytování a najděte chráněné sazby a pokyny.",
    bannerCodeBtn: "Přejít do vyhrazené sekce",
    room1Title: "Ekonomický dvoulůžkový pokoj",
    room1Desc: "Útulný menší pokoj s manželskou postelí. Ideální pro páry nebo solo cestovatele.",
    perNight1: "průměr za noc",
    perNight2: "průměr za noc",
    btnBookDirectText: "Rezervovat pokoj",
    room2Tag: "NEJOBLÍBENĚJŠÍ",
    room2Title: "Střední dvoulůžkový pokoj",
    room2Desc: "Prostorný pokoj s manželskou postelí, skvělým denním světlem a skříní.",
    titleCamping: "Půjčovna kempingového vybavení",
    gear1Name: "3sezónní stan",
    gear1Desc: "Odolný stan do vysokých hor.",
    gear3Name: "Trekove hole",
    gear3Desc: "Pár ergonomických holí.",
    gearColchoneta: "Izolační podložka",
    gearColchonetaDesc: "Tepelná izolace pro stan.",
    gearKit: "Přenosná kempingová sada",
    gearKitDesc: "Kompaktní vařič s příslušenstvím.",
    gear5Name: "Kempingový vařič a hrnce",
    gear5Desc: "Obsahuje kompletní sadu nádobí.",
    gear6Name: "Nová plynová kartuše",
    gear6Desc: "Utěsněná kartuše do hor.",
    titleServices: "Služby a vybavení",
    sBath: "Soukromá koupelna",
    sWater: "Teplá voda 24/7",
    sTv: "Smart TV",
    sWifi: "Wi-Fi zdarma",
    sParking: "Parkování zdarma",
    sLuggage: "Úschovna zavazadel",
    sKitchen: "Sdílená kuchyně",
    sBreakfast: "Snídaně",
    titleGuideHeading: "Turistický průvodce Caraz a vyhrazená zóna",
    gPubDesc: "Vítejte v našem oficiálním průvodci. Prozkoumejte zajímavosti z Hostal Kactus.",
    privSectionTitle: "🔐 Vyhrazená sekce pro hosty (Wi-Fi, pravidla, vybavení a výlety)",
    gPrivDesc: "Zadejte heslo poskytnuté na recepci pro odemknutí podrobných informací:",
    passPlaceholder: "Heslo hosta",
    btnUnlockText: "Odemknout sekci",
    wifiStickySub: "Vysokorychlostní připojení (pevné)",
    wifiNetLabel: "Síť:",
    wifiNetName: "Segundo Piso",
    wifiPassLabel: "Heslo:",
    directoryTitle: "📍 Adresář klíčových míst v Carazu",
    dirComisariaTitle: "Policejní stanice PNP Caraz",
    dirComisariaDesc: "Bezpečnost a policejní podpora pro případ nouze.",
    dirFarmaciaTitle: "Lékárny v centru",
    dirFarmaciaDesc: "Zdravotnický materiál a nouzové léky.",
    dirEconolicaTitle: "Botica Económica",
    dirEconolicaDesc: "Cenově dostupná lékárenská péče v Carazu.",
    btnMaps: "Zobrazit na Mapách Google",
    stkFrom: "Od",
    stkCalc: "Kalkulace",
    stkBtn: "Rezervovat"
  },
  zh: {
    whatsappFloatText: "预订或咨询我们！",
    navLocationSub: "秘鲁 · 卡拉斯",
    navCodeText: "住客代码",
    topAccessTitle: "您有欢迎代码吗？",
    topAccessDesc: "在此输入以立即访问完整的当地指南、本地推荐、高速无线网络和特惠价格。",
    topPassPlaceholder: "在此输入您的代码...",
    topUnlockBtn: "查看内容",
    heroTitleStart: "您在卡拉斯舒适、安全且完美的落脚点",
    heroSubtitle: "享受温馨的房间、24小时热水，以及探索白山山脉的最佳地理位置。",
    btnOpenCalc: "🗓️ 在线预订/报价！",
    btnWhatsappDir: "WhatsApp 直接联系",
    lblBadgePay: "接受所有卡与现金",
    calcPanelTitle: "在线计算器与报价",
    btnCloseCalc: "✕ 关闭",
    lblRoomType: "房型",
    optEco: "经济大床房 (S/ 35)",
    optMed: "舒适大床房 (S/ 45)",
    lblCheckinDate: "入住日期",
    lblCheckoutDate: "退房日期",
    lblNights: "晚数",
    lblGuests: "入住人数",
    optG1: "1 位住客",
    optG2: "2 位住客",
    lblTotalEst: "预估总报价",
    btnConfirmRes: "通过 WhatsApp 确认并预订",
    badgeBooking: "极佳 · 地理位置优越",
    publicAttractionsTitle: "必游的自然奇观",
    publicAttractionsDesc: "Kactus 旅馆是您探索白山山脉和孔楚cos壮丽景色的理想出发点。",
    badgeParon: "帕龙湖",
    badgeL69: "69号湖",
    badgeCanon: "鸭子峡谷",
    pubParonTitle: "最大的绿松石湖泊",
    pubParonDesc: "被阿尔特松拉胡等雄伟雪峰环绕的迷人水面。",
    pubL69Title: "高山徒步探险",
    pubL69Desc: "在瓦斯卡兰和查克拉茹雪山下的一场难忘探险，湖水呈浓郁的天蓝色。",
    pubCanonTitle: "隧道与悬崖路线",
    pubCanonDesc: "黑山脉和白山脉交汇处的壮丽峡谷，岩壁上凿有数十条隧道。",
    pubViewGuide: "在指南中查看详情与价格",
    titleRooms: "我们的房间",
    roomsBadge: "最优直订价格保证",
    room1Tag: "经济实惠 & 舒适",
    bannerCodeTitle: "您有预订代码吗？",
    bannerCodeDesc: "在此使用您的住宿代码，获取保护价格、指引及更多信息。",
    bannerCodeBtn: "前往预留区域",
    room1Title: "经济大床房",
    room1Desc: "配有一张双人床的温馨小房间。非常适合情侣或独自旅行者。",
    perNight1: "每晚平均",
    perNight2: "每晚平均",
    btnBookDirectText: "预订房间",
    room2Tag: "最受欢迎",
    room2Title: "舒适大床房",
    room2Desc: "宽敞的房间，配有一张双人床、极佳的自然光线和衣柜。",
    titleCamping: "露营与徒步装备租赁",
    gear1Name: "三季帐篷",
    gear1Desc: "适合高山环境的耐用帐篷。",
    gear3Name: "登山杖",
    gear3Desc: "符合人体工程学的登山杖一对。",
    gearColchoneta: "防潮垫",
    gearColchonetaDesc: "帐篷隔热绝缘垫。",
    gearKit: "便携炊具套装",
    gearKitDesc: "带配件的小型炉头。",
    gear5Name: "野营炉具与锅具",
    gear5Desc: "包含全套炊具。",
    gear6Name: "全新高山气罐",
    gear6Desc: "山地专用密封气罐。",
    titleServices: "设施与服务",
    sBath: "独立卫浴",
    sWater: "24/7 热水",
    sTv: "智能电视",
    sWifi: "免费 Wi-Fi",
    sParking: "免费停车",
    sLuggage: "行李寄存",
    sKitchen: "共享厨房",
    sBreakfast: "早餐服务",
    titleGuideHeading: "卡拉斯旅游指南与专区",
    gPubDesc: "欢迎阅读我们的官方指南。从 Kactus 旅馆出发，探索白山的不容错过的景点。",
    privSectionTitle: "🔐 住客专区（无线网络、规定、设施与旅游）",
    gPrivDesc: "输入前台提供的密码即可解锁所有详细信息：",
    passPlaceholder: "住客密码",
    btnUnlockText: "解锁专区",
    wifiStickySub: "高速网络（固定）",
    wifiNetLabel: "网络名称：",
    wifiNetName: "Segundo Piso",
    wifiPassLabel: "密码：",
    directoryTitle: "📍 卡拉斯关键地点指南",
    dirComisariaTitle: "卡拉斯 PNP 警察局",
    dirComisariaDesc: "提供紧急情况下的安全与警务支持。",
    dirFarmaciaTitle: "市中心药店",
    dirFarmaciaDesc: "医疗物资与紧急药品储备。",
    dirEconolicaTitle: "经济大药房",
    dirEconolicaDesc: "卡拉斯实惠且便利的药房服务。",
    btnMaps: "在谷歌地图中查看",
    stkFrom: "起价",
    stkCalc: "报价",
    stkBtn: "立即预订"
  },
  pt: {
    whatsappFloatText: "Reserve ou consulte-nos!",
    navLocationSub: "Caraz · Peru",
    navCodeText: "Código de Hóspede",
    topAccessTitle: "Já tem o seu código de boas-vindas?",
    topAccessDesc: "Insira-o aqui para acesso imediato ao guia completo da região, recomendações locais, Wi-Fi de alta velocidade e tarifas especiais.",
    topPassPlaceholder: "Digite seu código aqui...",
    topUnlockBtn: "Ver Conteúdo",
    heroTitleStart: "O seu descanso confortável, seguro e completo em",
    heroSubtitle: "Desfrute de quartos aconchegantes, água quente 24/7 e da melhor localização para suas aventuras na Cordilheira Branca.",
    btnOpenCalc: "🗓️ Reserve / Faça um orçamento online!",
    btnWhatsappDir: "Contato Direto WhatsApp",
    lblBadgePay: "Aceitamos Todos os Cartões e Dinheiro",
    calcPanelTitle: "Calculadora e Orçamento Online",
    btnCloseCalc: "✕ Fechar",
    lblRoomType: "Tipo de Quarto",
    optEco: "Matrimonial Econômica (S/ 35)",
    optMed: "Matrimonial Média (S/ 45)",
    lblCheckinDate: "Data de Entrada",
    lblCheckoutDate: "Data de Saída",
    lblNights: "Número de Noites",
    lblGuests: "Quantidade de Hóspedes",
    optG1: "1 Hóspede",
    optG2: "2 Hóspedes",
    lblTotalEst: "Orçamento Total Estimado",
    btnConfirmRes: "Confirmar e Reservar pelo WhatsApp",
    badgeBooking: "Fabuloso · Excelente Localização",
    publicAttractionsTitle: "Maravilhas Naturais que Você Deve Visitar",
    publicAttractionsDesc: "O Hostal Kactus é o seu ponto de partida ideal para conhecer as paisagens mais imponentes da Cordilheira Branca.",
    badgeParon: "Lagoa Parón",
    badgeL69: "Lagoa 69",
    badgeCanon: "Cânion do Pato",
    pubParonTitle: "A Maior Lagoa Turquesa",
    pubParonDesc: "Impressionante espelho d'água cercado por imponentes picos nevados como o Artesonraju.",
    pubL69Title: "Trekking de Alta Montanha",
    pubL69Desc: "Uma aventura inesquecível sob os nevados Huascarán e Chacraraju com águas de cor azul intenso.",
    pubCanonTitle: "Rota de Túneis e Penhascos",
    pubCanonDesc: "Um desfiladeiro impressionante onde convergem a Cordilheira Negra e Branca com dezenas de túneis na rocha.",
    pubViewGuide: "Ver detalhes e preços no guia",
    titleRooms: "Nossos Quartos",
    roomsBadge: "Garantia de Melhor Preço Direto",
    room1Tag: "ECONÔMICA & CONFORTO",
    bannerCodeTitle: "Tem seu código de reserva?",
    bannerCodeDesc: "Use seu código de hospedagem aqui para encontrar tarifas protegidas, direções e mais.",
    bannerCodeBtn: "Ir para Seção Reservada",
    room1Title: "Quarto Matrimonial Econômico",
    room1Desc: "Quarto pequeno e aconchegante com cama de casal. Ideal para casais ou viajantes solos.",
    perNight1: "média por noite",
    perNight2: "média por noite",
    btnBookDirectText: "Reservar Quarto",
    room2Tag: "MAIS POPULAR",
    room2Title: "Quarto Matrimonial Médio",
    room2Desc: "Quarto espaçoso com cama de casal, ótima iluminação natural e armário.",
    titleCamping: "Aluguel de Equipamentos de Camping e Trekking",
    gear1Name: "Barraca 3 Estações",
    gear1Desc: "Barraca resistente para alta montanha.",
    gear3Name: "Bastões de Trekking",
    gear3Desc: "Par de bastões ergonômicos.",
    gearColchoneta: "Isolante Térmico",
    gearColchonetaDesc: "Isolamento térmico para barraca.",
    gearKit: "Kit de Cozinha Portátil",
    gearKitDesc: "Fogareiro compacto com acessórios.",
    gear5Name: "Fogão de acampamento e panelas",
    gear5Desc: "Inclui conjunto completo de utensílios.",
    gear6Name: "Novo Cartucho de Gás",
    gear6Desc: "Cartucho lacrado para montanha.",
    titleServices: "Servicios e Instalações",
    sBath: "Banheiro Privado",
    sWater: "Água Quente 24/7",
    sTv: "Smart TV",
    sWifi: "Wi-Fi Grátis",
    sParking: "Estacionamento Grátis",
    sLuggage: "Guarda-volumes",
    sKitchen: "Cozinha Compartilhada",
    sBreakfast: "Café da Manhã",
    titleGuideHeading: "Guia Turístico de Caraz e Área Reservada",
    gPubDesc: "Bem-vindo ao nosso guia oficial. Explore as atrações imperdíveis da Cordilheira Branca no Hostal Kactus.",
    privSectionTitle: "🔐 Seção Reservada para Hóspedes (Wi-Fi, Regras, Comodidades e Tours)",
    gPrivDesc: "Digite a senha fornecida na recepção para desbloquear todas as informações detalhadas:",
    passPlaceholder: "Senha de hóspede",
    btnUnlockText: "Desbloquear Seção",
    wifiStickySub: "Conexão de Alta Velocidade (Fixa)",
    wifiNetLabel: "Rede:",
    wifiNetName: "Segundo Piso",
    wifiPassLabel: "Senha:",
    directoryTitle: "📍 Diretório de Locais Chave em Caraz",
    dirComisariaTitle: "Delegacia de Polícia PNP Caraz",
    dirComisariaDesc: "Segurança e apoio policial para qualquer emergência.",
    dirFarmaciaTitle: "Farmácias do Centro",
    dirFarmaciaDesc: "Suprimentos médicos e medicamentos de urgência.",
    dirEconolicaTitle: "Botica Económica",
    dirEconolicaDesc: "Atendimento farmacêutico econômico e acessível em Caraz.",
    btnMaps: "Ver no Google Maps",
    stkFrom: "A partir de",
    stkCalc: "Orçar",
    stkBtn: "Reservar Agora"
  },
  de: {
    whatsappFloatText: "Buchen oder anfragen!",
    navLocationSub: "Caraz · Peru",
    navCodeText: "Gästecode",
    topAccessTitle: "Haben Sie Ihren Willkommenscode?",
    topAccessDesc: "Geben Sie ihn hier ein, um sofortigen Zugriff auf den vollständigen lokalen Guide, Empfehlungen, Highspeed-WLAN und Sonderpreise zu erhalten.",
    topPassPlaceholder: "Geben Sie hier Ihren Code ein...",
    topUnlockBtn: "Inhalt anzeigen",
    heroTitleStart: "Ihr bequemer, sicherer und kompletter Aufenthalt in",
    heroSubtitle: "Genießen Sie gemütliche Zimmer, warmes Wasser rund um die Uhr und die beste Lage für Ihre Abenteuer in der Cordillera Blanca.",
    btnOpenCalc: "🗓️ Buchen / Online anfragen!",
    btnWhatsappDir: "Direkter WhatsApp-Kontakt",
    lblBadgePay: "Alle Karten & Bargeld akzeptiert",
    calcPanelTitle: "Online-Rechner & Angebot",
    btnCloseCalc: "✕ Schließen",
    lblRoomType: "Zimmertyp",
    optEco: "Wirtschaftliches Doppelzimmer (S/ 35)",
    optMed: "Mittelgroßes Doppelzimmer (S/ 45)",
    lblCheckinDate: "Anreisedatum",
    lblCheckoutDate: "Abreisedatum",
    lblNights: "Anzahl der Nächte",
    lblGuests: "Anzahl der Gäste",
    optG1: "1 Gast",
    optG2: "2 Gäste",
    lblTotalEst: "Geschätztes Gesamtangebot",
    btnConfirmRes: "Bestätigen und über WhatsApp buchen",
    badgeBooking: "Fabelhaft · Hervorragende Lage",
    publicAttractionsTitle: "Naturwunder, die Sie besuchen müssen",
    publicAttractionsDesc: "Das Hostal Kactus ist Ihr idealer Ausgangspunkt, um die atemberaubenden Landschaften der Cordillera Blanca zu erkunden.",
    badgeParon: "Parón-Lagune",
    badgeL69: "Lagune 69",
    badgeCanon: "Cañón del Pato",
    pubParonTitle: "Die größte türkisfarbene Lagune",
    pubParonDesc: "Atemberaubender Wasserspiegel, umgeben von majestätischen schneebedeckten Gipfeln wie dem Artesonraju.",
    pubL69Title: "Hochgebirgstrekking",
    pubL69Desc: "Ein unvergessliches Abenteuer unter dem Huascarán und Chacraraju mit intensiv hellblauen Gewässern.",
    pubCanonTitle: "Tunnel- und Klippenroute",
    pubCanonDesc: "Eine beeindruckende Schlucht, in der die Schwarze und Weiße Kordillere mit Dutzenden von Tunneln im Fels verschmelzen.",
    pubViewGuide: "Details und Preise im Guide anzeigen",
    titleRooms: "Unsere Zimmer",
    roomsBadge: "Bestpreis-Garantie bei Direktbuchung",
    room1Tag: "WIRTSCHAFTLICH & KOMFORT",
    bannerCodeTitle: "Haben Sie Ihren Buchungscode?",
    bannerCodeDesc: "Verwenden Sie hier Ihren Unterkunftscode, um geschützte Tarife, Wegbeschreibungen und mehr zu finden.",
    bannerCodeBtn: "Zum geschützten Bereich",
    room1Title: "Wirtschaftliches Doppelzimmer",
    room1Desc: "Gemütliches kleineres Zimmer mit Doppelbett. Ideal für Paare oder Alleinreisende.",
    perNight1: "Durchschnitt pro Nacht",
    perNight2: "Durchschnitt pro Nacht",
    btnBookDirectText: "Zimmer buchen",
    room2Tag: "AM BELIEBTESTEN",
    room2Title: "Mittelgroßes Doppelzimmer",
    room2Desc: "Geräumiges Zimmer mit Doppelbett, viel Tageslicht und Kleiderschrank.",
    titleCamping: "Verleih von Camping- und Trekkingausrüstung",
    gear1Name: "3-Jahreszeiten-Zelt",
    gear1Desc: "Robustes Zelt für das Hochgebirge.",
    gear3Name: "Trekkingstöcke",
    gear3Desc: "Paar ergonomische Stöcke.",
    gearColchoneta: "Isoliermatte",
    gearColchonetaDesc: "Wärmeisolierung für das Zelt.",
    gearKit: "Tragbares Kochset",
    gearKitDesc: "Kompakter Brenner mit Zubehör.",
    gear5Name: "Camp-Kocher & Töpfe",
    gear5Desc: "Inklusive kompletter Utensilienset.",
    gear6Name: "Neue Gaskartusche",
    gear6Desc: "Versiegelte Kartusche für die Berge.",
    titleServices: "Dienstleistungen & Ausstattung",
    sBath: "Privates Badezimmer",
    sWater: "Warmwasser 24/7",
    sTv: "Smart-TV",
    sWifi: "Kostenloses WLAN",
    sParking: "Kostenlose Parkplätze",
    sLuggage: "Gepäckaufbewahrung",
    sKitchen: "Gemeinschaftsküche",
    sBreakfast: "Frühstück",
    titleGuideHeading: "Caraz Touristenführer & geschützter Bereich",
    gPubDesc: "Willkommen in unserem offiziellen Guide. Erkunden Sie die Highlights ab dem Hostal Kactus.",
    privSectionTitle: "🔐 Geschützter Gästebereich (WLAN, Regeln, Annehmlichkeiten & Touren)",
    gPrivDesc: "Geben Sie das an der Rezeption mitgeteilte Passwort ein, um alle detaillierten Informationen freizuschalten:",
    passPlaceholder: "Gästekennwort",
    btnUnlockText: "Bereich freischalten",
    wifiStickySub: "Highspeed-Verbindung (Fest)",
    wifiNetLabel: "Netzwerk:",
    wifiNetName: "Segundo Piso",
    wifiPassLabel: "Passwort:",
    directoryTitle: "📍 Verzeichnis wichtiger Orte in Caraz",
    dirComisariaTitle: "PNP-Polizeiwache Caraz",
    dirComisariaDesc: "Sicherheit und polizeiliche Unterstützung bei Notfällen.",
    dirFarmaciaTitle: "Apotheken im Zentrum",
    dirFarmaciaDesc: "Medizinische Versorgung und Notfallmedikamente.",
    dirEconolicaTitle: "Botica Económica",
    dirEconolicaDesc: "Ergänzende und günstige pharmazeutische Versorgung in Caraz.",
    btnMaps: "Auf Google Maps anzeigen",
    stkFrom: "Ab",
    stkCalc: "Berechnen",
    stkBtn: "Jetzt buchen"
  },
  ru: {
    whatsappFloatText: "Забронируйте или спросите нас!",
    navLocationSub: "Карас · Перу",
    navCodeText: "Код гостя",
    topAccessTitle: "У вас есть приветственный код?",
    topAccessDesc: "Введите его здесь для немедленного доступа к полному гиду по региону, рекомендациям, высокоскоростному Wi-Fi и специальным тарифам.",
    topPassPlaceholder: "Введите ваш код здесь...",
    topUnlockBtn: "Смотреть контент",
    heroTitleStart: "Ваш комфортный, безопасный и полноценный отдых в",
    heroSubtitle: "Наслаждайтесь уютными номерами, горячей водой 24/7 и лучшим расположением для ваших приключений в Кордильере-Бланка.",
    btnOpenCalc: "🗓️ Забронировать / Рассчитать онлайн!",
    btnWhatsappDir: "Прямая связь по WhatsApp",
    lblBadgePay: "Принимаем карты и наличные",
    calcPanelTitle: "Онлайн-калькулятор и расчет стоимости",
    btnCloseCalc: "✕ Закрыть",
    lblRoomType: "Тип номера",
    optEco: "Эконом двухместный (S/ 35)",
    optMed: "Стандарт двухместный (S/ 45)",
    lblCheckinDate: "Дата заезда",
    lblCheckoutDate: "Дата выезда",
    lblNights: "Количество ночей",
    lblGuests: "Количество гостей",
    optG1: "1 гость",
    optG2: "2 гостя",
    lblTotalEst: "Ориентировочная общая стоимость",
    btnConfirmRes: "Подтвердить и забронировать через WhatsApp",
    badgeBooking: "Великолепно · Отличное расположение",
    publicAttractionsTitle: "Природные чудеса, которые стоит посетить",
    publicAttractionsDesc: "Хостел Kactus — идеальная отправная точка для знакомства с впечатляющими пейзажами Кордильеры-Бланка.",
    badgeParon: "Лагуна Парон",
    badgeL69: "Лагуна 69",
    badgeCanon: "Каньон дель Пато",
    pubParonTitle: "Самая большая бирюзовая лагуна",
    pubParonDesc: "Потрясающее зеркало воды, окруженное величественными заснеженными пиками, такими как Артесонраху.",
    pubL69Title: "Высокогорный треккинг",
    pubL69Desc: "Незабываемое приключение у подножия Уаскарана с водой насыщенного голубого цвета.",
    pubCanonTitle: "Маршрут тоннелей и скал",
    pubCanonDesc: "Впечатляющее ущелье, где сходятся Черная и Белая Кордильеры, с десятками тоннелей в скалах.",
    pubViewGuide: "Посмотреть детали и цены в гиде",
    titleRooms: "Наши номера",
    roomsBadge: "Гарантия лучшей прямой цены",
    room1Tag: "ЭКОНОМ & КОМФОРТ",
    bannerCodeTitle: "У вас есть код бронирования?",
    bannerCodeDesc: "Используйте ваш код проживания здесь, чтобы найти защищенные тарифы и инструкции.",
    bannerCodeBtn: "Перейти в закрытый раздел",
    room1Title: "Эконом двухместный номер",
    room1Desc: "Уютный небольшой номер с двуспальной кроватью. Идеально для пар или путешественников-одиночек.",
    perNight1: "в среднем за ночь",
    perNight2: "в среднем за ночь",
    btnBookDirectText: "Забронировать номер",
    room2Tag: "ПОПУЛЯРНЫЙ",
    room2Title: "Стандартный двухместный номер",
    room2Desc: "Просторный номер с двуспальной кроватью, отличным естественным освещением и шкафом.",
    titleCamping: "Прокат кемпингового и треккингового снаряжения",
    gear1Name: "3-сезонная палатка",
    gear1Desc: "Прочная палатка для высокогорья.",
    gear3Name: "Треккинговые палки",
    gear3Desc: "Пара эргономичных палок.",
    gearColchoneta: "Теплоизоляционный коврик",
    gearColchonetaDesc: "Теплоизоляция для палатки.",
    gearKit: "Портативный кухонный набор",
    gearKitDesc: "Компактная горелка с аксессуарами.",
    gear5Name: "Кемпинговая плита и кастрюли",
    gear5Desc: "Включает полный набор посуды.",
    gear6Name: "Новый газовый баллон",
    gear6Desc: "Герметичный баллон для гор.",
    titleServices: "Услуги и удобства",
    sBath: "Частная ванная комната",
    sWater: "Горячая вода 24/7",
    sTv: "Smart TV",
    sWifi: "Бесплатный Wi-Fi",
    sParking: "Бесплатная парковка",
    sLuggage: "Хранение багажа",
    sKitchen: "Общая кухня",
    sBreakfast: "Завтраки",
    titleGuideHeading: "Туристический гид по Карасу и закрытая зона",
    gPubDesc: "Добро пожаловать в наш официальный гид. Исследуйте главные достопримечательности из хостела Kactus.",
    privSectionTitle: "🔐 Закрытый раздел для гостей (Wi-Fi, правила, удобства и туры)",
    gPrivDesc: "Введите пароль, полученный на ресепшене, чтобы разблокировать всю подробную информацию:",
    passPlaceholder: "Пароль гостя",
    btnUnlockText: "Разблокировать раздел",
    wifiStickySub: "Высокоскоростное соединение (Фиксированное)",
    wifiNetLabel: "Сеть:",
    wifiNetName: "Segundo Piso",
    wifiPassLabel: "Пароль:",
    directoryTitle: "📍 Каталог ключевых мест в Карасе",
    dirComisariaTitle: "Полицейский участок PNP Караса",
    dirComisariaDesc: "Безопасность и полицейская поддержка в любых чрезвычайных ситуациях.",
    dirFarmaciaTitle: "Аптеки в центре",
    dirFarmaciaDesc: "Медицинские товары и экстренные лекарства.",
    dirEconolicaTitle: "Botica Económica",
    dirEconolicaDesc: "Доступная и недорогая аптечная помощь в Карасе.",
    btnMaps: "Посмотреть на Google Картах",
    stkFrom: "От",
    stkCalc: "Рассчитать",
    stkBtn: "Забронировать"
  }
};

/* Función Global de Cambio de Idioma que traduce absolutamente todo */
function changeLanguage(lang) {
  currentLang = lang;
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-xs');
    btn.classList.add('text-slate-600', 'hover:text-slate-900');
  });
  
  const activeBtn = document.getElementById(`btn-${lang}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-600', 'hover:text-slate-900');
    activeBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-xs');
  }

  const t = translations[lang] || translations['es'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  calculateTotal();
}
