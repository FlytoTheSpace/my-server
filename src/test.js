// var compose = function (functions, x) {
//     const orderedFunctions = functions.reverse()
//     return function(x){
//         let n = x;
//         for (let i = 0; i < orderedFunctions.length; i++) {
//             n = orderedFunctions[i](n)
//         }
//         return n
//     }
// };

// console.log(compose([x => x + 1, x => x * x, x => 2 * x])(4))

const findRepeatingValues = (arr)=>{
    arr.sort((a, b)=>a-b)
    let RepeatingValues = []

    for(let i = 0; i<arr.length; i++){

        if (arr.filter((value) => value === arr[i] && RepeatingValues.find(value => value === arr[i]) === undefined ).length>1) RepeatingValues.push(arr[i]);
    }
    return RepeatingValues.length > 0 ? RepeatingValues  : null
}

let arr = [1, 4, 6 , 2, 2, 425, 45, 3, 4, 5 ,6, 12];
console.log(findRepeatingValues(arr));