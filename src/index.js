import socket from 'socket.io-client';
import axios from 'axios';

console.log('it works!!');

const outputList = document.querySelector('.output');
const form = document.querySelector('.curr-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const currency = formData.get('currency');
  console.log('currency', currency);
  axios.post('/currency', { currency });
});

const updateCurrencyList = (currency, price) => {
  const li = document.querySelector(`.${currency}`);
  if (li) {
    const oldSpan = li.querySelector('span');
    oldSpan.innerHTML = `${currency}: ${price}` || '...';
  } else {
    const newLi = document.createElement('li');
    const span = document.createElement('span');
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-danger', 'm-2');
    button.innerHTML = 'Unfollow';
    newLi.classList.add(`${currency}`);
    span.innerHTML = `${currency}: ${price}` || '...';
    newLi.append(span);
    newLi.append(button);
    outputList.prepend(newLi);
  }
};

socket()
  .on('connect', () => console.warn('connected to websocket server'))
  .on('newData', ({ symbol, close }) => updateCurrencyList(symbol, close));
