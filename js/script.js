const app = {
    config: {
        recipientName: "Silky ✨❄️",
        yourName: "Quinito",
        youtubeVideoId: '6j9fpwMNkzQ',
        coordinates: {
            origin: { lat: 40.4168, lng: -3.7038 },
            destination: { lat: 37.4063, lng: -1.5829 }
        },
        starCount: 100
    },

    state: {
        experienceHasStarted: false,
        map: null,
        typeitInstance: null,
        player: null,
        intervals: {
            confetti: null,
            rain: null,
            favicon: null
        }
    },

    dom: {
        mainContainer: document.querySelector('.main-container'),
        splashScreen: document.getElementById('splash-screen'),
        startButton: document.getElementById('start-button'),
        orientationOverlay: document.getElementById('orientation-overlay'),
        textElement: document.getElementById('texto'),
        rainContainer: document.getElementById('rain'),
        starsContainer: document.getElementById('stars'),
        favicon: document.querySelector('link[rel="icon"]')
    },

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.dom.startButton.addEventListener("click", () => this.handleStartClick());
            window.addEventListener("resize", () => this.checkOrientation());
        });
    },

    handleStartClick() {
        if (this.state.player) {
            this.state.player.playVideo();
            setTimeout(() => this.state.player.pauseVideo(), 500);
        }
        this.dom.splashScreen.classList.add("hidden");
        this.checkOrientation();
    },

    startExperience() {
        if (this.state.experienceHasStarted) return;
        this.state.experienceHasStarted = true;

        this.dom.mainContainer.classList.add('visible');
        gsap.to(["#carta", "#map-container"], {
            opacity: 1,
            x: 0,
            duration: 1.5,
            delay: 0.5,
            ease: "power2.out"
        });

        this.writeLetter();
        this.initVisualEffects();
        this.initMap();

        if (this.state.player && typeof this.state.player.playVideo === 'function') {
            setTimeout(() => {
                this.state.player.unMute();
                this.state.player.setVolume(50);
                this.state.player.playVideo();
            }, 3000);
        }
    },

    resetExperience() {
        if (!this.state.experienceHasStarted) return;
        this.state.experienceHasStarted = false;
        
        this.dom.mainContainer.classList.remove('visible');
        if (this.state.typeitInstance) this.state.typeitInstance.destroy();
        this.dom.textElement.innerHTML = '';
        
        gsap.killTweensOf(["#carta", "#map-container"]);
        gsap.set(["#carta", "#map-container"], { opacity: 0, transform: 'translateX(-30px)' });

        if (this.state.player && typeof this.state.player.stopVideo === 'function') this.state.player.stopVideo();
        if (this.state.map) this.state.map.remove();
        
        Object.values(this.state.intervals).forEach(clearInterval);
        this.dom.rainContainer.innerHTML = '';
        this.dom.starsContainer.innerHTML = '';
    },

    checkOrientation() {
        const isMobilePortrait = window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches;
        if (isMobilePortrait) {
            this.dom.orientationOverlay.classList.add('visible');
            if (this.state.experienceHasStarted) this.resetExperience();
        } else {
            this.dom.orientationOverlay.classList.remove('visible');
            this.startExperience();
        }
    },

    writeLetter() {
        const message = `Mi querida ${this.config.recipientName}...\n
Hay palabras que creía entender hasta que te conocí. "Hogar", por ejemplo, dejó de ser un lugar físico para convertirse en el sonido de tu voz. "Calma" ya no era la ausencia de ruido, sino la certeza de tu existencia en medio de una de esas tormentas de truenos que tanto te gustan.\n
Hoy no celebro solo tu cumpleaños; celebro la revolución silenciosa que has sido en mi vida. Celebro esa mente valiente que se sumerge en la filosofía y la psicología, no como un escape, sino como el acto de autoconocimiento más puro que tengo el privilegio de presenciar. Admiro cada paso de tu proceso, con la infinita paciencia y ternura que mereces.\n
A veces, mi mente se escapa y construye nuestro refugio perfecto. Es una tarde de lluvia y truenos, y el mundo exterior no importa. Solo somos tú y yo, la luz tenue de una película que hemos puesto de excusa y el sonido de la tormenta. Te imagino en mis brazos, sintiendo el ritmo tranquilo de tu respiración, con tu cabeza apoyada sobre mi pecho, justo en ese lugar que parece hecho a tu medida. Y en ese silencio, entiendo que la felicidad no es un gran gesto, sino esta paz abrumadora de saber que, teniéndote así de cerca, ya lo tengo absolutamente todo.\n
Mencionaste el potencial que ves en mí, pero lo que no sabes es que esa fe tuya es la que me ancla y me impulsa a ser mejor. Me haces querer descifrar cada constelación de tus lunares y memorizar cada una de tus reseñas, porque cada fragmento de tu universo es, para mí, una obra de arte.\n
Feliz cumpleaños, vida mía. Gracias por enseñarme lo que de verdad significa sentir.\n
Con todo mi amor,\n${this.config.yourName}`;
        
        this.state.typeitInstance = new TypeIt(this.dom.textElement, {
            speed: 55,
            startDelay: 1500,
            waitUntilVisible: true,
            lifeLike: true,
        }).type(message).exec(() => this.launchConfetti()).go();
    },

    initVisualEffects() {
        this.createStars(this.config.starCount);
        this.startRain();
        this.startFaviconAnimation();
    },

    initMap() {
        const { origin, destination } = this.config.coordinates;
        this.state.map = L.map('map').setView([(origin.lat + destination.lat) / 2, (origin.lng + destination.lng) / 2], 6);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap, © CARTO'
        }).addTo(this.state.map);

        const heartSVG = `<svg class="heart-animation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#e85c80" stroke="#fff" stroke-width="1.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
        
        const heartIcon = L.divIcon({
            html: heartSVG,
            className: 'heart-marker-container',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });
        
        L.marker([origin.lat, origin.lng], { icon: heartIcon }).addTo(this.state.map).bindPopup("Donde cada trueno me recuerda a tu risa...");
        L.marker([destination.lat, destination.lng], { icon: heartIcon }).addTo(this.state.map).bindPopup("Y donde cada gota de lluvia lleva tu nombre ❤️");
        
        const antPolyline = L.polyline.antPath([[origin.lat, origin.lng], [destination.lat, destination.lng]], {
            delay: 500,
            dashArray: [15, 30],
            weight: 6,
            color: "var(--line-color)",
            pulseColor: getComputedStyle(document.documentElement).getPropertyValue('--yellow').trim()
        }).addTo(this.state.map);

        this.state.map.fitBounds(antPolyline.getBounds(), { padding: [50, 50] });
    },

    launchConfetti() {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
        const colors = ["#FFC0CB", "#FF69B4", "#ffee93"];

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        this.state.intervals.confetti = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(this.state.intervals.confetti);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, colors, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, colors, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        }, 250);
    },

    startRain() {
        this.state.intervals.rain = setInterval(() => {
            const drop = document.createElement("div");
            drop.className = "raindrop";
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${Math.random() * 0.8 + 0.7}s`;
            drop.style.animationDelay = `${Math.random() * 5}s`;
            this.dom.rainContainer.appendChild(drop);
            setTimeout(() => drop.remove(), 5500);
        }, 50);
    },

    createStars(count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            this.dom.starsContainer.appendChild(star);
        }
    },

    startFaviconAnimation() {
        const favicons = ["❤️", "✨"];
        let index = 0;
        const getHref = (emoji) => `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`;
        
        this.state.intervals.favicon = setInterval(() => {
            index = (index + 1) % favicons.length;
            this.dom.favicon.href = getHref(favicons[index]);
        }, 1500);
    }
};

function onYouTubeIframeAPIReady() {
    app.state.player = new YT.Player("youtube-player", {
        height: "315",
        width: "560",
        videoId: app.config.youtubeVideoId,
        playerVars: { playsinline: 1 },
        events: { onReady: onPlayerReady }
    });
}

function onPlayerReady(event) {
    event.target.mute();
    app.dom.startButton.disabled = false;
    app.dom.startButton.textContent = "Comenzar la sorpresa ✨";
}

app.init();