// server için gerekli olanları burada ayarlayın

// posts router'ını buraya require edin ve bağlayın

const express = require("express");

const server = express();

const postsRouter = require("./posts/posts-router");
server.use(express.json());

server.use("/api/posts", postsRouter);

module.exports = server;
