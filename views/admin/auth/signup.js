export default function signupTemplate({ req }) {
   return `<div>
                <h1>Регистрация</h1>
                <div>Ваш ID сессии: ${
                   req.session.userId || 'не определен'
                }</div>
                <form method="POST">
                    <input name="email" placeholder="Email" type="email" required />
                    <input name="password" placeholder="Пароль" type="password" required />
                    <input name="passwordConfirmation" placeholder="Подтвердите пароль" type="password" required />
                    <button>Зарегистрироваться</button>
                </form>
            </div>`;
}
