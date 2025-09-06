// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2.2 + 1.2,
                opacity: Math.random() * 0.3 + 0.1,
                originalSize: Math.random() * 2.2 + 1.2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Mouse interaction - gentler movement
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.x -= dx * force * 0.005;
                particle.y -= dy * force * 0.005;
                particle.size = particle.originalSize + force * 1;
            } else {
                particle.size = particle.originalSize;
            }

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            this.ctx.fill();
            
            // Add subtle glow effect
            this.ctx.shadowColor = `rgba(102, 126, 234, ${particle.opacity * 0.3})`;
            this.ctx.shadowBlur = 3;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity * 0.2})`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.animateOnScroll();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.animateOnScroll());
    }

    animateOnScroll() {
        const elements = document.querySelectorAll('.feature-item, .spec-card, .review-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });

        // Animate charts
        this.animateCharts();
    }

    animateCharts() {
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach((bar, index) => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && !bar.classList.contains('animate')) {
                const value = bar.dataset.value;
                // Convert percentage to actual height for better visual representation
                let heightPercentage;
                if (value.includes('h')) {
                    // For battery life (30h), scale to 80% of max height
                    heightPercentage = Math.min((parseInt(value) / 40) * 80, 80);
                } else {
                    // For percentages, use the value directly
                    heightPercentage = Math.min(parseInt(value), 100);
                }
                
                bar.style.setProperty('--bar-height', `${heightPercentage}%`);
                
                // Stagger the animation for each chart
                setTimeout(() => {
                    bar.classList.add('animate');
                }, index * 200);
            }
        });
    }
}

// 3D Earbuds with Three.js
class Earbuds3D {
    constructor() {
        this.scenes = [];
        this.renderers = [];
        this.earbudsModels = [];
        this.animations = [];
        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.init();
    }

    init() {
        this.setupScenes();
        this.loadModel();
        this.bindEvents();
        this.animate();
    }

    setupScenes() {
        // Hero scene
        const heroCanvas = document.getElementById('earbudsCanvas');
        if (heroCanvas) {
            this.setupScene(heroCanvas, 'hero');
        }

        // Product scene
        const productCanvas = document.getElementById('productCanvas');
        if (productCanvas) {
            this.setupScene(productCanvas, 'product');
        }
    }

    setupScene(canvas, type) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true, 
            alpha: true 
        });

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x667eea, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x764ba2, 0.8, 100);
        pointLight.position.set(-5, 5, 5);
        scene.add(pointLight);

        // Camera position
        camera.position.z = 4;
        camera.position.y = 0.5;
        if (type === 'product') {
            camera.position.z = 3;
            camera.position.y = 0.3;
        }

        this.scenes.push({ scene, camera, renderer, canvas, type });
    }

    loadModel() {
        const loader = new THREE.OBJLoader();
        const modelPath = './uploads_files_3945980_Earbuds.obj';

        console.log('Starting to load 3D model from:', modelPath);

        // Set a timeout to fallback if loading takes too long
        const loadingTimeout = setTimeout(() => {
            console.log('Model loading timeout, using fallback...');
            this.createFallbackModel();
        }, 5000);

        loader.load(
            modelPath,
            (object) => {
                clearTimeout(loadingTimeout);
                console.log('Model loaded successfully:', object);
                this.onModelLoaded(object);
            },
            (progress) => {
                if (progress.lengthComputable) {
                    console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                }
            },
            (error) => {
                clearTimeout(loadingTimeout);
                console.error('Error loading model:', error);
                console.log('Creating fallback model...');
                this.createFallbackModel();
            }
        );
    }

    onModelLoaded(object) {
        // Hide loading spinners
        document.querySelectorAll('.loading-spinner').forEach(spinner => {
            spinner.style.display = 'none';
        });

        // Compute bounding box to scale properly
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDimension; // Scale to fit in 2 units

        // Create two earbuds from the single model
        this.scenes.forEach(({ scene, type }) => {
            // Left earbud
            const leftEarbud = object.clone();
            leftEarbud.position.set(-1.5, 0, 0);
            leftEarbud.rotation.y = Math.PI / 6;
            leftEarbud.scale.setScalar(scale);
            this.setupEarbudMaterial(leftEarbud, type);
            scene.add(leftEarbud);

            // Right earbud
            const rightEarbud = object.clone();
            rightEarbud.position.set(1.5, 0, 0);
            rightEarbud.rotation.y = -Math.PI / 6;
            rightEarbud.scale.setScalar(scale);
            this.setupEarbudMaterial(rightEarbud, type);
            scene.add(rightEarbud);

            this.earbudsModels.push({ left: leftEarbud, right: rightEarbud, type });
        });

        console.log('3D Model loaded successfully with scale:', scale);
    }

    setupEarbudMaterial(earbud, type) {
        earbud.traverse((child) => {
            if (child.isMesh) {
                // Create material based on type
                let material;
                if (type === 'product') {
                    material = new THREE.MeshPhongMaterial({
                        color: 0x667eea,
                        shininess: 100,
                        transparent: false,
                        opacity: 1.0,
                        side: THREE.DoubleSide
                    });
                } else {
                    material = new THREE.MeshPhongMaterial({
                        color: 0x667eea,
                        shininess: 150,
                        transparent: false,
                        opacity: 1.0,
                        side: THREE.DoubleSide
                    });
                }
                
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Ensure geometry is properly computed
                if (child.geometry) {
                    child.geometry.computeVertexNormals();
                    child.geometry.computeBoundingBox();
                    child.geometry.computeBoundingSphere();
                }
            }
        });
    }

    createFallbackModel() {
        // Create simple fallback geometry if model fails to load
        this.scenes.forEach(({ scene, type }) => {
            // Create earbud-like geometry
            const earbudGroup = new THREE.Group();
            
            // Main body (rounded box)
            const bodyGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.4);
            const bodyMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x667eea,
                shininess: 100,
                side: THREE.DoubleSide
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.1;
            earbudGroup.add(body);
            
            // Earbud tip
            const tipGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
            const tipMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x333333,
                shininess: 50
            });
            const tip = new THREE.Mesh(tipGeometry, tipMaterial);
            tip.position.y = -0.2;
            tip.rotation.x = Math.PI;
            earbudGroup.add(tip);
            
            // Left earbud
            const leftEarbud = earbudGroup.clone();
            leftEarbud.position.set(-1.5, 0, 0);
            leftEarbud.rotation.y = Math.PI / 6;
            scene.add(leftEarbud);

            // Right earbud
            const rightEarbud = earbudGroup.clone();
            rightEarbud.position.set(1.5, 0, 0);
            rightEarbud.rotation.y = -Math.PI / 6;
            scene.add(rightEarbud);

            this.earbudsModels.push({ left: leftEarbud, right: rightEarbud, type });
        });

        // Hide loading spinners
        document.querySelectorAll('.loading-spinner').forEach(spinner => {
            spinner.style.display = 'none';
        });
        
        console.log('Fallback 3D model created');
    }

    bindEvents() {
        // Mouse interaction
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Scroll interaction
        window.addEventListener('scroll', () => {
            this.scrollY = window.pageYOffset;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.scenes.forEach(({ camera, renderer, canvas }) => {
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.scenes.forEach(({ scene, camera, renderer, type }, index) => {
            // Check if canvas is visible for performance
            const rect = renderer.domElement.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!isVisible) return;

            // Update earbuds based on scroll and mouse
            if (this.earbudsModels[index]) {
                const { left, right } = this.earbudsModels[index];
                
                // Scroll-based animations
                const scrollProgress = Math.min(this.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
                
                if (type === 'hero') {
                    // Hero section animations
                    const time = Date.now() * 0.001;
                    
                    // Individual slow spinning
                    left.rotation.y += 0.002; // Slow Y-axis rotation
                    right.rotation.y -= 0.002; // Opposite direction
                    
                    // Floating animation
                    left.position.y = Math.sin(time) * 0.2;
                    right.position.y = Math.sin(time + Math.PI) * 0.2;
                    
                    // Mouse interaction (throttled)
                    left.rotation.x = this.mouse.y * 0.3;
                    right.rotation.x = this.mouse.y * 0.3;
                    left.rotation.z = this.mouse.x * 0.2;
                    right.rotation.z = this.mouse.x * 0.2;
                } else {
                    // Product section animations
                    const time = Date.now() * 0.001;
                    
                    // Individual slow spinning
                    left.rotation.y += 0.0015; // Slower Y-axis rotation
                    right.rotation.y -= 0.0015; // Opposite direction
                    
                    // Gentle floating
                    left.position.y = Math.sin(time * 0.5) * 0.1;
                    right.position.y = Math.sin(time * 0.5 + Math.PI) * 0.1;
                }
            }

            // Camera movement
            if (type === 'hero') {
                camera.position.x = this.mouse.x * 0.5;
                camera.position.y = this.mouse.y * 0.5;
                camera.lookAt(scene.position);
            }

            renderer.render(scene, camera);
        });
    }

    // Method to change earbud colors (for product section)
    changeEarbudColor(color) {
        this.earbudsModels.forEach(({ left, right, type }) => {
            if (type === 'product') {
                const colorMap = {
                    'midnight': 0x1a1a1a,
                    'aurora': 0x667eea,
                    'silver': 0xc0c0c0
                };
                
                const newColor = colorMap[color] || 0x667eea;
                
                left.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.color.setHex(newColor);
                    }
                });
                
                right.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.color.setHex(newColor);
                    }
                });
            }
        });
    }
}

// Spec Cards Interaction
class SpecCards {
    constructor() {
        this.specCards = document.querySelectorAll('.spec-card');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.specCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
                card.querySelector('.spec-icon').style.transform = 'scale(1.2) rotate(15deg)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.querySelector('.spec-icon').style.transform = 'scale(1) rotate(0deg)';
            });

            card.addEventListener('click', () => {
                this.showSpecDetails(card);
            });
        });
    }

    showSpecDetails(card) {
        const spec = card.dataset.spec;
        const tooltip = card.querySelector('.spec-tooltip');
        
        // Add click animation
        card.style.transform = 'translateY(-10px) scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }, 150);

        // Show tooltip with animation
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
    }
}

// Color Options
class ColorOptions {
    constructor() {
        this.colorOptions = document.querySelectorAll('.color-option');
        this.earbuds3D = null;
        this.init();
    }

    init() {
        this.bindEvents();
        // Get reference to Earbuds3D instance
        setTimeout(() => {
            this.earbuds3D = window.earbuds3DInstance;
        }, 1000);
    }

    bindEvents() {
        this.colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                this.colorOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Change earbuds color
                const color = option.dataset.color;
                this.changeEarbudsColor(color);
            });
        });
    }

    changeEarbudsColor(color) {
        if (this.earbuds3D && this.earbuds3D.changeEarbudColor) {
            this.earbuds3D.changeEarbudColor(color);
        }
    }
}

// Buy Button Animation
class BuyButton {
    constructor() {
        this.buyButton = document.getElementById('buyButton');
        this.init();
    }

    init() {
        this.bindEvents();
        this.startPulseAnimation();
    }

    bindEvents() {
        this.buyButton.addEventListener('click', () => {
            this.animateClick();
        });

        // Pulse animation when near purchase section
        window.addEventListener('scroll', () => {
            const purchaseSection = document.getElementById('purchase');
            const rect = purchaseSection.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                this.buyButton.classList.add('pulse');
            } else {
                this.buyButton.classList.remove('pulse');
            }
        });
    }

    animateClick() {
        this.buyButton.style.transform = 'scale(0.95)';
        this.buyButton.innerHTML = '<i class="fas fa-check"></i><span>Added to Cart!</span>';
        
        setTimeout(() => {
            this.buyButton.style.transform = 'scale(1)';
            this.buyButton.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Add to Cart</span>';
        }, 2000);
    }

    startPulseAnimation() {
        // Staggered animation for price elements
        const priceElements = document.querySelectorAll('.original-price, .current-price, .discount');
        priceElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}

// Sound Toggle
class SoundToggle {
    constructor() {
        this.soundToggle = document.getElementById('soundToggle');
        this.audioContext = null;
        this.oscillator = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.soundToggle.addEventListener('click', () => {
            this.toggleSound();
        });
    }

    async toggleSound() {
        if (!this.isPlaying) {
            await this.startAmbientSound();
        } else {
            this.stopAmbientSound();
        }
    }

    async startAmbientSound() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create ambient sound with multiple oscillators
            this.oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            this.oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            this.oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
            this.oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 1);
            
            this.oscillator.start();
            this.isPlaying = true;
            this.soundToggle.classList.add('active');
            this.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    stopAmbientSound() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
        this.isPlaying = false;
        this.soundToggle.classList.remove('active');
        this.soundToggle.innerHTML = '<i class="fas fa-music"></i>';
    }
}

// Smooth Scrolling
class SmoothScrolling {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Background Color Shift - Seamless Gradient
class BackgroundShift {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setInitialBackground();
    }

    setInitialBackground() {
        document.body.style.background = `linear-gradient(135deg, 
            #0a0a0a 0%, 
            #1a1a2e 25%, 
            #16213e 50%, 
            #0f3460 75%, 
            #1a1a2e 100%)`;
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundSize = '100% 100%';
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            this.updateBackground();
        });
    }

    updateBackground() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollProgress = Math.min(scrolled / documentHeight, 1);
        
        // Create seamless gradient transition
        const hue1 = 220 + scrollProgress * 40;
        const hue2 = 240 + scrollProgress * 20;
        const hue3 = 260 + scrollProgress * 10;
        
        document.body.style.background = `linear-gradient(135deg, 
            hsl(${hue1}, 30%, 3%) 0%, 
            hsl(${hue2}, 40%, 8%) 25%, 
            hsl(${hue3}, 50%, 12%) 50%, 
            hsl(${hue2 + 20}, 45%, 10%) 75%, 
            hsl(${hue1 + 30}, 35%, 6%) 100%)`;
    }
}

// Cursor Glow Effect - Disabled
class CursorGlow {
    constructor() {
        // Custom cursor disabled - using default cursor only
    }

    init() {
        // No custom cursor implementation
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ParticleSystem();
    new ScrollAnimations();
    window.earbuds3DInstance = new Earbuds3D();
    new SpecCards();
    new ColorOptions();
    new BuyButton();
    new SoundToggle();
    new SmoothScrolling();
    new BackgroundShift();
    new CursorGlow();

    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = !isActive ? 'hidden' : '';
        });

        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // Add stagger animation to feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Add stagger animation to spec cards
    const specCards = document.querySelectorAll('.spec-card');
    specCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add stagger animation to review cards
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('#features').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        // Add keyboard support
        scrollIndicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.querySelector('#features').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Performance optimization
let ticking = false;
let lastScrollY = 0;
let lastResizeTime = 0;

function updateAnimations() {
    // Batch DOM updates for better performance
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

// Throttle scroll events
window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;
    if (Math.abs(currentScrollY - lastScrollY) > 5) {
        requestTick();
        lastScrollY = currentScrollY;
    }
});

// Throttle resize events
window.addEventListener('resize', () => {
    const now = Date.now();
    if (now - lastResizeTime > 100) {
        requestTick();
        lastResizeTime = now;
    }
});

// Intersection Observer for better performance
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-item, .spec-card, .review-card, .chart-container');
    animateElements.forEach(el => observer.observe(el));
});