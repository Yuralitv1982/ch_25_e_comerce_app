import express from 'express';

const app = express();

app.get('/', (req, res) => {
   res.send(`
      <div>
         <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sing Up</button>
         </form>
      </div>
      `);
});

app.post('/', (req, res) => {
   // get access to password email passwordConfirmation
   req.on('data', (data) => {
      const parsed = data.toString('utf8').split('&');
      console.log(parsed);
      const formData = {};

      for (let pair of parsed) {
         const [key, value] = pair.split('=');
         formData[key] = value;
      }
      console.log(formData);
   });
   res.send('Account create');
});

app.listen(3000, () => {
   console.log('listening');
});
