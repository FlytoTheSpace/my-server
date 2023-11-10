const prompt = require('prompt-sync')();

function calculate(input) {
    if (input.includes("+")) {
        input = input.split("+");
        operand1 = Number.parseInt(input[0]);
        operand2 = Number.parseInt(input[1]);
        let ans = operand1 + operand2;
        return console.log(ans)

    } else if (input.includes("-")) {
        input = input.split("-");
        operand1 = Number.parseInt(input[0]);
        operand2 = Number.parseInt(input[1]);
        let ans = operand1 - operand2;
        return console.log(ans)

    } else if (input.includes("*")) {
        input = input.split("*");
        operand1 = Number.parseInt(input[0]);
        operand2 = Number.parseInt(input[1]);
        let ans = operand1 * operand2;
        return console.log(ans)

    } else if (input.includes("/")) {

        input = input.split("/");
        operand1 = Number.parseInt(input[0]);
        operand2 = Number.parseInt(input[1]);
        let ans = operand1 / operand2;
        return console.log(ans)

    } else if (input.includes("**")) {

        input = input.split("**");
        operand1 = Number.parseInt(input[0]);
        operand2 = Number.parseInt(input[1]);
        let ans = operand1**operand2;
        return console.log(ans)

    } else {
        return "Something went wrong";
    }
}

let input = prompt("Calculate:");
console.log(calculate(input));
