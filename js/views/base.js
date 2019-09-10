export const elements = {
  guestFooter: document.querySelector('.guest'),
  userFooter: document.querySelector('.user'),
  joinForm: document.querySelector('.join'),
  username: document.querySelector('#username'),
  users: document.querySelector('.users-list ul'),
  rooms: document.querySelector('.rooms-list ul'),
  messages: document.querySelector('.chat-frame'),
  leaveBtn: document.querySelector('.btn-logout'),
  info: document.querySelector('.info'),
  infoName: document.querySelector('.your-name'),
  infoPhoto: document.querySelector('.your-photo')
};

export const getRandomColor = function() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const formatDate = function(date) {
  let a = new Date(date * 1000);
  let diff = new Date() - a; // difference in miliseconds

  if (diff < 1000) { // less than a minute
    return 'just now';
  }

  let sec = Math.floor(diff / 1000); // convert difference into a seconds

  if (sec < 60) {
    return sec + ' sec. ago';
  }

  let min = Math.floor(diff / 60000); // convert difference in minutes
  if (min < 60) {
    return min + ' min. ago';
  }

  // date formating
  // add zeroes for single numbers od days, months, hours, minutes
  let d = a;
  d = [
    '0' + d.getHours(),
    '0' + d.getMinutes(),
    // '0' + d.getDate(),
    // '0' + (d.getMonth() + 1),
    // '' + d.getFullYear(),
  ].map(component => component.slice(-2)); // take last two digits of every component

  // join components into a date
  return d.slice(0, 3).join(':') + ' ' + d.slice(3).join('.');
}
