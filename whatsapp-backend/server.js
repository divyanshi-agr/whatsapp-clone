//importing
import express from "express";
import mongoose from "mongoose";
import dbMessages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1082395",
  key: "83b3a95704124876a9f8",
  secret: "3f9e1b68e7cbb747bb11",
  cluster: "ap2",
  encrypted: true,
});

//middlewares
app.use(express.json());
app.use(cors());
// app.use((req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });

//DB config
const connection_url =
  "mongodb+srv://admin:Dv1u0Bmfn7KCOOUi@cluster0.wniey.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB Connected!");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//api endpoints
app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

//posting new msg
app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  dbMessages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/messages/sync", (req, res) => {
  dbMessages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

//listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
