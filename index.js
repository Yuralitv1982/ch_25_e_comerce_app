import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import usersRepo from './repositories/users.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
   cookieSession({
      keys: ['sjd;lfakjsdlifjaosid'],
   })
);

app.get('/', (req, res) => {
   res.send(`
    <div>
    Your id is: ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post('/', async (req, res) => {
   const { email, password, passwordConfirmation } = req.body;

   const existingUser = await usersRepo.getOneBy({ email });
   if (existingUser) {
      return res.send('Email in use');
   }

   if (password !== passwordConfirmation) {
      return res.send('Passwords must match');
   }

   // create a user in our user repo to represent this person
   const user = await usersRepo.create({ email, password });

   // store the id of that user inside the users cookie
   req.session.userId = user.id; // added by cookie session

   res.send('Account created!!!');
});

app.listen(3000, () => {
   console.log('Listening');
});
