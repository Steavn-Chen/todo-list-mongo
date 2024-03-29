const express = require('express')
const router = express.Router()

const Todo = require('../../models/todo')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const data = String(req.body.name).split(',').map(i => ({ name: i, userId }))
  return Todo.insertMany(data)
    .then(() => res.redirect('/'))
    .catch((error) => console.error(error))
})

router.get('/:todo_id', (req, res) => {
  const _id = req.params.todo_id
  const userId = req.user._id
  return Todo.findOne({ _id, userId })
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch((error) => console.error(error))
})

router.get('/:todo_id/edit', (req, res) => {
  const _id = req.params.todo_id
  const userId = req.user._id
  return Todo.findOne({ _id, userId })
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch((error) => console.error(error))
})

router.put('/:todo_id', (req, res) => {
  const id = req.params.todo_id
  const userId = req.user._id
  const { name, isDone } = req.body
  return Todo.updateOne(
    { _id: id, userId },
    { $set: { name, isDone: isDone === 'on' } }
  )
    .then(() => res.redirect(`/todos/${id}/edit`))
    .catch((err) => console.log(err))
})

router.delete('/:todo_id', (req, res) => {
  const _id = req.params.todo_id
  const userId = req.user._id
  return Todo.findOne({ _id, userId })
    .then((todo) => {
      todo.remove()
    })
    .then(() => res.redirect('/'))
    .catch((err) => console.error(err))
})

module.exports = router
