const Note = require('../models/Note');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' });
  }

  // Add username to each note before sending the response
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );
  res.json(notesWithUser);
});

// @desc Create a note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;
  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const duplicate = await Note.findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }
  const note = await Note.create({ user, title, text });
  const assignedUser = await User.findById(user).lean().exec();

  if (note) {
    res.status(201).json({
      message: `${note.title} note created for ${assignedUser.username}`,
    });
  } else {
    res.status(400).json({ message: 'Invalid note data received' });
  }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields required' });
  }
  const isUser = await User.findById(user).lean().exec();
  if (!isUser) {
    return res.status(400).json({
      message: `Cannot reassign note, user with ID ${user} does not exist`,
    });
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: `No note found with ID ${id}` });
  }

  const duplicate = await Note.findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;
  const updatedNote = await note.save();

  res.json(updatedNote);
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'Note ID required' });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: `No note found with ID ${id}` });
  }
  const result = await note.deleteOne();
  const reply = `Note ${note.title} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
