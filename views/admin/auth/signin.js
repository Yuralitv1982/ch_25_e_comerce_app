export default function signinTemplate() {
   return `
        <div>
            <h1>Вход</h1>
            <form method="POST">
                <input name="email" placeholder="Email" type="email" required />
                <input name="password" placeholder="Пароль" type="password" required />
                <button>Войти</button>
            </form>
        </div>
    `;
}
