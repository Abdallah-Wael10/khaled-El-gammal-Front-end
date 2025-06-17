// features/api/galleryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const businessApi = createApi({
  reducerPath: 'businessApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/business`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // فقط العمليات المحمية تحتاج توكن
      if (
        endpoint === 'getBusiness' ||
        endpoint === 'getBusinessById' ||
        endpoint === 'updateBusiness' ||
        endpoint === 'deleteBusiness'
      ) {
        const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
        if (token) headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Business'],
  endpoints: (builder) => ({
    getBusiness: builder.query({
      query: () => `/`,
      providesTags: ['Business'],
    }),
    getBusinessById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Business', id }],
    }),
    addBusiness: builder.mutation({
      query: (body) => ({
        url: `/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Business'],
    }),
    updateBusiness: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }, 'Business'],
    }),
    deleteBusiness: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Business'],
    }),
  }),
});

export const {
  useGetBusinessQuery,
  useGetBusinessByIdQuery,
  useAddBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} = businessApi;


