const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override"); 
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookies = require("cookie-parser");

dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(methodOverride("_method")); // makes you able to use other method/http request like put and delete
app.use(express.static("public")); // makes you able to use static files like css and images
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookies());

app.use("/", require("./routes/postRoute"));
app.use("/", require("./routes/registerRoute"));
app.use("/", require("./routes/loginRoute"));

app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});  