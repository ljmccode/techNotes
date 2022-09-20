const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');

// Notes are assigned to specific users
// Notes have a ticket #, title, note body, created & updated dates
// Notes are either OPEN or COMPLETED
// Notes can only be deleted by Managers or Admins
// Anyone can create a note (when customer checks-in)
// Employees can only view and edit their assigned notes
// Managers and Admins can view, edit, and delete all notes

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {});

// @desc Create a note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
