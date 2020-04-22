const bcrypt = require('bcryptjs');

const router = require("express").Router();
const Users = require("../users/users-model.js");


router.post("/register", (req, res) => {
  
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 8)

    user.password = hash;

    Users.add(user)
    .then(user => {
        res.status(201).json({saved});
    })
    .catch(err => res.status(500).json({ message: 'server error', err}));
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.findById({ username })
    .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = username;
            res.status(200).json({ message: 'welcome !!'})
        }
        else {
            res.status(401).json({ message: 'invalid credentials' })
        }
    })
    .catch(err => res,status(500).json({ message: 'Server error' }))
});

router.get('/logout', (req, res,) => {
    req.session.destroy((err) => {
        if (err) {
            res.send('Unable to logout')
        }
        else {
            res.send('Logged out')
        }
    })
});

module.exports = router;
