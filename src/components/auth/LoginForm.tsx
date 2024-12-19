import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FormInput } from '../shared/FormInput';
import { ValidationMessage } from '../shared/ValidationMessage';
import { OAuthButtons } from './OAuthButtons';
import { authApi } from '../../services/api/authApi';
import type { ApiError } from '../../types/common';
import { AuthService } from '../../services/authService';
import { useSettings } from '../../contexts/SettingsProvider';
import Loading from '../shared/Loading';
import { TeamService } from '../../services/teamService';

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
}).required();

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const methods = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, formState: { errors } } = methods;

  const { settings, loading } = useSettings();

  const onSubmitHandler = handleSubmit((data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    authApi.login(data)
      .then((response) => {
        TeamService.getInstance().removeCurrentTeam();
        AuthService.getInstance().setTokens(response.access, response.refresh);
        navigate('/dashboard');
      })
      .catch((err: ApiError) => {
        // Handle API error response
        if (err.errors) {
          // Set field-specific errors
          Object.entries(err.errors).forEach(([field, messages]) => {
            if (field !== 'non_field_errors') {
              methods.setError(field as keyof LoginFormData, {
                type: 'manual',
                message: Array.isArray(messages) ? messages[0] : messages,
              });
            }
          });

          // Set general error message if present
          if (err.errors.non_field_errors) {
            setError(err.errors.non_field_errors[0]);
          }
        } else if (err.message) {
          // Set general error message
          setError(err.message);
        } else {
          // Fallback error message
          setError('An error occurred during login. Please try again.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  });

  if (!settings) {
    return (
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ?
            (<div className="flex items-center justify-center">
              <Loading />
            </div>)
            : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                There is a problem with load settings. Please try again later.
              </p>
            )}
        </div>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {settings?.is_login_active &&
            <form onSubmit={onSubmitHandler} className="space-y-6">
              {error && <ValidationMessage message={error} type="error" />}

              <FormInput
                label="Email address"
                name="email"
                type="email"
                error={errors.email?.message}
                required
              />

              <div className="space-y-1">
                <FormInput
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  error={errors.password?.message}
                  required
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-3 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
                      )}
                    </button>
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
                {settings.is_signup_active &&
                  (<div className="text-sm">
                    <Link
                      to="/register"
                      className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Create an account
                    </Link>
                  </div>)
                }
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          }
          {(settings.is_github_login_active || settings.is_google_login_active) &&
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    continue with
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <OAuthButtons />
              </div>
            </div>
          }
        </div>
      </div>
    </FormProvider>
  );
};
