const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const dbURI = process.env.dbURI;
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
const UserRoutes = require('./routes/User.routes');
// ROUTES MIDDLEWARES
app.use('/api', UserRoutes);

/* MONGODB OPTIONS*/
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

// Mongodb Connections
mongoose.connect(dbURI, options).then((res) => {
  console.log('Nakaikabit ti', res.connections[0].name);
  app.listen(PORT, () => {
    console.log(`SERVER IS TUMARTARAY ON PORT ${PORT}`);
  });
});
