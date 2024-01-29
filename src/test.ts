// import ROOT from './assets/root'
const GetABCChars = (Count: number) => {
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    for (let i = 0; i <= Count; i++) {
        console.log(chars[i])
    }
}
// function sum(a: number, b: number): number {
//     return a + b
// }

enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}

// const direction: Direction = Direction.Up;
// console.log(direction)
type ABCchars = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
type numbers = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
type emojis = '🎉' | '🍕' | '🍔' | '🍩' | '🍗' | '🍫' | '🍲' | '✔' | '🗾' | '✖';
type Allchars = `${ABCchars}${numbers}-${emojis}`

type MathFunction = (a: number, b: number) => number

// Removing Some extra Boiler Plate Code
const add: MathFunction = (c, d) => {
    return c + d
}
const subtract: MathFunction = (c, d) => {
    return c - d
}
const multiply: MathFunction = (c, d) => {
    return c * d
}
const divide: MathFunction = (c, d) => {
    return c / d
}
// Using a Condition by a Ternary Statement
const power = (a: number, b?: number): number => a ** ( b ? b : 2);

// Providing a defaullt Value
const power2 = (a: number, b: number = 2): number => a ** b;

type ArithmeticOperators = '+' | '-' | '*' | '/' | '%' | '**';

export const sum = (action: ArithmeticOperators = '+', ...values: number[]): number => values.reduce((pre, cur) => eval(`${pre} ${action} ${cur}`))

console.log(sum(undefined, 123, 7, 15)) // 145
console.log(sum('+', 123, 7, 15)) // 145
console.log(sum('-', 123, 7, 15)) // 101
console.log(sum('*', 123, 7, 15)) // 12915
console.log(sum('/', 225, 15)) // 15
console.log(sum('**', 35, 2)) // 1225
console.log(sum('%', 10, 3)) // 1