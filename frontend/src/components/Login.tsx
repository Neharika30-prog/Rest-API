import { useState } from 'react';
import { api, saveToken } from '../api';
import Alert from './Alert';

export default function Login({ onLogin }: { onLogin?: ()=>void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'success'|'error'|'info'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    try {
      const res = await api.login({ email, password });
      if (res?.token) {
        saveToken(res.token);
        setAlert({ type: 'success', text: 'Login successful' });
        setTimeout(() => { if (onLogin) onLogin(); }, 600);
      } else {
        setAlert({ type: 'error', text: 'Login did not return a token' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', text: err.message || 'Login failed' });
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {alert && <Alert type={alert.type} message={alert.text} onClose={() => setAlert(null)} />}
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
    </div>
  );
}
