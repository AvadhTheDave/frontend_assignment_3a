class Result {
    constructor(ok, value, message) {
        this.ok = ok;
        this.value = value;
        this.message = message;
    }

    static ok(value) {
        return new Result(true, value, null);
    }

    static err(message) {
        return new Result(false, null, message);
    }
}

const display = document.getElementById('display');
const operators = ['+', '-', '*', '/'];
const displayMeasureContext = document.createElement('canvas').getContext('2d');

function resizeDisplayText() {
    if (!displayMeasureContext) {
        throw new Error('Unable to measure calculator display text');
    }

    display.style.fontSize = '';
    const style = getComputedStyle(display);
    displayMeasureContext.font = style.font;
    const availableWidth = display.clientWidth
        - parseFloat(style.paddingLeft)
        - parseFloat(style.paddingRight);
    const textWidth = displayMeasureContext.measureText(display.textContent).width;
    const baseFontSize = parseFloat(style.fontSize);

    if (availableWidth > 0 && textWidth > availableWidth && textWidth > 0) {
        display.style.fontSize = `${baseFontSize * availableWidth / textWidth}px`;
    }
}

function formatResult(value) {
    return String(Math.abs(value) < 1e12
        ? Math.round(value * 1e4) / 1e4
        : value);
}

function evaluate(equation) {
    if (!/^-?\d+(?:\.\d*)?(?:e[+-]?\d+)?(?:[+\-*/]\d+(?:\.\d*)?(?:e[+-]?\d+)?)*$/i.test(equation)) {
        return Result.err("Invalid expression");
    }

    const tokens = equation.match(/^-?\d+(?:\.\d*)?(?:e[+-]?\d+)?|[+\-*/]|\d+(?:\.\d*)?(?:e[+-]?\d+)?/gi);
    let result = Number(tokens[0]);
    let i = 1;

    while (i < tokens.length) {
        const op = tokens[i];
        const next = Number(tokens[i + 1]);
        const prev = result;

        switch (op) {
            case '+': result = prev + next; break;
            case '-': result = prev - next; break;
            case '*': result = prev * next; break;
            case '/': {
                if (next === 0) return Result.err("Nice Try! Cannot divide by zero");
                result = prev / next; break;
            }
        }

        if (!Number.isFinite(result)) return Result.err("Result is too large");

        console.log(`${prev} ${op} ${next} = ${result}`);

        i += 2;
    }

    return Result.ok(result);
}

function input(text, value) {
    const last = text[text.length - 1];

    if (value === 'clear') {
        return Result.ok('0');
    }

    if (value === 'backspace') {
        const newText = text.slice(0, -1);
        return Result.ok(newText === '' || newText === '-' ? '0' : newText);
    }

    if (operators.includes(value)) {
        if (operators.includes(last)) {
            return Result.ok(text.slice(0, -1) + value);
        }

        const result = evaluate(text);
        if (!result.ok) return result;

        return Result.ok(formatResult(result.value) + value);
    }

    if (value === '.') {
        const lastOperator = Math.max(...operators.map((operator) => text.lastIndexOf(operator)));
        const currentNumber = text.slice(lastOperator + 1);
        if (currentNumber.includes('.')) return Result.ok(text);
        return Result.ok(text + (currentNumber === '' ? '0.' : '.'));
    }

    if (value === '=') {
        if (operators.includes(last)) return Result.err("Missing number");

        const result = evaluate(text);
        if (!result.ok) return result;

        return Result.ok(formatResult(result.value));
    }

    if (text === '0') return Result.ok(value);
    return Result.ok(text + value);
}

function processInput(value) {
    const result = input(display.textContent, value);

    if (result.ok) {
        display.textContent = result.value;
        resizeDisplayText();
    } else {
        alert(result.message);
        console.log(result.message);
    }
}

function handleButtonClick(event) {
    const value = event.currentTarget.dataset.value;
    processInput(value);
}

function handleKeyDown(event) {
    if (event.key === 'Escape') return;

    let value = event.key;
    if (event.key === 'Enter') value = '=';
    if (event.key === 'Backspace') value = 'backspace';

    if (!/^[0-9.+\-*\/=]$/.test(value) && value !== 'backspace') return;

    event.preventDefault();
    processInput(value);
}

document.querySelectorAll('.buttons button[data-value]').forEach((button) => {
    button.addEventListener('click', handleButtonClick);
});

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('resize', resizeDisplayText);
document.fonts.ready.then(resizeDisplayText);
resizeDisplayText();


