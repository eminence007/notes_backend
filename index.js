const express = require("express");
const { connection } = require("./db");
const { auth } = require("./middlewares/auth.middleware");
const { noteRouter } = require("./routes/notes.routes");
const { userRouter } = require("./routes/user.routes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

//users(auth)
app.use("/users", userRouter);

//auth-middleware(app will move to notes after checking this only)
app.use(auth);

//notes-route
app.use("/notes", noteRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Cannot connect to DB");
    console.log("error:", error);
  }

  console.log(`Server is running at port ${process.env.port}`);
});
