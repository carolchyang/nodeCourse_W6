const validator = require("validator");
const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const Post = require("../models/post");

const posts = {
  // 取得所有貼文
  async getPosts(req, res, next) {
    // 排序
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const keyword =
      req.query.keyword !== undefined
        ? { content: new RegExp(req.query.keyword) }
        : {};

    const posts = await Post.find(keyword)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(sort);

    resSuccess(res, 200, posts);
  },
  // 取得單一貼文
  async getPostById(req, res, next) {
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "取得貼文失敗，查無此貼文 ID", next));
    }

    const post = await Post.findById(id).populate({
      path: "user",
      select: "name photo",
    });

    // 若取得失敗
    if (!post) {
      return next(appError(400, "取得貼文失敗，查無此貼文 ID", next));
    }
    resSuccess(res, 200, post);
  },
  // 新增貼文
  async createPost(req, res, next) {
    const { image, content } = req.body;
    const userId = req.user._id;

    // 若沒寫內容
    if (!content) {
      return next(appError(400, "新增失敗，貼文內容必須填寫", next));
    }

    const newPost = await Post.create({
      user: userId,
      image,
      content,
    });

    resSuccess(res, 200, newPost);
  },
  // 刪除單一貼文
  async deletePostById(req, res, next) {
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此貼文 ID", next));
    }

    const delPost = await Post.findByIdAndDelete(id, {
      new: true,
    });

    // 若取得失敗
    if (!delPost) {
      return next(appError(400, "刪除失敗，查無此貼文 ID", next));
    }

    // 回傳全部貼文
    const posts = await Post.find().populate({
      path: "user",
      select: "name photo",
    });

    resSuccess(res, 200, posts);
  },
};

module.exports = posts;
