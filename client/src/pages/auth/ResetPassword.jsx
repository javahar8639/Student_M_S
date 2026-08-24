import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/auth.js';
import { validateResetPasswordForm } from '../../lib/validation.js';
import AuthLayout from './AuthLayout.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import Button from '../../components/ui/Button.jsx';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      setServerError('This reset link is missing a token. Please request a new one.');
      return;
    }
    const validationErrors = validateResetPasswordForm(form);
    setErrors(validationErrors);
    setServerError('');
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ token, ...form });
      setIsSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setServerError(err.message || 'This reset link is invalid or has expired.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link" subtitle="This password reset link is missing or malformed.">
        <Link to="/forgot-password" className="text-sm font-medium text-accent hover:text-accent-dark">
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout title="Password reset" subtitle="">
        <p className="text-sm text-ink-soft">Your password has been updated. Redirecting you to login…</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used before.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <PasswordInput
          id="password"
          name="password"
          label="New Password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        {serverError && (
          <p role="alert" className="rounded-DEFAULT bg-danger-light px-3.5 py-2.5 text-sm text-danger">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
