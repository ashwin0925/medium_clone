var express = require('express');
var router = express.Router();
var User = require('../models/user');


router.get('/', (req, res) => {
  res.send('userpage')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  User.create(req.body, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/register')
    }
    res.redirect('/users/login')
  })
});

router.get('/login', (req, res) => {
  var msg = req.flash('info')[0];
  res.render('login', { msg });
});

router.post('/login', (req, res) => {
  var { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return res.redirect('/users/login');
    if (!user) return res.redirect('/users/login');
    if (!user.verifyPassword(password)) return res.redirect('/user/login');
    req.session.userId = user.id;
    res.redirect('/')
  })
})

//logout

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});


module.exports = router;


