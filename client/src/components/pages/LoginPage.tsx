import React from 'react';
import useAuth from '../hooks/useAuth';

type FormEvent = React.FormEvent<HTMLFormElement>;

export default function LoginPage(): JSX.Element {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await login(email, password);
  };

  return (
    <div>
      <h2>Login</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
