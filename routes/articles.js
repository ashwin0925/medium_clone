var express = require('express');
var Article = require('../models/article')
var Comment = require('../models/comment')
var router = express.Router();
var middleware = require('../modules/middlewares');
var User = require('../models/user')

/* GET users listing. */

// create

router.get('/create', middleware.checkUserLogged, (req, res, next) => {
  res.render('articleForm');
});

router.post('/', middleware.checkUserLogged, (req, res, next) => {
  var articleData = req.body;
  // articleData.author = req.loggedUser.id;
  req.body.author = req.loggedUser.id
  Article.create(articleData, (err, createdArticle) => {
    if (err) return next(err);
    res.redirect('/articles')
  })
})


// display all articles

router.get('/', (req, res, next) => {
  Article
    .find()
    .populate('author')
    .exec((err, articles) => {
      if (err) return next(err);
      res.render('articles', { articles });
    })
})

// article delete

router.get('/:id/delete', middleware.checkUserLogged, (req, res, next) => {

  Article.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) return next(err);
    res.redirect('/articles')
  })
})

// comment delete
router.get('/:articleId/:commentId/delete', middleware.checkUserLogged, (req, res, next) => {
  Comment.findByIdAndRemove(req.params.commentId, (err, data) => {
    if (err) return next(err);
    res.redirect('/articles/' + articleId);
  })
})

//edit

router.get('/:id/edit', middleware.checkUserLogged, (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('editArticle', { article })
  })
})

router.post('/:id/update', middleware.checkUserLogged, (req, res, next) => {
  Article.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
    if (err) return next(err);
    res.redirect('/articles')
  })
})


//comments
router.post('/:articleId/comments', middleware.checkUserLogged, (req, res) => {
  req.body.articleId = req.params.articleId

  req.body.author = req.loggedUser

  Comment.create(req.body, (err, Comment) => {
    Article.findByIdAndUpdate(req.params.articleId, { $push: { Comments: Comment.id } }, (err, article) => {
      if (err) return next(err)
      articleId = req.params.articleId;
      res.redirect('/articles/' + articleId);
    })
  })
    
      User.findByIdAndUpdate(req.loggedUser.id, { $push: { commentsId: Comment.id } }, (err, user) => {
        if (err) return next(err)
      })

      
    })


router.get('/:id', (req, res) => {
  Article
    .findById(req.params.id)
    .populate('author')
    .exec((err, article) => {
  Comment
    .find()
    .populate('author')
    .exec((err, Comments) => {
      if (err) return next(err)
      res.render('articleView', { Comments, article })
        })
    })
})


//likes
router.get('/:id/likes', middleware.checkUserLogged, (req, res, next) => {
  Article.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err)
    res.redirect('/articles/' + req.params.id)
  })
})


module.exports = router;
