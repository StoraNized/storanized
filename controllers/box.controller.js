const mongoose = require("mongoose");
const Box = require("../models/box.model");

module.exports.all = (req, res) => {
  res.render("boxes/all", { 
    title: 'View all boxes',
    boxes:  req.currentUser.boxes,
    breadcrumbs: req.breadcrumbs
  });
};

module.exports.newBox = (req, res) => {
  res.render('boxes/new', { 
    title: 'Add new box',
    user: req.currentUser,
    breadcrumbs: req.breadcrumbs
  })
};

module.exports.create = (req, res, next) => {
  const box = new Box({
    ...req.body,
    user: req.currentUser._id.toString(),
  });

  box.save()
  .then(box => {
    res.redirect(`/boxes/${box._id}`);
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        error.errors.message = 'Please, check the data entered'
        res.render("boxes/new", { error: error.errors, box, breadcrumbs: req.breadcrumbs });
      } else {
        next(error);
      }
    });
};

module.exports.view = (req, res, next) => {
  Box.findById({user: req.currentUser._id.toString(), _id: req.params.id})
    .populate("user")
    .populate("storage")
    .populate("products")
    .then(box => {
      req.breadcrumbs[req.breadcrumbs.length-1].name = box.name
      res.render("boxes/show", { 
        title: 'View Box',
        box, 
        breadcrumbs: req.breadcrumbs,
        user: req.currentUser
      });
    })
    .catch(next);
};

module.exports.viewEdit = (req, res, next) => {
  Box.findById(req.params.id)
  .then(box => {
    req.breadcrumbs[req.breadcrumbs.length-2].name = box.name
    res.render("boxes/edit", {
      title: 'Edit box',
      box,
      user: req.currentUser,
      breadcrumbs: req.breadcrumbs
    })
  })
  .catch(next)
};

module.exports.update = (req, res, next) => {
  const body = req.body;
  Box.findById(req.params.id)
    .then(box => {
      if (box.user.toString() === req.currentUser._id.toString()) {
        box.set(body);
        box.save()
          .then(() => {
            res.redirect(`/boxes/${box._id}`);
          })
          .catch(next);
      } else {
        res.redirect(`/boxes/${req.params.id}/edit`)
      }
    })
    .catch(next)
};

module.exports.delete = (req, res, next) => {
  req.box.remove()
    .then(() => {
      res.redirect("/boxes");
    })
    .catch(next);
};

module.exports.apiDoNewBox = (req, res, next) => {
  const box = new Box({
    ...req.body,
    user: req.currentUser._id.toString()
  })
  box.save()
    .then(box => {
      res.status(200).json(box)
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        error.errors.message = 'Please, check the data entered'
        res.status(201).json(error.errors)
      } else {
        res.status(201).json(error);
      }
    })
}

module.exports.apiGetBoxesInStorage = (req, res, next) => {
  Box.find({user: req.currentUser._id, storage: req.params.id}, {name: 1})
  .then(boxes => {
    res.status(200).json(boxes)
  })
};
