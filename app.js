//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const mailchimp = require('@mailchimp/mailchimp_marketing');
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
    apiKey: "5b75cc9172b0d8ca11e66c66ca037c0c-us21",
    server: "us21"
});

app.use(express.static("public"));

app.post("/", function (req, res) {

    const listId = "5d2d71c4f3";
    const subscribingUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });

            console.log(
                `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            );

            res.sendFile(__dirname + "/success.html");
        } catch (e) {
            res.sendFile(__dirname + "/failure.html");
        }
    }

    run();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})


app.listen(3000, function () {
    console.log("server startted on 3000")
});
