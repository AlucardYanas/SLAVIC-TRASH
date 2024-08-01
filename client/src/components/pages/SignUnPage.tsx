import React from 'react';
import useAuth from '../hooks/useAuth';

type FormEvent = React.FormEvent<HTMLFormElement>;

export default function SignInPage(): JSX.Element {
  const { signup, isLoading, error } = useAuth();

  const handleSignup = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await signup(name, email, password);
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
