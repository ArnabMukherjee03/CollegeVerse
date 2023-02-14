require('dotenv').config({path: '.env'});
const app = require("./src/app");
port = process.env.PORT || 3000;
// Port Listening
app.listen(port,()=>{
    console.log("listen at ",port);
})
