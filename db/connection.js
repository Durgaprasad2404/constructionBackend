const mongoose = require("mongoose");

const DB = mongodb+srv://nathiprasad2404:Durga123@cluster0.l7b6y1y.mongodb.net/;

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
