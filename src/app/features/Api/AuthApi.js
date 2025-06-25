import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api` }),
  endpoints: (builder) => ({
    // User
    userRegister: builder.mutation({
      query: (body) => ({
        url: '/users/signup',
        method: 'POST',
        body,
      }),
    }),
    userLogin: builder.mutation({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
    }),
    userForgotPassword: builder.mutation({
      query: (body) => ({
        url: '/users/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    userResetPassword: builder.mutation({
      query: (body) => ({
        url: '/users/reset-password',
        method: 'POST',
        body,
      }),
    }),
    // Admin
    adminRegister: builder.mutation({
      query: (body) => ({
        url: '/admin/signup',
        method: 'POST',
        body,
      }),
    }),
    adminLogin: builder.mutation({
      query: (body) => ({
        url: '/admin/login',
        method: 'POST',
        body,
      }),
    }),
    adminForgotPassword: builder.mutation({
      query: (body) => ({
        url: '/admin/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    adminResetPassword: builder.mutation({
      query: (body) => ({
        url: '/admin/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// export them
export const {
  useUserRegisterMutation,
  useUserLoginMutation,
  useAdminRegisterMutation,
  useAdminLoginMutation,
  useUserForgotPasswordMutation,
  useUserResetPasswordMutation,
  useAdminForgotPasswordMutation,
  useAdminResetPasswordMutation,
} = authApi;