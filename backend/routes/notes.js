const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const router = express.Router();


// ROUTE: 3 ==> Get All the NOTES : GET "/api/notes/fetchallnotes" - require login
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id })
    res.json(notes)
})

module.exports = router