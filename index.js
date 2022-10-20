const client = require("./connection.js");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const port = 3300;

const { celebrate, Joi, errors, Segments } = require("celebrate");

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log("Sever is now listening at port " + port);
});
client.connect();

app.get("/users", (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});

app.get("/users/:id", (req, res) => {
  client.query(
    `Select * from users where id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.post("/rregister", async (req, res) => {
  const user = req.body;
  console.log(req.body);

  // Validate user input
  if (!user.email || !user.lastname || !user.password)
    res.send({ status: 400, message: "Please fill all fields" });

  let insertQuery = `insert into users(email,lastname,firstname,phonenumber,password)
    values('${user.email}', '${user.lastname}', '${user.firstname}', '${user.phonenumber}', '${user.password}')`;
  client.query(insertQuery, (err) => {
    if (!err) {
      res.send({ status: 200, message: "Insert was successful" });
    }
  });
  const { email, lastname, firstname, phonenumber, password } = req.body;
  try {
    const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [
      email,
    ]); //Checking if user already exists
    const arr = data.rows;
    if (arr.length != 0) {
      return res.status(400).json({
        error: "Email already exists.",
      });
    }

    // Create token
    const accessToken = jwt.sign(user, proccess.env.ACCESS_SECRET_TOKEN);
    res.json({ accessToken: accessToken });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "Database error while registring user!", //Database connection error
    });
  }

  // editing a user
  app.put("/users/:id", (req, res) => {
    let user = req.body;
    let updateQuery = `update users
                      set lastname = '${user.lastname}',
                       firstname = '${user.firstname}',
                       phonenumber = '${user.phonenumber}',
                       password = '${user.password}',
                       email = '${user.email}'
                       where id = ${req.params.id}`;

    client.query(updateQuery, (err, result) => {
      if (!err) {
        res.send({ status: 200, message: "successfully updated" });
      } else {
        console.log(err.message);
        res.send({ status: 400 });
      }
    });
    client.end;
  });

  //deleting a user
  app.delete("/users/:id", (req, res) => {
    let insertQuery = `delete from users where id=${req.params.id}`;
    client.query(insertQuery, (err) => {
      if (!err) {
        res.send({ status: 200, message: "successful delete" });
      }
    });
    client.end;
  });
});
//
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [
      email,
    ]); //Verifying if the user exists in the database
    const user = data.rows;
    if (user.length === 0) {
      res.status(400).json({
        error: "User is not registered, Sign Up first",
      });
    } else {
      bcrypt.compare(password, user[0].password, (err, result) => {
        //Comparing the hashed password
        if (err) {
          res.status(500).json({
            error: "Server error",
          });
        } else if (result === true) {
          //Checking if credentials match
          const token = jwt.sign(
            {
              email: email,
            },
            process.env.SECRET_KEY
          );
          res.status(200).json({
            message: "User signed in!",
            token: token,
          });
        } else {
          //Declaring the errors
          if (result != true)
            res.status(400).json({
              error: "Enter correct password!",
            });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error occurred while signing in!", //Database connection error
    });
  }
});
