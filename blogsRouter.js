const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');

// we're going to add blogs to BlogPosts
// so there's some data to look at
BlogPosts.create(
  'First Post', 'Hello World!', 'Bloggie Blogoyovich');
BlogPosts.create(
  'Second Post', 'Hello Again, World!', 'Bloggie Blogoyovich');

// send back JSON representation of all blogs
// on GET requests to root
router.get('/', (req, res) => {
  // res.json('blah');
  res.json(BlogPosts.get());
});


// when new blog added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

// Delete blogs (by id)!
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog entry \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated blog, ensure has
// required fields. also ensure that blog id in url path, and
// blog id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `Blogs.updateItem` with updated recipe.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog entry \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).json(updatedItem);
})

module.exports = router;