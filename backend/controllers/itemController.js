import Item from '../models/Item.js';

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
