let display = document.getElementById('display');

function handleButtonClick(event) {
    const button = event.currentTarget;
    const value = button.dataset.value;

    let operators = ['+', '-', '*', '/'];

    if (!value) {
        return;
    }

    if (value === 'clear') {
        display.textContent = '0';
        return;
    }

    if (value === 'backspace') {
        if (display.textContent === "NaN") {
            display.textContent = '0';
            return;
        } else {
            display.textContent = display.textContent.slice(0, -1) || '0';
        }
        return;
    }

    if (operators.includes(value)) {
        if (operators.includes(display.textContent[display.textContent.length - 1])) {
            display.textContent += "";
        } else {
            display.textContent += value;
        }
        return;
    }

    if (value === '=') {
        if (display.textContent.includes('/0')) {
            display.textContent = 'NaN';
        } else {
            display.textContent = String(eval(display.textContent));
        }
        return;
    }

    if (/^\d$/.test(value)) {
        if (display.textContent === "NaN") {
            display.textContent = '0';
            return;
        } else if (display.textContent === '0') {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
        return;
    }
}

document.querySelectorAll('.buttons button[data-value]').forEach((button) => {
    button.addEventListener('click', handleButtonClick);
});
