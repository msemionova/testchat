import { elements, getRandomColor, formatDate } from "./views/base.js"; //base elements
const messages = elements.messages;
const users = elements.users;
const rooms = elements.rooms;
let sessionId;

let prevDate;
let imageColor = getRandomColor();

//Render existing messages from DB to UI
const addMessage = (message, id) => {
  //sorting by date
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let mDate = new Date(message.date.seconds * 1000);

  //date separator
  let date = mDate.getDate();

  if (date !== prevDate) {
    let dateHtml = `
      <li class="date">
        <span class="line"></span>
        <p>${days[mDate.getDay()]}, ${months[mDate.getMonth()]} ${mDate.getDate()}</p>
        <span class="line"></span>
      </li>
    `;
    messages.innerHTML += dateHtml;
    prevDate = date;
  }

  let html = `
    <li data-id="${id}" class="message">
      <span class="square" style="background-color: ${message.imageColor}"></span>
      <div class="message__content">
          <div class="message__content-head">
              <p class="message__content-name">${message.byUsername}</p>
              <p class="message__content-time">${formatDate(message.date.seconds)}</p>
          </div>

          <p class="message__content-text">${message.text}</p>
      </div>
    </li>
  `;
  messages.innerHTML += html;
};
//Render existing users from DB to UI
const addUser = (user, id) => {
  let li = document.createElement("li");
  li.setAttribute('data-id', id);

  li.innerHTML = `<span class="dot online"></span>
                  <span class="square" style="background-color: ${user.imageColor}"></span>
                  <p>${user.username}</p>`
  elements.users.insertBefore(li, elements.users.firstChild);
};
//Render existing rooms from DB to UI
const addRoom = (room, id) => {
  let html = `
      <li data-id="${id}">
          <p>${room.roomname}</p>
      </li>
  `;
  rooms.innerHTML += html;
  rooms.firstElementChild.classList.add('active-room');
};

//Get all messages from Database
db.collection('messages').orderBy('date').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    addMessage(doc.data(), doc.id);
  })
}).catch(err => {
  console.log(err);
});

//Get all users from Database
db.collection('users').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    addUser(doc.data(), doc.id);
  })
}).catch(err => {
  console.log(err);
});

//Get all rooms from Database
db.collection('rooms').orderBy('order').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    addRoom(doc.data(), doc.id);
  })
}).catch(err => {
  console.log(err);
});


//JOIN THE CHAT

//1 - Check if name is correct and doesn't repeats someone else name

//2 - Add user to online list (Sort online users and offline separately)

//3 - Add current user name to database
elements.joinForm.addEventListener('submit', e => {
  e.preventDefault();

  const user = {
    username: elements.joinForm.username.value,
    imageColor: imageColor,
    isOnline: true
  };

  db.collection('users').add(user).then(() => {
    console.log('user added');
  }).catch(err => {
    console.log(err);
  });

  //4 - Change in UI "Join footer" to "Message footer"
  elements.guestFooter.style.display = 'none';
  elements.userFooter.style.display = 'flex';
  elements.info.style.display = 'flex';
  elements.messages.classList.remove('wide');

  //5 - Adding name to info sidebar
  elements.infoName.textContent = `${user.username}`;

  //6 - adding color
  elements.infoPhoto.style.backgroundColor = `${user.imageColor}`;

});

//6 - leave the chat
elements.leaveBtn.addEventListener('click', e => {
  e.preventDefault();

  //Change UI
  elements.guestFooter.style.display = 'flex';
  elements.userFooter.style.display = 'none';
  elements.info.style.display = 'none';
  elements.messages.classList.add('wide');

  //Remove user from database
  db.collection('users').doc(sessionId).delete();

});

window.addEventListener("close", e => {
  db.collection('users').doc(sessionId).delete();
});

//SEND NEW MESSAGE
const sendForm = document.querySelector('.send-message');
sendForm.addEventListener('submit', e => {
  e.preventDefault();

  const now = new Date();
  const message = {
    byUsername: elements.joinForm.username.value,
    imageColor: imageColor,
    date: firebase.firestore.Timestamp.fromDate(now),
    text: sendForm.inputMessage.value
  };

  sendForm.inputMessage.value = '';
  console.log(message);

  //Add new message to Database
  db.collection('messages').add(message).then(() => {
    console.log('message added');
  }).catch(err => {
    console.log(err);
  });
});

//CHANGE ROOM
elements.rooms.addEventListener('click', e => {
  elements.rooms.querySelector('.active-room').classList.remove('active-room')
  e.target.closest('li').classList.add('active-room');
});


