import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import usersRepo from './repositories/users.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Добавляем middleware для статических файлов
app.use(
   cookieSession({
      keys: ['lkasld235j'],
   })
);

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

app.get('/signup', (req, res) => {
   res.send(
      layout(`
        <div>
            <h1>Регистрация</h1>
            <div>Ваш ID сессии: ${req.session.userId || 'не определен'}</div>
            <form method="POST">
                <input name="email" placeholder="Email" type="email" required />
                <input name="password" placeholder="Пароль" type="password" required />
                <input name="passwordConfirmation" placeholder="Подтвердите пароль" type="password" required />
                <button>Зарегистрироваться</button>
            </form>
        </div>
    `)
   );
});

app.post('/signup', async (req, res) => {
   const { email, password, passwordConfirmation } = req.body;

   const existingUser = await usersRepo.getOneBy({ email });
   if (existingUser) {
      return res.send(
         layout(`<div class="error">Email уже используется</div>`)
      );
   }

   if (password !== passwordConfirmation) {
      return res.send(layout(`<div class="error">Пароли не совпадают</div>`));
   }

   const user = await usersRepo.create({ email, password });
   req.session.userId = user.id;

   res.send(layout(`<div>Аккаунт создан!</div>`));
});

app.get('/signout', (req, res) => {
   req.session = null;
   res.send(layout(`<div>Вы вышли из системы</div>`));
});

app.get('/signin', (req, res) => {
   res.send(
      layout(`
        <div>
            <h1>Вход</h1>
            <form method="POST">
                <input name="email" placeholder="Email" type="email" required />
                <input name="password" placeholder="Пароль" type="password" required />
                <button>Войти</button>
            </form>
        </div>
    `)
   );
});

app.post('/signin', async (req, res) => {
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

app.listen(3000, () => {
   console.log('Сервер запущен на порту 3000');
});
