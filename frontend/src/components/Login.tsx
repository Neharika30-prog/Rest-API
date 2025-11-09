import React, { useState } from 'react';
import { api, saveToken } from '../api';

export default function Login({ onLogin }: { onLogin?: ()=>void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.login({ email, password });
      if (res?.token) {
        saveToken(res.token);
        setMessage('Login successful');
        if (onLogin) onLogin();
      } else {
        setMessage('Login did not return a token');
      }
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
