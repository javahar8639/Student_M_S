import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { validateLoginForm } from '../../lib/validation.js';
import AuthLayout from './AuthLayout.jsx';
import DemoAccountPanel from './DemoAccountPanel.jsx';
import Input from '../../components/ui/Input.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import Button from '../../components/ui/Button.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);
    setServerError('');
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login({ ...form, rememberMe });
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your learning journey.">
      <div className="mb-6">
        <DemoAccountPanel onUseDemo={(email, password) => setForm({ email, password })} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-accent hover:text-accent-dark">
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <p role="alert" className="rounded-DEFAULT bg-danger-light px-3.5 py-2.5 text-sm text-danger">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-accent hover:text-accent-dark">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
