////////////////////////////////////////////////////////////////////

import Category from './../models/categoryModel.js';
import Tour from './../models/tourModel.js';

import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';


// thanks to closure
export const getCategory = factory.getOne(Category, { path: 'reviews' });
//const getAllCategorys = factory.getAll(Category);
export const createCategory = factory.createOne(Category);
export const updateCategory = factory.updateOne(Category);
export const deleteCategory = factory.deleteOne(Category);


export const getAllCategorys = async (req, res) => {
  try {
    const all = await Category.find({});
    // console.log("all : ", all);
    res.json(all);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

export const toursByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    const tours = await Tour.find({ categoryIn: category }).populate('categoryIn');

    res.json({
      category,
      tours
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};




