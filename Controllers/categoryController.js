require("dotenv").config();
const AppError = require("../Helpers/AppError");
const Categories = require("../Models/Categories");
const User = require("../Models/Users");

//http://localhost:8080/categories/

const getAllCategories = async (req, res, next) => {
      const categories = await Categories.find();
      if (categories.length == 0) return next(new AppError("no categories found!",404));
      res.status(200).json({
        message: "All categories retrieved successfully",
        categories,
      });
};

//http://localhost:8080/categories

const createCategory = async (req, res, next) => {
      const user = await User.findById(req.id);
      if(user.role != "admin") return next(new AppError("unauthorized",403));
      const { name } = req.body;
      if (!name) return next(new AppError("Please enter the category name!"));
      const category = new Categories({ name });
      await category.save();
      res.send({ message: "Category created successfully", category });
};

//http://localhost:8080/categories/:id

const updateCategoryById = async (req, res, next) => {
      const user = await User.findById(req.id);
      if(user.role != "admin") return next(new AppError("unauthorized",403));
      const category = await Categories.findById(req.params.id);
      if (!category) return next(new AppError("this category does not exist"));
      const newCategory = await Categories.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.send({ message: "Category updated successfully", newCategory });
};

//http://localhost:8080/categories/:id

const deleteCategoryById = async (req, res, next) => {
      const user = await User.findById(req.id);
      if(user.role != "admin") return next(new AppError("unauthorized",403));
      const categories = await Categories.findById(req.params.id);
      if (!categories) return next(new AppError("category does not exist"));
      await Categories.findByIdAndDelete(req.params.id);
      res.send({ message: "Category deleted successfully" });
};

module.exports = {
  createCategory,
  getAllCategories,
  deleteCategoryById,
  updateCategoryById,
};
