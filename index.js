require('dotenv').config({path: '.env'});
const app = require("./src/app");
port = process.env.PORT;
// Port Listening
app.listen(port,()=>{
    console.log("listen at ",port);
})
