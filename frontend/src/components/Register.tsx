import { useState } from 'react';
import { api } from '../api';
import Alert from './Alert';

export default function Register({ onRegistered }: { onRegistered?: (token?: string)=>void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'success'|'error'|'info'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    try {
      const res = await api.register({ name, email, password });
      setAlert({ type: 'success', text: 'Registration successful. You can now log in.' });
      if (onRegistered && res?.token) onRegistered(res.token);
    } catch (err: any) {
      setAlert({ type: 'error', text: err.message || 'Registration failed' });
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {alert && <Alert type={alert.type} message={alert.text} onClose={() => setAlert(null)} />}
      <form onSubmit={submit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
