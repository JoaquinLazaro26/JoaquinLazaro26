/* --- YOUTUBE API --- */
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: '9qS68rkG334', 
        playerVars: { 'playsinline': 1, 'controls': 0, 'loop': 1, 'playlist': '9qS68rkG334' }
    });
}

/* --- DATOS DE LA HISTORIA --- */
const chapters = [
    {
        img: 'img/azul.png', 
        weather: 'snow',
        rotation: -45, 
        title: "The Frozen Path",
        text: "The blue dial takes us to the icy lands of the North. It looks cold, Amanda, but look closely at the river flowing through the crystals. Just like that water, my support for you flows underneath any distance or winter. The world may be frozen, but our connection remains fluid and alive."
    },
    {
        img: 'img/rojo.png', 
        weather: 'embers',
        rotation: -135,
        title: "The Valley of Life",
        text: "This vibrant village reminds me of your heart. It is full of life, color, and energy. I admire so much how you choose to live—with compassion for every living being, protecting the innocent, and nurturing the world around you. Your kindness is a warm hearth that welcomes everyone."
    },
    {
        img: 'img/verde.png', 
        weather: 'petals',
        rotation: -225,
        title: "Your Sanctuary",
        text: "Here, in the green, I found a secret garden just for you. Do you see the white Lilies blooming beneath the ancient tree? They reflect your soul: elegant, resilient, and beautiful. This is a place where the music of nature plays the melody of peace you deserve."
    },
    {
        img: 'img/negro.png', 
        weather: 'stars',
        rotation: -315,
        title: "Our Shared Sky",
        text: "The final door leads to the Northern Lights. The black dial isn't darkness; it's the canvas for the most beautiful magic. Under this same sky, whether in Spain or Norway, I am always with you. You are the light that guides me. 💫"
    }
];

/* --- VARIABLES DE CONTROL --- */
const lock = document.getElementById('magic-lock');
const bgLayer = document.getElementById('bg-layer');
const card = document.getElementById('card');
const hud = document.getElementById('hud');
let currentIndex = -1; // -1: Intro, 0: Hearth, 1+: Capítulos

/* --- 1. ABRIR PUERTA -> INTERIOR (HEARTH) --- */
lock.addEventListener('click', () => {
    if(player && player.playVideo) { player.playVideo(); player.setVolume(60); }
    
    // Animación del sello
    gsap.to('.magic-seal', { rotation: 360, duration: 1.5, ease: "back.in(1.7)" });
    gsap.to(lock, { scale: 0, opacity: 0, duration: 0.5, delay: 1 });
    
    // Abrir puertas
    const tl = gsap.timeline({ delay: 1.2 });
    tl.to("#door-left", { x: "-100%", duration: 3, ease: "power2.inOut" }, "open");
    tl.to("#door-right", { x: "100%", duration: 3, ease: "power2.inOut" }, "open");
    tl.to("#door-overlay", { display: "none" });

    // Cargar Escena Intermedia
    setTimeout(() => { loadInteriorScene(); }, 2000);
});

/* --- 2. FUNCIÓN ESCENA INTERIOR --- */
function loadInteriorScene() {
    // Aseguramos que se muestre el fondo (hearth-bg ya está en el HTML)
    gsap.to(bgLayer, { opacity: 1, duration: 1 });

    // Animación de fuego (Calcifer)
    setWeather('embers'); 
    
    // Texto de Bienvenida
    document.getElementById('card-title').innerText = "Welcome Home";
    document.getElementById('card-text').innerText = "The castle is warm and safe. But there are worlds waiting for us outside these walls... Are you ready to turn the dial?";
    
    // Mostrar Tarjeta
    gsap.to(card, { opacity: 1, duration: 1, delay: 0.5 });
    
    // Mostrar Ruleta
    gsap.to(hud, { opacity: 1, y: 0, duration: 1.5, delay: 1, ease: "power2.out" });
}

/* --- 3. BOTÓN SIGUIENTE / GIRAR DIAL --- */
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentIndex === -1) {
        // De Hearth a Cap 1
        loadChapter(0);
    } else if (currentIndex < chapters.length - 1) {
        // Siguiente Cap
        loadChapter(currentIndex + 1);
    } else {
        // Final
        showFinalScene();
    }
});

function loadChapter(index) {
    currentIndex = index;
    const data = chapters[index];

    // Ocultar tarjeta vieja
    gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.5 });

    // Girar Ruleta
    const targetRot = data.rotation - (360 * index);
    gsap.to('#dial-rotating-part', { 
        rotation: targetRot, 
        duration: 2.5, 
        ease: "elastic.out(1, 0.7)" 
    });

    // Flash y Cambio de Contenido
    setTimeout(() => {
        const flash = document.getElementById('magic-flash');
        gsap.to(flash, { opacity: 0.8, duration: 0.2, onComplete: () => {
            // Quitamos la clase del hearth para poner la imagen del capítulo
            bgLayer.classList.remove('hearth-bg');
            bgLayer.style.backgroundImage = `url('${data.img}')`;
            
            setWeather(data.weather);
            
            document.getElementById('card-title').innerText = data.title;
            document.getElementById('card-text').innerText = data.text;
            
            const btn = document.getElementById('next-btn');
            if(index === chapters.length - 1) {
                btn.innerText = "Open The Final Letter";
            } else {
                btn.innerText = "Turn Dial";
            }

            gsap.to(flash, { opacity: 0, duration: 1 });
            gsap.to(card, { opacity: 1, scale: 1, duration: 1, delay: 0.5 });
        }});
    }, 800);
}

/* --- 4. ESCENA FINAL --- */
function showFinalScene() {
    gsap.to('#main-stage', { opacity: 0, duration: 1, onComplete: () => {
        document.getElementById('main-stage').style.display = 'none';
        const final = document.getElementById('final-scene');
        final.style.display = 'flex';
        gsap.to(final, { opacity: 1, duration: 2 });
        gsap.from("#final-letter", { y: 50, opacity: 0, duration: 1.5, delay: 0.5, ease: "power2.out" });
        createHeartExplosion();
    }});
}

function createHeartExplosion() {
    const container = document.getElementById('final-scene');
    for(let i=0; i<40; i++) {
        const h = document.createElement('div');
        h.innerText = Math.random() > 0.5 ? "❤️" : "✨";
        h.style.position = 'absolute'; h.style.left='50%'; h.style.top='50%';
        h.style.fontSize = Math.random() * 20 + 10 + 'px';
        container.appendChild(h);
        gsap.to(h, {
            x: (Math.random()-0.5)*700, y: (Math.random()-0.5)*700,
            opacity: 0, rotation: Math.random()*360,
            duration: 2 + Math.random(), ease: "power2.out"
        });
    }
}

/* --- 5. MOTOR DE CLIMA (CANVAS) --- */
const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let weatherType = 'none';

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

function setWeather(type) {
    weatherType = type;
    particles = [];
    const count = type === 'petals' ? 30 : 80;
    for(let i=0; i<count; i++) particles.push(createParticle(type));
}

function createParticle(type) {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (type==='petals'? 7 : 2),
        speedY: type==='embers'? -Math.random()-0.5 : Math.random()*2+0.5,
        speedX: (Math.random()-0.5)*1.5,
        opacity: Math.random()*0.6+0.2,
        sway: Math.random()*10
    };
}

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        if(weatherType === 'snow') {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        } else if(weatherType === 'embers') {
            ctx.fillStyle = `rgba(255,100,50,${p.opacity})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        } else if(weatherType === 'petals') {
            ctx.fillStyle = Math.random()>0.5 ? `rgba(255,255,255,${p.opacity})` : `rgba(255,200,210,${p.opacity})`;
            p.x += Math.sin(Date.now()/1000 + p.sway)*0.5;
            ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size, p.size*1.6, 0.5, 0, Math.PI*2); ctx.fill();
        } else if(weatherType === 'stars') {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size*0.8, 0, Math.PI*2); ctx.fill();
        }
        
        p.y += p.speedY; p.x += p.speedX;
        if(weatherType === 'embers' && p.y < -10) { p.y = canvas.height; p.x=Math.random()*canvas.width; }
        else if(weatherType !== 'embers' && p.y > canvas.height) { p.y = -10; p.x=Math.random()*canvas.width; }
    });
    requestAnimationFrame(loop);
}
loop();