////////////////////////////////////////////////////////////////////

import Category from './../models/categoryModel.js';
import Tour from './../models/tourModel.js';

import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';


// thanks to closure
const getCategory = factory.getOne(Category, { path: 'reviews' });
//const getAllCategorys = factory.getAll(Category);
const createCategory = factory.createOne(Category);
const updateCategory = factory.updateOne(Category);
const deleteCategory = factory.deleteOne(Category);


const getAllCategorys = async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const toursByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const tours = await Tour.find({ category }).populate('category');

    res.json({
      category,
      tours
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

export {getCategory, createCategory, updateCategory, deleteCategory, getAllCategorys, toursByCategory}




