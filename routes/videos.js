const fs = require("fs");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

function readVideos() {
    const videosData = fs.readFileSync("./data/videos.json");
    const parsedData = JSON.parse(videosData);
    return parsedData;
}

function generateRandomNumber() {
    const numberOfDigits = Math.floor(Math.random() * 2) + 2;
    const min = Math.pow(10, numberOfDigits - 1);
    const max = Math.pow(10, numberOfDigits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.get("/", (req, res) => {
    let videos = readVideos();
    videos = videos.map((video) => ({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image
    }))
    res.json(videos);
});

router.get("/:videoId", (req, res) => {
    const videos = readVideos();
    const requestedId = req.params.videoId;
    const singleVideo = videos.find((video) => video.id === requestedId);
    res.json(singleVideo);
});

router.post("/", (req, res) => {
    if (!req.body.title) {
        res.status(400).send("There must be a title");
        return;
    }
    if (req.body.title.length < 3) {
        res.status(400).send("Title must be greater than 3 characters");
        return;
    }
    if (!req.body.description) {
        res.status(400).send("There must be a description");
        return;
    }
    if (req.body.description.length < 3) {
        res.status(400).send("Description must be greater than 3 characters");
        return;
    }
    const posterImage = req.body.posterImage;
    const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        channel: "Sharon Jacob",
        image: posterImage,
        views: `${generateRandomNumber()}`,
        likes: `${generateRandomNumber()}`,
        duration: `${generateRandomNumber()}:${generateRandomNumber()}`,
        video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
        timestamp: Date.now(),
        comments: [
            {
                id: uuidv4(),
                name: "Noah Duncan",
                comment: "Your insights into the future of AI are enlightening! The intersection of technology and ethics is particularly thought-provoking. Keep us updated on the tech front!",
                likes: generateRandomNumber(),
                timestamp: Date.now()
            }
        ]
    };
    const videos = readVideos();
    videos.push(newVideo);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.status(201).json(newVideo);
});

router.put("/:videoId/likes", (req, res) => {
    let videos = readVideos();
    const requestedId = req.params.videoId;
    const vidIndex = videos.findIndex((video) => video.id === requestedId);
    const obj = { ...videos[vidIndex] };
    const newObj = {
        ...obj,
        likes: `${Number(obj.likes) + 1}`
    }
    videos[vidIndex] = { ...newObj }
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.status(201).json(newObj);
});

router.post("/:videoId/comments", (req, res) => {
    if (!req.body.name) {
        res.status(400).send("There must be a name");
        return;
    }
    if (!req.body.comment) {
        res.status(400).send("There must be a comment");
        return;
    }
    const newComment = {
        id: uuidv4(),
        timestamp: Date.now(),
        name: req.body.name,
        comment: req.body.comment,
    };
    const videos = readVideos();
    const requestedId = req.params.videoId;
    const vidIndex = videos.findIndex((video) => video.id === requestedId);
    const obj = { ...videos[vidIndex] };
    const comments = obj.comments;
    comments.push(newComment);
    const newObj = {
        ...obj,
        comments: comments
    }
    videos[vidIndex] = { ...newObj }
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.status(201).json(newComment);
});

router.delete("/:videoId/comments/:commentId", (req, res) => {
    const videos = readVideos();
    const requestedId = req.params.videoId;
    const commentId = req.params.commentId;
    const vidIndex = videos.findIndex((video) => video.id === requestedId);
    const obj = { ...videos[vidIndex] };
    const comments = obj.comments;
    const deletedComment = comments.filter((com) => com.id === commentId);
    const newComments = comments.filter((com) => com.id !== commentId);
    const newObj = {
        ...obj,
        comments: newComments
    }
    videos[vidIndex] = { ...newObj }
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.status(201).json(deletedComment);
});

module.exports = router;

