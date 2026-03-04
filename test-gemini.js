const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyA84BxwHz80YH0hJahLzwr7OjOsIRKxw1g");
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
    const result = await model.generateContent("Hello");
    console.log(result.response.text());
  } catch (e) {
    console.error(e);
  }
}
run();
