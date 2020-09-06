const mongoose = require("mongoose");
const Product = require("../models/product.model");
const User = require("../models/user.model");

const category = ['Motos', 'Motor y Accesorios', 'Moda y Accesorios', 'TV, Audio y Foto', 'Móviles y Telefonía', 'Informática y Electrónica', 'Deporte y Ocio', 'Bicicletas', 'Consolas y Videojuegos', 'Hogar y Jardín', 'Electrodomésticos', 'Cine, Libros y Música', 'Niños y Bebés', 'Coleccionismo', 'Materiales de construcción', 'Industria y Agricultura', 'Otros']

module.exports.all = (req, res, next) => {
  res.render("products/all", { 
    title: 'View all products',
    products:  req.currentUser.products
  });
};

module.exports.new = (req, res, next) => {
  res.render("products/new", {
    category: category,
    user: req.currentUser
  });
};

module.exports.create = (req, res, next) => {
  const product = new Product({
    ...req.body,
  });
  product.user = req.currentUser._id.toString();

  product
    .save()
    .then((product) => {
      res.redirect(`/products/${product._id}`);
    })
    .catch((error) => {
      console.log(error)
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("products/new", { error: error.errors, product, category: category });
      } else {
        next(error);
      }
    });
};

module.exports.view = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      res.render("products/show", { product });
    })
    .catch(next);
};

module.exports.viewEdit = (req, res, next) => {
  Product.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
  .then(product => {
    res.render("products/edit", {
      title: 'Edit product',
      product,
      user: req.currentUser,
      category: category
    })
  })
  .catch(next)
};

module.exports.update = (req, res, next) => {
  const body = req.body;
  body.isSold = body.isSold ? true : false
  body.isPublic = body.isPublic ? true : false
  console.log(body.box)
  Product.findById(req.params.id)
    .then(product => {
      if (product.user.toString() === req.currentUser._id.toString()) {
        product.set(body);
        product.save()
        .then(() => {
            res.redirect(`/products/${product._id}`);
          })
          .catch(next);
      } else {
        res.redirect(`/products/${req.params.id}/edit`)
      }
    })
    .catch(next)
};

module.exports.delete = (req, res, next) => {
  req.product
    .remove()
    .then(() => {
      res.redirect("/products");
    })
    .catch(next);
};
