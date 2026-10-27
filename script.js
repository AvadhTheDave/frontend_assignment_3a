let display = document.getElementById('display');
let pendingOperator = null;
let waitingForOperand = false;

function operate(firstNum, operator, secondNum) {
    let result;
    switch (operator) {
        case '+':
            result = firstNum + secondNum;
            break;
        case '-':
            result = firstNum - secondNum;
            break;
        case '*':
            result = firstNum * secondNum;
            break;
        case '/':
            result = firstNum / secondNum;
            break;
        default:
            throw new Error('Invalid operator');
    }
    return result;
}

function handleButtonClick(event) {
    const button = event.currentTarget;
    const value = button.dataset.value;

    if (!value) {
        return;
    }

    if (value === 'clear') {
        display.textContent = '0';
        pendingOperator = null;
        waitingForOperand = false;
        return;
    }

    if (value === 'backspace') {
        if (waitingForOperand) {
            return;
        }

        display.textContent = display.textContent.slice(0, -1) || '0';
        return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
        if (pendingOperator && !waitingForOperand) {
            display.textContent = String(
                operate(Number(display.textContent), pendingOperator, Number(value))
            );
        }

        pendingOperator = value;
        waitingForOperand = true;
        return;
    }

    if (value === '=') {
        if (pendingOperator && !waitingForOperand) {
            display.textContent = String(
                operate(Number(display.textContent), pendingOperator, Number(display.textContent))
            );
            pendingOperator = null;
            waitingForOperand = true;
        }
        return;
    }

    if (/^\d$/.test(value)) {
        if (waitingForOperand) {
            display.textContent = value;
            waitingForOperand = false;
        } else {
            display.textContent =
                display.textContent === '0'
                    ? value
                    : display.textContent + value;
        }
    }
}

document.querySelectorAll('.buttons button[data-value]').forEach((button) => {
    button.addEventListener('click', handleButtonClick);
});
