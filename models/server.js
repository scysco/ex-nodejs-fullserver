const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const {socketController} = require('../sockets/controller');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {
      users: '/api/users',
      auth:  '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
    }

    this.connectDB();

    this.middlewares();

    this.routes();

    //sockets
    this.sockets();
  }

  async connectDB(){
    await dbConnection();
  }

  middlewares(){
    //cors
    this.app.use(cors());
    //parse & lecture body
    this.app.use(express.json());
    //public directory
    this.app.use(express.static('public'));
    //fileupload
    this.app.use(fileUpload({
      useTempFiles : true,
      createParentPath : true,
      tempFileDir : '/tmp/'
    }));

  }

  routes(){
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.users, require('../routes/users'));
    this.app.use(this.paths.categories, require('../routes/categories'));
    this.app.use(this.paths.products, require('../routes/products'));
    this.app.use(this.paths.search, require('../routes/search'));
    this.app.use(this.paths.uploads, require('../routes/uploads'));
  }

  sockets(){
    this.io.on('connection', (socket) => socketController(socket,this.io));
  }


  listen(){
    this.server.listen(this.port, () => {
      console.log('Server running on port', this.port);
    });
  }
}

module.exports = Server;
