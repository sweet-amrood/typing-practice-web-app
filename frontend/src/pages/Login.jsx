import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
import { AuthError, AuthField, AuthInput, AuthSubmit } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue your streak and stats."
      alternate={{
        prefix: "Don't have an account?",
        to: '/signup',
        linkText: 'Create one free',
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthError message={error} />

        <AuthField id="email" label="Email">
          <AuthInput
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </AuthField>

        <AuthField id="password" label="Password">
          <AuthInput
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            placeholder="Your password"
          />
        </AuthField>

        <AuthSubmit disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </AuthSubmit>
      </form>
    </AuthPageLayout>
  );
};

export default Login;
