const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const prizeText = document.getElementById('prizeText');

// Set canvas dimensions
canvas.width = 300;
canvas.height = 200;

// Create a gray scratch surface
ctx.fillStyle = '#ccc';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Function to generate a random discount percentage
function getRandomDiscount() {
    const discounts = ['5%', '10%', '15%', '20%', '25%', '30%','50%','Better luck next time'];
    return discounts[Math.floor(Math.random() * discounts.length)];
}

// Set random prize
const prize = `You won ${getRandomDiscount()} Off!`;
prizeText.textContent = prize;

// Handle mouse and touch events
let isScratching = false;

canvas.addEventListener('mousedown', () => isScratching = true);
canvas.addEventListener('mouseup', () => isScratching = false);
canvas.addEventListener('mousemove', scratch);

canvas.addEventListener('touchstart', (e) => {
    isScratching = true;
    e.preventDefault();
});
canvas.addEventListener('touchend', (e) => {
    isScratching = false;
    e.preventDefault();
});
canvas.addEventListener('touchmove', (e) => {
    if (!isScratching) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    scratch({
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
    });
    e.preventDefault();
});

function scratch(e) {
    if (!isScratching) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Clear enough surface to reveal the prize
canvas.addEventListener('mouseup', checkScratch);
canvas.addEventListener('touchend', checkScratch);

function checkScratch() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) cleared++;
    }

    if (cleared / (canvas.width * canvas.height) > 0.5) {
        canvas.style.pointerEvents = 'none';
        alert(`Congratulations! ${prize}`);
    }
}
