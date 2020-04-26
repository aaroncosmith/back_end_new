const express = require('express'),
  router = express.Router(),
  bcrypt = require('bcryptjs'),
usersModel = require('../models/userModel')
imageModel = require('../models/imageModel');

router.get('/login', function (req, res, next) {
  res.render('template', {
    locals: {
      title: 'Sign In',
      is_logged_in: req.session.is_logged_in
    },
    partials: {
      partial: 'partial-login'
    }
  });
});

router.post("/login", async function(req, res, next) {
  const { email, password } = req.body;
  const user_id = req.session.user_id;
  const profileData = await imageModel.getProfilePicture(user_id);
  const user = new usersModel(null, null, email, password);
  const loginResponse = await user.userLogin();
  // console.log('login response is', loginResponse);
  if (!!loginResponse.isValid) {
    req.session.is_logged_in = loginResponse.isValid;
    req.session.user_id = loginResponse.id;
    req.session.name = loginResponse.name;
    res.redirect('/');
  } else {
    res.sendStatus(403);
  }
});

router.get('/signup', (req, res) => {
  res.render('template', {
    locals: {
      title: 'Sign Up',
      
      is_logged_in:req.session.is_logged_in
    },
    partials:{
      partial: 'partial-signup'
    }
  });
});

router.post('/signup', async (req, res) => {
  const {name, email} = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const user = new usersModel(null, name, email, hash);
  user.save().then(() => {
    res.redirect('/users/login');
  });
});


router.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
