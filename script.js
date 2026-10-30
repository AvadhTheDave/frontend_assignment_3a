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

function evaluate(equasion) {
    const tokens = equasion.match(/^-?\d+(?:\.\d+)?|\d+(?:\.\d+)?|[+\-*/]/g);
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
                if (next === 0) return Result.err("Zero division");
                result = prev / next; break;
            }
        }

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
        return Result.ok(text + value);
    }

    if (value === '=') {
        if (operators.includes(last)) return Result.err("Missing number");

        const result = evaluate(text);
        if (!result.ok) return result;

        return Result.ok(String(Math.round(result.value * 1e10) / 1e10));
    }

    if (text === '0') return Result.ok(value);
    return Result.ok(text + value);
}

function handleButtonClick(event) {
    const value = event.currentTarget.dataset.value;
    const result = input(display.textContent, value);

    if (result.ok) {
        display.textContent = result.value;
    } else {
        alert(result.message);
        console.log(result.message);
    }
}

document.querySelectorAll('.buttons button[data-value]').forEach((button) => {
    button.addEventListener('click', handleButtonClick);
});
