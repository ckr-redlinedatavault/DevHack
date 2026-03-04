const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyA84BxwHz80YH0hJahLzwr7OjOsIRKxw1g");
async function run() {
    try {
        const list = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyA84BxwHz80YH0hJahLzwr7OjOsIRKxw1g`);
        const data = await list.json();
        console.log(data);
    } catch (e) {
        console.error(e);
    }
}
run();
