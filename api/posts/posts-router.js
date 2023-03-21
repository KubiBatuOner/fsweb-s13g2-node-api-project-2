// posts için gerekli routerları buraya yazın

const express = require("express");
const Post = require("./posts-model");

const router = express.Router();
router.use(express.json());

//1
router.get("/", (req, res) => {
  Post.find()
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});

//2
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

//3
router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  } else {
    try {
      let { id } = await Post.insert({ title, contents });
      let insertedPost = await Post.findById(id);
      res.status(201).json(insertedPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
});

//4
router.put("/:id", async (req, res) => {
  try {
    let existPost = await Post.findById(req.params.id);
    if (!existPost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      let { title, contents } = req.body;
      if (!title || !contents) {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      } else {
        let updatePostid = await Post.update(req.params.id, req.body);
        let updatedPost = await Post.findById(updatePostid);
        res.status(200).json(updatedPost);
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

//5
router.delete("/:id", async (req, res) => {
  try {
    let updatePost = await Post.findById(req.params.id);
    if (!updatePost) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      await Post.remove(req.params.id);
      res.status(200).json(updatePost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

//6
router.get("/:id/comments", async (req, res) => {
  try {
    let commentsPost = await Post.findById(req.params.id);
    if (!commentsPost) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Post.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
