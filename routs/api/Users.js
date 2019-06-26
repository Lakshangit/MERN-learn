const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Item model
const User = require('../../models/User');

// @rout GET api/items
// @desc get all items
// @access public
router.post('/register-user', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "already exist" });
            }
                const newUser =new User({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email,
                    city: req.body.city
                });

                // password hashing
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
        }); 
});

router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find user from email
    User.findOne({ email }).then(user => { 
        if (!user) {
            return res.status(400).json({ emailnotfound: "email not found" });
        }
            // check password
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    // create jwt payload
                    const payload = {
                        id: user.id,
                        name: user.name
                    };
 
                    //sign token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                            expiresIn: 31556926 
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer" + token
                            });
                        }
                    ); 
                } else {
                    return res.status(400)
                              .json({ passwordincorrect: "password incorrect" });
                }
            });
    });
});

module.exports = router;