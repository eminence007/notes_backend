const express = require("express");
const { NoteModel } = require("../model/note.model");
const noteRouter = express.Router();
const jwt = require("jsonwebtoken");

//get
noteRouter.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "masai");
  try {
    if (decoded) {
      const notes = await NoteModel.find({ userID: decoded.userID });
      res.status(200).send(notes);
    } else {
      res.status(400).send({ msg: "No Note has been created by user" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//post
noteRouter.post("/add", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.status(200).send({ msg: "A new note has been added" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//patch(update note)
noteRouter.patch("/update/:noteId", async (req, res) => {
  const { noteId } = req.params;
  const payload = req.body;

  try {
    await NoteModel.findByIdAndUpdate({ _id: noteId }, payload);
    res.status(200).send({ msg: "The note has been updated" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//delete(delete note)
noteRouter.delete("/delete/:noteId", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "masai");
  const { noteId } = req.params;
  const req_id = decoded.userID; //the person making delete request
  const note = NoteModel.findOne({ _id: noteId });
  const userID_in_note = note.userID;
  try {
    if (req_id === userID_in_note) {
      await NoteModel.findByIdAndDelete(noteId);
      res.status(200).send({ msg: "The note has been deleted" });
    } else {
      res.status(400).send({ msg: "Not Authorised" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = {
  noteRouter,
};
