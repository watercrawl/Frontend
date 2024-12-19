import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { profileApi } from '../../services/api/profileApi';
import toast from 'react-hot-toast';
import { FormInput } from '../shared/FormInput';
import Loading from '../shared/Loading';

const schema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email address')
});

type FormData = yup.InferType<typeof schema>;

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await profileApi.getProfile();
        reset({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email
        });
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      await profileApi.updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Personal Information</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Update your personal information and email address.
        </p>
      </div>

      <div className="mt-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <FormInput
                  label="First name"
                  name="first_name"
                  type="text"
                  error={errors.first_name?.message}
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <FormInput
                  label="Last name"
                  name="last_name"
                  type="text"
                  error={errors.last_name?.message}
                  required
                />
              </div>

              <div className="col-span-6">
                <FormInput
                  label="Email address"
                  name="email"
                  type="text"
                  error={errors.email?.message}
                  disabled
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Email address cannot be changed.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving || isSubmitting}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSaving ? <Loading size="sm" /> : 'Save'}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
