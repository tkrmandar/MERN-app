const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// POST /api/items - create item
router.post('/', async (req, res) => {
  try {
    const newItem = new Item({ name: req.body.name, company: req.body.company });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/items - fetch all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/id - Update the items
router.put('/:id', async (req,res) => { 
  try {
    const getItem = await Item.findByIdAndUpdate(
      req.params.id,
      {name : req.body.name, company : req.body.company},
      { new: true }
    )
    res.status(200).json(getItem);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// DELETE /api/id - DElete the items
router.delete('/:id', async (req,res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({message : "Item deleted"});
  } catch (error) {
    res.status(400).json(error.message);
  }
})

module.exports = router;
