const express = require('express'); 
const app = express(); 
const mysql = require('mysql'); 
const fs = require('fs');
const path = require('path');

// Connect sa database
const db = mysql.createConnection({ 
  host: 'localhost', 
  user: 'root', 
  password: '', 
  database: 'users' 
}); 

db.connect((err) => { 
  if (err) { 
    console.error('error connecting:', err); 
    return; 
  } 
  console.log('connected as id ' + db.threadId); 
}); 

// Load commands
const commands = {};

fs.readdirSync(path.join(__dirname, 'commands')).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(__dirname, 'commands', file));
    commands[command.name] = command;
  }
});

// Middleware
app.use(express.json()); 

// Sign up logic
app.post('/sign-up', (req, res) => { 
  const username = req.body.username; 
  const password = req.body.password; 
  let role = 1; 
  if (username === 'Danieldev' && password === 'danielot') { 
    role = 2; 
  } 
  const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`; 
  db.query(query, [username, password, role], (err, results) => { 
    if (err) { 
      console.error('error:', err); 
      res.status(500).send({ message: 'Error signing up' }); 
    } else { 
      res.send({ message: 'Signed up successfully' }); 
    } 
  }); 
}); 

// Sign in logic
app.post('/sign-in', (req, res) => { 
  const username = req.body.username; 
  const password = req.body.password; 
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`; 
  db.query(query, [username, password], (err, results) => { 
    if (err) { 
      console.error('error:', err); 
      res.status(500).send({ message: 'Error signing in' }); 
    } else if (results.length > 0) { 
      res.send({ message: 'Signed in successfully' }); 
    } else { 
      res.status(401).send({ message: 'Invalid credentials' }); 
    } 
  }); 
}); 

// Chatbot logic
app.post('/chat', (req, res) => {
  const message = req.body.message;
  const commandName = message.split(' ')[0].replace('!', '');
  if (commands[commandName]) {
    commands[commandName].execute(req, res);
  } else {
    res.json({ response: 'Unknown command' });
  }
});

// Start server
const port = 3000; 
app.listen(port, () => { 
  console.log(`Server started on port ${port}`); 
});