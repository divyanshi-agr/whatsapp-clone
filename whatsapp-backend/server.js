//importing
import express from "express";
import mongoose from "mongoose";

//app config
const app = express();
const port = process.env.PORT || 9000;

//middlewares

//DB config
const connection_url =
  "mongodb+srv://admin:Dv1u0Bmfn7KCOOUi@cluster0.wniey.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//????

//api endpoints
app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

//listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
