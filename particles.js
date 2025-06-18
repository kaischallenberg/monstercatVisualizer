const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let lines = [];
let clouds = [];

let particleColor = '#FFFFFF';
let animationSpeed = 3;
let lastTimestamp = 0;

let particleSpawnTimeAccumulator = 0;
let lineSpawnTimeAccumulator = 0;
let cloudSpawnTimeAccumulator = 0;

let baseParticleSpawnInterval = 100;
let baseLineSpawnInterval = 1500;
let baseCloudSpawnInterval = 400;

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    particles = [];
    lines = [];
    clouds = [];
}

window.onload = function () {
    if(!settings.particles) return
    resizeCanvas();
    animate(0);
};

class Particle {
    constructor(x, y, radius, color, speedX, speedY, opacity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = opacity;
    }

    update(deltaTime) {
        this.x += this.speedX * animationSpeed * (deltaTime / 16.67);
        this.y += this.speedY * animationSpeed * (deltaTime / 16.67);
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class Cloud {
    constructor(x, y, radius, color, speedX, speedY, opacity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = opacity;
    }

    update(deltaTime) {
        this.x += this.speedX * animationSpeed * (deltaTime / 16.67);
        this.y += this.speedY * animationSpeed * (deltaTime / 16.67);
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }
}

class Line {
    constructor(x1, y1, length, angle, color, opacity, moveSpeed, lineWidth) {
        this.x1 = x1;
        this.y1 = y1;
        this.length = length;
        this.angle = angle;
        this.color = color;
        this.opacity = opacity;
        this.moveSpeed = moveSpeed;
        this.lineWidth = lineWidth;
    }

    update(deltaTime) {
        const currentSpeed = this.moveSpeed * animationSpeed * (deltaTime / 16.67);
        this.x1 += currentSpeed * Math.cos(this.angle);
        this.y1 += currentSpeed * Math.sin(this.angle);
        this.x2 = this.x1 + this.length * Math.cos(this.angle);
        this.y2 = this.y1 + this.length * Math.sin(this.angle);
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.restore();
    }
}

function generateParticle() {
    const radius = Math.random() * 1 + 0.5;
    const x = 0 - radius * (Math.random() * 2 + 1);
    const yMin = canvas.height * 0.05;
    const yMax = canvas.height * 0.95;
    const y = yMin + Math.random() * (yMax - yMin) * 0.5 + (canvas.height * 0.25);
    const color = '#FFFFFF';
    const opacity = Math.random() * (0.7 - 0.2) + 0.2;
    const speedX = Math.random() * 0.5 + 0.2;
    const speedY = (Math.random() - 0.5) * 0.5;
    particles.push(new Particle(x, y, radius, color, speedX, speedY, opacity));
}

function generateCloud() {
    const radius = Math.random() * (200 - 50) + 50;
    const x = 0 - radius * (Math.random() * 2 + 1);
    const yMin = canvas.height * 0.4;
    const yMax = canvas.height * 0.6;
    const y = yMin + Math.random() * (yMax - yMin);
    const color = Math.random() < 0.6 ? '#B0B0B0' : particleColor;
    const opacity = 0.01;
    const speedX = Math.random() * 0.5 + 0.2;
    const speedY = (Math.random() - 0.5) * 0.5;
    clouds.push(new Cloud(x, y, radius, color, speedX, speedY, opacity));
}

function generateLine() {
    const x1 = 0 - (Math.random() * 100 + 50);
    const yMin = canvas.height * 0.05;
    const yMax = canvas.height * 0.95;
    const y1 = yMin + Math.random() * (yMax - yMin);
    const length = Math.random() * (7 - 3) + 3;
    const angle = (Math.random() - 0.5) * Math.PI / 4;
    const lineWidth = 2;
    const color = particleColor;
    const opacity = 1;
    const moveSpeed = Math.random() * 0.5 + 0.2;
    lines.push(new Line(x1, y1, length, angle, color, opacity, moveSpeed, lineWidth));
}

function animate(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const desiredParticleSpawnInterval = baseParticleSpawnInterval / animationSpeed;
    particleSpawnTimeAccumulator += deltaTime;
    while (particleSpawnTimeAccumulator >= desiredParticleSpawnInterval) {
        generateParticle();
        particleSpawnTimeAccumulator -= desiredParticleSpawnInterval;
    }
    const desiredLineSpawnInterval = baseLineSpawnInterval / animationSpeed;
    lineSpawnTimeAccumulator += deltaTime;
    while (lineSpawnTimeAccumulator >= desiredLineSpawnInterval) {
        generateLine();
        lineSpawnTimeAccumulator -= desiredLineSpawnInterval;
    }
    const desiredCloudSpawnInterval = baseCloudSpawnInterval / animationSpeed;
    cloudSpawnTimeAccumulator += deltaTime;
    while (cloudSpawnTimeAccumulator >= desiredCloudSpawnInterval) {
        generateCloud();
        cloudSpawnTimeAccumulator -= desiredCloudSpawnInterval;
    }
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.update(deltaTime);
        particle.draw(ctx);
        if (particle.x - particle.radius > canvas.width ||
            particle.y + particle.radius < 0 ||
            particle.y - particle.radius > canvas.height) {
            particles.splice(i, 1);
            i--;
        }
    }
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        line.update(deltaTime);
        line.draw(ctx);
        const maxX = Math.max(line.x1, line.x2);
        const minX = Math.min(line.x1, line.x2);
        const maxY = Math.max(line.y1, line.y2);
        const minY = Math.min(line.y1, line.y2);
        if (minX > canvas.width || maxY < 0 || minY > canvas.height) {
            lines.splice(i, 1);
            i--;
        }
    }
    for (let i = 0; i < clouds.length; i++) {
        const cloud = clouds[i];
        cloud.update(deltaTime);
        cloud.draw(ctx);
        const maxX = Math.max(cloud.x1, cloud.x2);
        const minX = Math.min(cloud.x1, cloud.x2);
        const maxY = Math.max(cloud.y1, cloud.y2);
        const minY = Math.min(cloud.y1, cloud.y2);
        if (minX > canvas.width || maxY < 0 || minY > canvas.height) {
            clouds.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
