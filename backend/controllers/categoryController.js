const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const list = asyncHandler(async (_, res) => res.json(await Category.find().sort('name')));
const create = asyncHandler(async (req, res) => res.status(201).json(await Category.create(req.body)));
const update = asyncHandler(async (req, res) => res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })));
const remove = asyncHandler(async (req, res) => { await Category.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = { list, create, update, remove };
