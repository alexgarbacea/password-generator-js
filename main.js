//
const displayPasswords = [];
const checkPasswords   = new Set();

const symbols = '!@#$%^&*()_+~`}{[]\:;?><,./-=';
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = '123456789';

// HTML Elements
const sliderRandom  = document.getElementById('pass-slider');
const sliderDisplay = document.getElementById('display-slider-value');
const hasNumbers    = document.getElementById('numbers');
const hasSymbols    = document.getElementById('symbols');
const passType      = document.getElementById('type');
const generateBtn   = document.getElementById('generate');
const historyTable  = document.getElementById('history-table');
const historyBtn    = document.getElementById('history-button');
let clipboardBtn    = document.getElementById('copy-btn');

// Vlaues
const MIN_LENGTH      = 3;
let sliderRandomValue = 15;
let hasNumbersValue   = true;
let hasSymbolsValue   = true;
let passTypeValue     = 0;
let generated         = '';

// Update length value displayed to user in real time
let running = false;
const updateSliderValue = async () => {
    while (running) {
        await new Promise(r => setTimeout(r, 100));
        sliderDisplay.innerHTML= sliderRandom.value; 
    }
}

// Set slider value and display to user
const setSliderValue = (value) => {
    sliderRandom.value = value.toString()
    sliderDisplay.innerHTML= sliderRandom.value;
    sliderRandomValue = parseInt(value)
}

// Handle type change event
const handleTypeChange = (value) => {
    if (passTypeValue === value) return
    passTypeValue = value;
    const sectionForPass = document.getElementById('for-random');
    switch (value) {
        // Password
        case 0:
            setSliderValue(15)
            sectionForPass.style.display = 'flex';
            break;
        // PIN
        case 1:
            setSliderValue(4)
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

// Return the name of the type
const getTypeName = (t) => {
    switch (t) {
        // Password
        case 0:
            return 'Password'
        // PIN
        case 1:
            return 'PIN'
        default:
            break;
    }
}

// Generate click event
const startGenerator = () => {
    const LOOP_LIMIT = 10;
    const displayHtml = document.getElementById('generated-output')
    let generatedPass = ''

    let loopCount = 0;
    // Try to generate unique results
    do {
        passTypeValue === 0 ? generatedPass = generatePassword() : generatedPass = generatePin();
        loopCount++;
    } while(checkPasswords.has(generatedPass) && loopCount < LOOP_LIMIT)

    if (generatedPass === '') return

    displayHtml.innerHTML = ``
    for (let c of generatedPass) {
        const whatColor = getColor(c)
        displayHtml.innerHTML += `<span class="generated-letter" style="color: ${whatColor}">${c}</span>`
    }

    displayHtml.innerHTML += `<div class="copy-btn" id="copy-btn" title="Copy to clipboard">📋</div>`
    generated = generatedPass;
    // Add to set
    checkPasswords.add(generated)
    // Add to history
    const now = new Date()
    displayPasswords.push({ value: generated, type: passTypeValue, time: now })

    clipboardBtn = document.getElementById('copy-btn');
    // To copy to Clipboard
    clipboardBtn.addEventListener('click', () => navigator.clipboard.writeText(generated))

    // Add to history display
    historyTable.innerHTML += 
    `<tr>
    <td>${generated}</td>
    <td>${getTypeName(passTypeValue)}</td>
    <td>${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}</td>
    </tr>`
}

// Toggle history display
const toggleHistory = () => {
    const current = document.getElementById('history-section')
    if(current.style.display === 'none') {
        current.style.display = 'block'
    }
    else {
        current.style.display = 'none'
    }
}

// Add event listeners for:
// When changing type of generated
passType.addEventListener('change', (e) => handleTypeChange(parseInt(e.target.value)))

// When holding slider to change
sliderRandom.addEventListener('pointerdown', () => {
    running = true;
    updateSliderValue();
});

// When releasing slider
sliderRandom.addEventListener('pointerup', (e) => {
    running = false;
    sliderRandomValue = parseInt(e.target.value)
});

// When checking numbers
hasNumbers.addEventListener('change', (e) => { hasNumbersValue = e.target.checked })

// When checking symbols
hasSymbols.addEventListener('change', (e) => { hasSymbolsValue = e.target.checked })

// When generating
generateBtn.addEventListener('click', () => startGenerator())

// When clicking on history
historyBtn.addEventListener('click', () => toggleHistory())