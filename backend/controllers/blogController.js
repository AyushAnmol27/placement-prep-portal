const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');

const getBlogs = asyncHandler(async (req, res) => {
  const { category, search, featured, page = 1, limit = 12 } = req.query;
  const filter = { published: true };
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { tags: { $regex: search, $options: 'i' } }];

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .populate('author', 'name avatar')
    .select('-content -comments')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / limit) });
});

const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { $or: [{ _id: req.params.id }, { slug: req.params.id }], published: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'name avatar').populate('comments.user', 'name avatar');
  if (!blog) { res.status(404); throw new Error('Blog not found'); }
  res.json(blog);
});

const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create({ ...req.body, author: req.user._id });
  res.status(201).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, author: req.user._id };
  const blog = await Blog.findOneAndUpdate(filter, req.body, { new: true });
  if (!blog) { res.status(404); throw new Error('Blog not found'); }
  res.json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, author: req.user._id };
  const blog = await Blog.findOneAndDelete(filter);
  if (!blog) { res.status(404); throw new Error('Blog not found'); }
  res.json({ message: 'Blog deleted' });
});

const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) { res.status(404); throw new Error('Blog not found'); }
  const liked = blog.likes.includes(req.user._id);
  if (liked) blog.likes.pull(req.user._id);
  else blog.likes.push(req.user._id);
  await blog.save();
  res.json({ likes: blog.likes.length, liked: !liked });
});

const addComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) { res.status(404); throw new Error('Blog not found'); }
  blog.comments.push({ user: req.user._id, name: req.user.name, text: req.body.text });
  await blog.save();
  res.status(201).json(blog.comments.slice(-1)[0]);
});

module.exports = { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, toggleLike, addComment };
