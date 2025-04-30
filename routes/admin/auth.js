import express from 'express';
import { check, validationResult } from 'express-validator';
import usersRepo from '../../repositories/users.js';
import signupTemplate from '../../views/admin/auth/signup.js';
import signinTemplate from '../../views/admin/auth/signin.js';
const router = express.Router();

const layout = (content) => {
   return `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Аутентификация</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            ${content}
        </body>
        </html>
    `;
};

router.get('/signup', (req, res) => {
   res.send(signupTemplate({ req }));
});

router.post(
   '/signup',
   [
      check('email')
         .trim()
         .normalizeEmail()
         .isEmail()
         .withMessage('Must be a valid email')
         .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
               throw new Error('Email in use');
            }
         }),
      check('password').trim().isLength({ min: 4, max: 8 }),
      check('passwordConfirmation')
         .trim()
         .isLength({ min: 4, max: 8 })
         .withMessage('Must be between 4 and 8 characters')
         .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
               throw new Error('Password must match');
            }
         }),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      console.log(errors);
      const { email, password, passwordConfirmation } = req.body;
      const user = await usersRepo.create({ email, password });
      req.session.userId = user.id;

      res.send(layout(`<div>Аккаунт создан!</div>`));
   }
);

router.get('/signout', (req, res) => {
   req.session = null;
   res.send(layout(`<div>Вы вышли из системы</div>`));
});

router.get('/signin', (req, res) => {
   res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
   const { email, password } = req.body;

   const user = await usersRepo.getOneBy({ email });

   if (!user) {
      return res.send(layout(`<div class="error">Email не найден</div>`));
   }

   const validPassword = await usersRepo.comparePasswords(
      user.password,
      password
   );

   if (!validPassword) {
      return res.send(layout(`<div class="error">Неверный пароль</div>`));
   }

   req.session.userId = user.id;
   res.send(layout(`<div>Вы успешно вошли в систему!</div>`));
});

export default router;
