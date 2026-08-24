import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth.js';
import { isValidEmail } from '../../lib/validation.js';
import AuthLayout from './AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { CheckCircleIcon } from '../../components/icons.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return setError('Email is required.');
    if (!isValidEmail(email)) return setError('Enter a valid email address.');

    setError('');
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(email.trim());
      setIsSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <AuthLayout title="Check your email" subtitle="">
        <div className="flex flex-col items-center py-2 text-center animate-fadeSlideUp">
          <CheckCircleIcon width={40} height={40} className="mb-3 text-success" />
          <p className="text-sm text-ink-soft">
            If an account exists for <span className="font-medium text-ink">{email}</span>, we&apos;ve sent a link to reset your
            password. The link will expire in 30 minutes.
          </p>
          <Link to="/login" className="mt-6 text-sm font-medium text-accent hover:text-accent-dark">
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          error={error}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link to="/login" className="font-medium text-accent hover:text-accent-dark">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
