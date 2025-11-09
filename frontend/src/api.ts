const BASE = 'http://localhost:5000/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path: string, opts: RequestInit = {}) {
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string,string> || {})
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch(e) { data = text; }
  if (!res.ok) {
    const message = data?.message || data?.error || data || res.statusText;
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (payload: { name: string; email: string; password: string; role?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // tasks
  createTask: (payload: { title: string; description?: string; status?: string }) =>
    request('/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  getTasks: () => request('/tasks'),
  getTask: (id: string) => request(`/tasks/${id}`),
  updateTask: (id: string, payload: any) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTask: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' })
};

export function saveToken(token: string) {
  localStorage.setItem('token', token);
}
export function removeToken() { localStorage.removeItem('token'); }

export default api;
