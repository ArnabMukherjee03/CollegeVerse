require('dotenv').config({path: '../.env'});
const app = require("./app");
// Port Listening
app.listen(process.env.PORT,()=>{
    console.log("listen at 3000");
})
