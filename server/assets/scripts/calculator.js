const prompt = require('prompt-sync')();
const { evaluate } = require('mathjs');

const calculate = ()=>{
    let input = prompt("Calculate:");
    let ans = evaluate(input);
    console.log(ans);

    let choice = prompt("would you like to continue? y/n:");
    if(choice == "y"){
        calculate()
    } else if(choice != "y" && choice != "n") {
        throw new Error("invalid value");
    };
};
calculate();
