import runServer from '..';

const port = 5000;
runServer().listen(port, () => {
  console.log(`Server has been started on port http://localhost:${port}`);
});
