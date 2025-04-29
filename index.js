import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import authRouter from './routes/admin/auth.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Добавляем middleware для статических файлов
app.use(
   cookieSession({
      keys: ['lkasld235j'],
   })
);

app.use(authRouter);

app.listen(3000, () => {
   console.log('Сервер запущен на порту 3000');
});
