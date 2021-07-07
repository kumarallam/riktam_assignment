const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Op = db.Sequelize.Op;
const Role = db.role;


exports.allAccess = (req, res) => {
  User.find({
  }).then(users => {
    if (!users) {
      return res.status(404).send({ message: "Users Not found." });
    }
    let response = { data: users };
    res.status(200).send(response);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
  };

  exports.signup = (req, res) => {
    // Save User to Database
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    })
      .then(user => {
        if (req.body.roles) {
          Role.findAll({
            where: {
              name: {
                [Op.or]: req.body.roles
              }
            }
          }).then(roles => {
            user.setRoles(roles).then(() => {
              res.send({ message: "User was registered successfully!" });
            });
          });
        } else {
          // user role = 1
          user.setRoles([1]).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };


  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };