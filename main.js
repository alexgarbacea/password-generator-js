//
const displayPasswords = [];
const checkPasswords = new Set();
const symbols = '!@#$%^&*()_+~`}{[]\:;?><,./-=';
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = '123456789';

// HTML Elements
const sliderRandom = document.getElementById('pass-slider');
const hasNumbers   = document.getElementById('numbers');
const hasSymbols   = document.getElementById('symbols');
const passType     = document.getElementById('type');
const generateBtn  = document.getElementById('generate');
let clipboardBtn   = document.getElementById('copy-btn');

// Vlaues
const MIN_LENGTH = 3;
let sliderRandomValue = 15;
let hasNumbersValue = true;
let hasSymbolsValue = false;
let passTypeValue = 0;
let generated = '';

// Update length value displayed to user in real time
let running = false;
const updateSliderValue = async () => {
    while (running) {
        await new Promise(r => setTimeout(r, 150));
        document.getElementById('display-slider-value').innerHTML= sliderRandom.value; 
    }
}

// Handle type change event
const handleTypeChange = (value) => {
    if (passTypeValue === value) return
    passTypeValue = value;
    const sectionForPass = document.getElementById('for-random');
    switch (value) {
        case 0:
            sectionForPass.style.display = 'flex';
            break;
        case 1:
            sectionForPass.style.display = 'none';
            break;
        default:
            break;
    }
}

// Generate pin
const generatePin = () => {
    if (sliderRandomValue < MIN_LENGTH) return ''
    let finalPin = ''
    for (let i = 0; i < sliderRandomValue; i++) {
        const generatedDigit = parseInt(Math.random() * 9);
        finalPin = `${finalPin}${generatedDigit}`
    }
    return finalPin
}

// Generate Password
const generatePassword = () => {
    if (sliderRandomValue < MIN_LENGTH) return ''
    let passString = letters;
    if (hasNumbersValue) passString += numbers
    if (hasSymbolsValue) passString += symbols

    let finalPass = ''
    for (let i = 0; i < sliderRandomValue; i++) {
        const generatedCharacter = passString[parseInt(Math.random() * passString.length - 1)];
        finalPass = `${finalPass}${generatedCharacter}`
    }
    return finalPass
}

// Get color of char
const getColor = (c) => {
    // Symbols
    if (symbols.includes(c))                   return '#e64a4a'
    // Letters
    else if (parseInt(c).toString() === 'NaN') return '#333'
    // Numbers
    else                                       return '#0572ec'
}

// Generate
const startGenerator = () => {
    const displayHtml = document.getElementById('generated-output')
    let generated = ''
    passTypeValue === 0 ? generated = generatePassword() : generated = generatePin()
    if (generated === '') return

    displayHtml.innerHTML = ``
    for (let c of generated) {
        const whatColor = getColor(c)
        displayHtml.innerHTML += `<span class="generated-letter" style="color: ${whatColor}">${c}</span>`
    }

    displayHtml.innerHTML += `<div class="copy-btn" id="copy-btn" title="Copy to clipboard">📋</div>`

    clipboardBtn = document.getElementById('copy-btn');
    // To copy to Clipboard
    clipboardBtn.addEventListener('click', () => navigator.clipboard.writeText(generated))
}

// Add event listeners for:
// When changing type of generated
passType.addEventListener('change', (e) => handleTypeChange(parseInt(e.target.value)))

// When holding slider to change
sliderRandom.addEventListener('mousedown', () => {
    running = true;
    updateSliderValue();
});

// When releasing slider
sliderRandom.addEventListener('mouseup', (e) => {
    running = false;
    sliderRandomValue = parseInt(e.target.value)
});

// When checking numbers
hasNumbers.addEventListener('change', (e) => { hasNumbersValue = e.target.checked })

// When checking symbols
hasSymbols.addEventListener('change', (e) => { hasSymbolsValue = e.target.checked })

// When generating
generateBtn.addEventListener('click', () => startGenerator())