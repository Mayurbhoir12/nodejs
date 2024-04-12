
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;


let users = [];

app.use(bodyParser.json());


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.get('/api/users', (req, res) => {
  res.json(users);
});


app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = users.find(u => u.id === userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.json(user);
  }
});


app.post('/api/users', (req, res) => {
  const { username, age, hobbies } = req.body;
  if (!username || !age) {
    return res.status(400).json({ error: 'Username and age are required' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    age,
    hobbies: hobbies || []
  };

  users.push(newUser);
  res.status(201).json(newUser);
});


app.put('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const { username, age, hobbies } = req.body;
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    username: username || users[userIndex].username,
    age: age || users[userIndex].age,
    hobbies: hobbies || users[userIndex].hobbies
  };

  res.json(users[userIndex]);
});


app.delete('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1);
  res.json(deletedUser[0]);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
