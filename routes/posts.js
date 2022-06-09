var express = require("express");
var router = express.Router();
const PostControllers = require("../controllers/posts");
const handErrorAsync = require("../service/handErrorAsync");
const { isAuth } = require("../service/auth");

// 取得所有貼文
router.get("/posts", isAuth, handErrorAsync(PostControllers.getPosts));

// 取得單一貼文
router.get("/post/:id", isAuth, handErrorAsync(PostControllers.getPostById));

// 新增貼文
router.post("/post", isAuth, handErrorAsync(PostControllers.createPost));

// 刪除單一貼文
router.delete(
  "/post/:id",
  isAuth,
  handErrorAsync(PostControllers.deletePostById)
);

module.exports = router;
