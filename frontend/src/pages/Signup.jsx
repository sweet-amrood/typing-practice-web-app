import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
import { AuthError, AuthField, AuthInput, AuthSubmit } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signup(username, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageLayout
      title="Create your account"
      subtitle="Join free — your progress saves automatically."
      alternate={{
        prefix: 'Already have an account?',
        to: '/login',
        linkText: 'Sign in',
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthError message={error} />

        <AuthField id="username" label="Username" hint="3+ characters, shown on leaderboards">
          <AuthInput
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            minLength={3}
            autoComplete="username"
            placeholder="yourname"
          />
        </AuthField>

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

        <AuthField id="password" label="Password" hint="At least 6 characters">
          <AuthInput
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Create a password"
          />
        </AuthField>

        <AuthSubmit disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </AuthSubmit>
      </form>
    </AuthPageLayout>
  );
};

export default Signup;
