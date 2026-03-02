// ===== Global Background Animation =====
class GlobalBackground {
    constructor() {
        this.container = null;
        this.orbs = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseActive = false;
        this.isKeyboardActive = false;
        this.keyboardTimeout = null;
        this.orbCount = 5;
        
        this.init();
    }
    
    init() {
        this.createContainer();
        this.createOrbs();
        this.bindEvents();
        this.animate();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'global-background';
        document.body.insertBefore(this.container, document.body.firstChild);
    }
    
    createOrbs() {
        const orbConfigs = [
            { class: 'bg-orb-1', x: -200, y: -200 },
            { class: 'bg-orb-2', x: -150, y: -150 },
            { class: 'bg-orb-3', x: 50, y: 50 },
            { class: 'bg-orb-4', x: 10, y: 20 },
            { class: 'bg-orb-5', x: -10, y: -10 }
        ];
        
        orbConfigs.forEach((config, index) => {
            const orb = document.createElement('div');
            orb.className = `bg-orb ${config.class}`;
            
            // Set initial positions relative to viewport
            if (index === 2) {
                // orb-3 is centered
                orb.style.left = '50%';
                orb.style.top = '50%';
                orb.style.transform = 'translate(-50%, -50%)';
            } else {
                orb.style.left = `${config.x}%`;
                orb.style.top = `${config.y}%`;
            }
            
            this.container.appendChild(orb);
            this.orbs.push({
                element: orb,
                baseX: config.x,
                baseY: config.y,
                offsetX: 0,
                offsetY: 0,
                speed: 0.02 + Math.random() * 0.02
            });
        });
    }
    
    bindEvents() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (!this.isMouseActive) {
                this.isMouseActive = true;
                this.container.classList.add('mouse-active');
                this.orbs.forEach(orb => orb.element.classList.add('mouse-active'));
            }
            
            // Reset mouse inactive state after 2 seconds
            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => {
                this.isMouseActive = false;
                this.container.classList.remove('mouse-active');
                this.orbs.forEach(orb => orb.element.classList.remove('mouse-active'));
            }, 2000);
        });
        
        // Keyboard events
        document.addEventListener('keydown', () => {
            if (!this.isKeyboardActive) {
                this.isKeyboardActive = true;
                document.body.classList.add('keyboard-press');
            }
            
            clearTimeout(this.keyboardTimeout);
            this.keyboardTimeout = setTimeout(() => {
                this.isKeyboardActive = false;
                document.body.classList.remove('keyboard-press');
            }, 1000);
        });
        
        // Touch support
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        });
    }
    
    animate() {
        const time = Date.now() * 0.001;
        
        this.orbs.forEach((orb, index) => {
            // Base floating animation
            const floatX = Math.sin(time * orb.speed + index) * 30;
            const floatY = Math.cos(time * orb.speed * 0.7 + index) * 30;
            
            // Mouse influence
            let mouseInfluenceX = 0;
            let mouseInfluenceY = 0;
            
            if (this.isMouseActive) {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const mouseNormX = (this.mouseX / viewportWidth - 0.5) * 2;
                const mouseNormY = (this.mouseY / viewportHeight - 0.5) * 2;
                
                mouseInfluenceX = mouseNormX * 50 * (index + 1) * 0.3;
                mouseInfluenceY = mouseNormY * 50 * (index + 1) * 0.3;
            }
            
            // Combine movements
            const finalX = orb.baseX + floatX + mouseInfluenceX;
            const finalY = orb.baseY + floatY + mouseInfluenceY;
            
            // Apply transform (special handling for centered orb)
            if (index === 2) {
                orb.element.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px))`;
            } else {
                orb.element.style.left = `${finalX}%`;
                orb.element.style.top = `${finalY}%`;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GlobalBackground());
} else {
    new GlobalBackground();
}
