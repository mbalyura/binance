import socket from 'socket.io-client';
import axios from 'axios';

console.log('it works!!');

const outputList = document.querySelector('.output');
const form = document.querySelector('.curr-form');

const followHandle = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const currency = formData.get('currency');
  axios.post('/currency', { currency });
};

const unfollowHandle = (currency) => () => {
  const liToUnfollow = document.querySelector(`.${currency}`);
  liToUnfollow.parentNode.removeChild(liToUnfollow);
  axios.delete('/currency', { data: { currency } });
};

form.addEventListener('submit', followHandle);

const updateCurrencyList = (currency, price) => {
  const li = document.querySelector(`.${currency}`);
  if (li) {
    const oldSpan = li.querySelector('span');
    oldSpan.innerHTML = `${currency}: ${price}` || '...';
  } else {
    const newLi = document.createElement('li');
    newLi.classList.add(`${currency}`);

    const span = document.createElement('span');
    span.innerHTML = `${currency}: ${price}` || '...';

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-danger', 'm-2');
    button.innerHTML = 'Unfollow';
    button.addEventListener('click', unfollowHandle(currency));

    newLi.append(span);
    newLi.append(button);
    outputList.prepend(newLi);
  }
};

socket()
  .on('connect', () => console.warn('connected to websocket server'))
  .on('newData', ({ symbol, close }) => updateCurrencyList(symbol, Number(close)));
