const UserModel = require("../model/UserModel");
const PostModel = require("../model/PostModel");
const uuid = require('uuid').v4

/*
    make sure that the user email and username are uniqe before create the acc
*/
let userEmialIsUniqe = (email, username, callBack = () => { }) => {
  new UserModel().getOne({ email }, (data) => {
    if (data == null) new UserModel().getOne({ username }, (data2) => { if (data2 == null) callBack(true); });
    else callBack(false);
  });
};

let signup = (req, res) => {
  let user = req.body;
  user.id = uuid()
  userEmialIsUniqe(user.email, user.username, unique => {
    if (unique) new UserModel().insert(user, () => res.redirect('/login'));
    else res.redirect('/login');
  });
};

let login = (req, res) => {
  let user = req.body;
  new UserModel().getOne({ email: user.email, password: user.password }, data => {
    if (data == null) res.redirect("/login");
    else {
      let { id, first_name, last_name, email, location } = data;
      req.session.user = { id, first_name, last_name, email, location };
      res.redirect('/');
    }
  });
};

let logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

let foundLostItem = (req, res) => {
  new PostModel().update({ id: req.body.id }, { updated_at: new Date(), founded: true, contact_number: req.body.phone }, () => {
    res.redirect('/')
  })
};

let trackLosts = (req, res) => {
  new PostModel().getAll({ user_id: req.session.user.id }, {}, (data) => {
    res.render('my-losts', { data })
  })
};

let newsFeed = (req, res) => {
  new PostModel().getAll({ user_id: { $ne: req.session.user.id }, founded: false }, {}, (data) => {
    res.render('index', {
      data,
      user: `${req.session.user.first_name} ${req.session.user.last_name}`
    })
  });
};

let addLostItem = (req, res) => {
  let img = req.files.img
  img.name = uuid() + '.jpg';
  img.mv('public/images/posts/' + img.name, (err) => {
    let post = req.body;
    post.id = uuid();
    post.user_id = req.session.user.id;
    post.founded = false;
    post.contact_number = null;
    post.created_at = new Date();
    post.updated_at = new Date();
    post.img = req.files.img.name;
    new PostModel().insert(post, () => {
      res.redirect('/')
    })
  });
};

module.exports = { signup, login, logout, foundLostItem, trackLosts, newsFeed, addLostItem };