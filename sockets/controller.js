const { checkJWT } = require("../helpers");
const { Chat } = require("../models");

const chat = new Chat();

const socketController = async(socket,io) =>{
  const user = await checkJWT(socket.handshake.headers['x-token']);
  if (!user) {
    return socket.disconnect();
  }

  chat.connectUser(user);
  io.emit('users-listener', chat.usersArr);
  socket.emit('public-messages-listener', chat.last10);

  //private
  socket.join(user.id);

  socket.on('disconnect', () => {
    chat.disconnectUser(user.id);
    io.emit('users-listener', chat.usersArr);
  });
  socket.on('send-message', ({uid,message}) => {
    if (uid) {
      //private send-message
      socket.to(uid).emit('private-messages-listener', {from:user.name, message});
    }else{
      chat.sendMessage(user.id,user.name, message);
      io.emit('public-messages-listener', chat.last10);  
    }

  });
}
module.exports = {
  socketController
}
