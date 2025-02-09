import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../shared/Loading';
import { authApi } from '../../services/api/auth';
import { FormInput } from '../shared/FormInput';
import toast from 'react-hot-toast';

const schema = yup.object({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

type FormData = yup.InferType<typeof schema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.resetPassword(token, data.password);
      toast.success('Password reset successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Password
          </h2>

          <FormProvider {...methods}>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                label="New password"
                name="password"
                type="password"
                error={errors.password?.message}
                required
              />

              <FormInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                error={errors.confirmPassword?.message}
                required
              />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                >
                  {isSubmitting ? <Loading size="sm" /> : 'Reset password'}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <Link
                    to="/auth/login"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
