import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api/authApi';
import { AuthService } from '../../services/authService';
import { TeamService } from '../../services/teamService';
import Loading from '../../components/shared/Loading';

export function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        TeamService.getInstance().removeCurrentTeam();
        AuthService.getInstance().setTokens(response.access, response.refresh);
        setIsVerifying(false);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to verify email address');
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white dark:bg-gray-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
        {error ? (
          <>
            <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Verification Failed
            </h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              Unfortunately, we couldn't verify your email address. {error}
            </p>
            <div className="flex items-center justify-center">
              <Link
                to="/"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Back to login
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Email Verified!
            </h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              Your email address has been successfully verified.
            </p>
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
