const codeContainer = document.getElementsByTagName("pre");

const code = (index, content)=>{
    return codeContainer[index].lastElementChild.textContent = content;
}
code(0,`let age = 25; // A variable named 'age' with the value 25
const name = "John"; // A constant variable named 'name' with the value "John"`)

code(1,`{
    let variable = "Data"
    console.log(variable)
}`)