import path from 'path'
import fs from 'fs'

// import ROOT from './assets/root'
const GetABCChars = (Count: number) => {
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    for (let i = 0; i <= Count; i++) {
        console.log(chars[i])
    }
}
function sum(a: number, b: number): number {
    return a + b
}

enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}

const direction: Direction = Direction.Up;
console.log(direction)