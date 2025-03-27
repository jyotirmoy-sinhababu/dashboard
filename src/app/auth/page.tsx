'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import developer from '../../../public/developer.jpg';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const signupSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
});

type SignupFormValues = yup.InferType<typeof signupSchema>;

const AuthPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const form = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async () => {
    setSignupError('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      // Store token in localStorage
      localStorage.setItem('auth_token', token);

      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      setSignupError('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex  justify-center items-center sm:mx-[13%] sm:mt-[11%] mx-[5%] mt-[27%] gap-6 border-2 p-2 rounded-[4px] bg-[#e7dfdf]'>
        <div className='md:block hidden'>
          <Image
            className='w-3xl rounded-[4px]'
            loading='lazy'
            src={developer}
            alt='login image'
          />
        </div>
        <div className='p-5'>
          <div className='mb-3.5 font-abril'>
            <p className='font-serif text-4xl'>Login Form</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {signupError && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{signupError}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='you@example.com'
                        type='email'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='password'
                        type='password'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full font-serif bg-[#a09d9d] hover:bg-[#8f8e8e] hover:text-white cursor-pointer'
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              <Separator className='my-4' />

              <div className='text-center  font-serif text-[.9rem]'>
                A Next.js dashboard with form validation using Yup and
                react-hook-form.
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
