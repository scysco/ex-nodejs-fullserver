const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');

let user = null;
let socket = null;

const validateJWT = async() => {
  const token = localStorage.getItem('token') || '';
  if (token.length <= 10) {
    window.location = 'index.html';
    throw new Error('no server token');
  }
  const resp = await fetch('http://localhost:8080/api/auth',{
    headers:{'x-token':token}
  });
  const {user:userDB,token: tokenDB} = await resp.json();
  localStorage.setItem('token', tokenDB);
  user = userDB;
  document.title = user.name;
  await connectSocket();
}
const connectSocket = async() =>{
  socket = io({
    'extraHeaders':{
      'x-token': localStorage.getItem('token')
    }
  });
  socket.on('connect', () => {
    console.log('Sockets Online')
  });
  socket.on('diconnect', () => {
    console.log('Sockets Offline')
  });
  socket.on('public-messages-listener', showMessages);

  socket.on('users-listener', showUsers );
  socket.on('private-messages-listener', (payload) => {
    console.log('private', payload);
  });

}

const showUsers = (users = []) => {
  let usershtml = '';
  users.forEach(({name,uid}) => {
    usershtml += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span clss="fs-6, text-muted">${uid}</span>
        </p>
      </li>
    `;
  });
  ulUsers.innerHTML= usershtml;
}

txtMessage.addEventListener('keyup', ({keyCode}) =>{
  if (keyCode !== 13) {return;}
  const message = txtMessage.value;
  const uid = txtUid.value;
  if (message.length === 0) {return;}
  socket.emit('send-message',{message,uid});
  txtMessage.value = '';
});

const showMessages = (messages = []) => {
  let messageshtml = '';
  messages.forEach(({message, name}) => {
    messageshtml += `
      <li>
        <p>
          <span class="text-primary">${name}</span>
          <span>${message}</span>
        </p>
      </li>
    `;
  });
  ulMessages.innerHTML= messageshtml;
}

const main = async() =>{
  await validateJWT();
}

main();
//
// const socket = io();

