require("dotenv").config();
const AppError = require("../Helpers/AppError");
const Categories = require("../Models/Categories");

//http://localhost:8080/categories/

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find();
    if (categories.length == 0)
      return next(new AppError("no categories found!"));
    res.send({ message: "All categories retrieved successfully", categories });
  } catch (error) {
    return next(error);
  }
};

//http://localhost:8080/categories

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return next(new AppError("Please enter the category name!"));
    const category = new Categories({ name });
    await category.save();
    res.send({ message: "Category created successfully", category });
  } catch (error) {
    return next(error);
  }
};

//http://localhost:8080/categories/:id

const updateCategoryById = async (req, res, next) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category) return next(new AppError("this category does not exist"));
    const newCategory = await Categories.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // if (req.authorizedUser.id == category.userId) 
    // {
    // } 
    // else
    //  {
    //   res.send({ message: "you can't edit other users posts" });
    // }
    res.send({ message: "Category updated successfully", newCategory });
  } catch (err) 
  {
    return next(err);
  }
};


//http://localhost:8080/categories/:id

const deleteCategoryById = async (req, res, next) => {
  try {
    const categories = await Categories.findById(req.params.id);
    if (!categories) return next(new AppError("category does not exist"));
    // if (
    //   req.authorizedUser.id == categories.userId ||
    //   req.authorizedUser.role == "admin"
    // ) 
    // {
      await Categories.findByIdAndDelete(req.params.id);
      res.send({ message: "Category deleted successfully" });
    // } 
    // else 
    // {
    //   res.send({ message: "you can't delete other users posts" });
    // }
  } catch (err) {
    return next(err);
  }
};

module.exports = { createCategory, getAllCategories,deleteCategoryById,updateCategoryById };
