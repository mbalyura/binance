import socket from 'socket.io-client';

console.log('it works!!');

const output = document.querySelector('.output');

socket()
  .on('connect', () => console.warn('connected to websocket server'))
  .on('newData', (data) => {
    output.innerHTML = JSON.stringify(data.BTCUSDT, null, 2) || '';
  });
