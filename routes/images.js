const express = require('express'),
router = express.Router(),
imageModel = require('../models/imageModel'),
commentsModel = require('../models/commentsModel');


/* GET home page. */
router.get('/', async function(req, res, next) {
  const resultData = await imageModel.getAllPictures();

  res.render('template', {
    locals: {
      title: 'Film Data',

      resultData: resultData,
      is_logged_in: is_logged_in
    },
    partials: {
      partial: 'partial-index'
    }
  })
});

router.get("/:picture_id", async function(req, res, next) {
  const { picture_id } = req.params;
  console.log(picture_id);
  const user_id = req.session.user_id;
  const data = await imageModel.getPicturesById(picture_id);
  const profileData = await imageModel.getProfilePicture(user_id);

  res.render("template", {
    locals: {
      title: 'Film Data',
      user_id: user_id,
      data: data,
      profileData: profileData,
      name: req.session.name,
      is_logged_in: req.session.is_logged_in
    },
    partials: {
      partial: "partial-single-img"
    }
  });
});

router.post("/comment", async (req, res) => {
  const { user_id, picture_id, comment } = req.body;
  const postData = new commentsModel(null, user_id, picture_id, comment, null)
    postData.addComment().then(() => {
      res.redirect('/images')
    });
    res.redirect('/')
});

module.exports = router;


