const express = require("express");
const cors = require("cors");
const User = require("./db/models/user");
const Chat = require("./db/models/chats");
const Message = require("./db/models/messages");
require("./db/config");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin:"*",
    credentials:true
}));

app.use(express.json());

app.get("", (req, res) => {
  res.send("<h1>Server has started on 5000</h1>");
});

app.post("/api/request/chat/:userId", (req, res) => {
  const apiKey = process.env.API_KEY;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0301",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `User : ${req.body.input}`,
        },
      ],
      max_tokens: 3500,
    }),
  };

  fetch("https://api.openai.com/v1/chat/completions", options)
    .then((response) => response.json())
    .then((data) => {
      User.findOne({ _id: req.params.userId })
        .then(async (userId) => {
          try {
            const message = new Message({
              question: req.body.input,
              answer: data.choices[0].message.content,
              user: userId._id,
            });
            const response = await message.save();
            res.send(response);
          } catch (e) {
            console.log(e);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

app.post("/api/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const response = await user.save();
    res.send(response);
  } catch (e) {
    console.log(e);
  }
});

app.post("/api/login", async (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/profile/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.get("/api/messages/profile/:id", (req, res) => {
  Message.find({ user: req.params.id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/messages/:id", (req, res) => {
  Message.findOne({ _id: req.params.id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log("app is listening on port ", port);
});
