const mongoose = require("mongoose");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Attachment = require("../models/attachment.model");

module.exports.all = (req, res, next) => {
  Product.find({ isPublic: true })
    .populate("user")
    .populate("attachments")
    .then((products) => {
      res.render("jungle-sales/all", {
        products
      });
    })
    .catch(next);
};

module.exports.jungleSpace = (req, res, next) => {
  Product.find({ user: req.params.id, isPublic: true})
    .populate("user")
    .populate("attachments")
    .then((products) => {
      res.render("jungle-sales/jungle-space", { products, user: products[0].user });
    })
    .catch(next);
};

module.exports.viewProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .populate("user")
    .populate("attachments")
    .then((product) => {
      res.render("jungle-sales/product", { product });
    })
    .catch(next);
};