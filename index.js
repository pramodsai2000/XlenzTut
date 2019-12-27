const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();

const { User } = require("./database/users");

//connect to mongodb
mongoose
    .connect("mongodb://localhost/xlenzNode", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB..."));

app.use(express.json());

app.get('/', (req, res) => {
    res.send({ message: "Welcome to NodeJS and MongoDB" })
})

app.post('/register', async (req, res) => {
    //find an existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({
        message: "User already registered."
    });

    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save()
        .then(() => res.status(200).send({
            message: "Success"
        }))
        .catch(err => console.error("Registration Failed"));
})

//User Login
app.post("/login", async (req, res) => {

    let user = await User.findOne({ email: req.body.email });

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        //Email Verify and Phone Verification Code 
        res.status(200).send({
            message: "Success",
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else {
        res.status(401).send({
            message: "incorrect email or password"
        })
    }
});

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
