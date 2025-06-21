// features/api/galleryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '@/app/utils/page';
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/contact`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // فقط العمليات المحمية تحتاج توكن
      if (
        endpoint === 'getContact' ||
        endpoint === 'getContactById' ||
        endpoint === 'updateContact' ||
        endpoint === 'deleteContact'
      ) {
        const token = getAuthToken();
        if (token) headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    getContact: builder.query({
      query: () => `/`,
      providesTags: ['Contact'],
    }),
    getContactById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contact', id }],
    }),
    addContact: builder.mutation({
      query: (body) => ({
        url: `/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Contact'],
    }),
    updateContact: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contact', id }, 'Contact'],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useGetContactQuery,
  useGetContactByIdQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactApi;
