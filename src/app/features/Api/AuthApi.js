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
  }),
});

export const {
  useUserRegisterMutation,
  useUserLoginMutation,
  useAdminRegisterMutation,
  useAdminLoginMutation,
} = authApi;