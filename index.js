const express = require('express');

const app = express();
const mongoose = require('mongoose');

const Article = require('./models/Article');

mongoose.connect('mongodb+srv://marwantamermo_db_user:maro123@cluster0.g42thm1.mongodb.net/?appName=Cluster0').then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB :", err);
});

app.use(express.json());

app.get("/hello", (req, res) => {
    res.send("Hello, World!");
});

app.get("/hi", (req, res) => {
    res.send("Lol?");
});

app.get("/numbers", (req, res) => {
    let numbers = "";
    for (let i = 1; i <= 10; i++) {
        numbers += i + " ";
    }
    res.render("numbers.ejs", {
        name: "John Doe",
        age: 30,
        numbers : numbers
    });
});

app.post("/addComment", (req, res) => {
    res.send("Post Request Comment added!");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get("/findSummation/:number1/:number2", (req, res) => {
    console.log(req.params);

    const num1 = req.params.number1;
    const num2 = req.params.number2;

    const total = Number(num1) + Number(num2);
    res.send(`The summation is: ${total}`);

});

app.get("/sayHello", (req, res) => {
    // console.log(req.body);

    // console.log(req.query);
    // res.send(`Hello: ${req.body.name}`);

    res.json({
        name: req.body.name,
        age: req.query.age,
        language: "English"
    });
});

// ========== Articles Endpoints ==========

app.post("/articles", async (req, res) => {

    const newArticle = new Article(); 

    const artTitle = req.body.articleTitle;
    const artBody = req.body.articleBody;
    const artLikes = req.body.numberofLikes;

    newArticle.title = artTitle;
    newArticle.body = artBody;
    newArticle.numberofLikes = 0;
    newArticle.save();

    res.json(newArticle);
});   

app.get("/articles", async (req, res) => {

    const articles = await Article.find();
    console.log("The articles are: ", articles);
    res.json(articles);
});

app.get("/articles/:articleID", async (req, res) => {

    const id = req.params.articleID;
    try {
        const articles = await Article.findById(id);
        res.json(articles);

        console.log("The articles are: ", articles);
        return;
    } catch (error)
    {
        console.log("Error finding article by ID:", error);
        return res.send("Error finding article by ID");
    }
    
});

app.delete("/articles/:articleID", async (req, res) => {

    const id = req.params.articleID;
    try {
        const articles = await Article.findByIdAndDelete(id);
        res.json(articles);

        console.log("The articles deleted are: ", articles);
        return;
    } catch (error)
    {
        console.log("Error finding article by ID:", error);
        return res.send("Error finding article by ID");
    }
    
});

app.get("/showArticles", async (req, res) => {
    const articles = await Article.find();

    res.render("articles.ejs", {
        allArticles: articles
    }
    );
});