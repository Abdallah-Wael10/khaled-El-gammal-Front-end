// features/api/galleryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const customizeApi = createApi({
  reducerPath: 'customizeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/customize`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // فقط العمليات المحمية تحتاج توكن
      if (
        endpoint === 'getCustomization' ||
        endpoint === 'getCustomizationById' ||
        endpoint === 'updateCustomization' ||
        endpoint === 'deleteCustomization'
      ) {
        const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
        if (token) headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Customization'],
  endpoints: (builder) => ({
    getCustomization: builder.query({
      query: () => `/`,
      providesTags: ['Customization'],
    }),
    getCustomizationById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customization', id }],
    }),
    addCustomization: builder.mutation({
      query: (body) => ({
        url: `/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customization'],
    }),
    updateCustomization: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customization', id }, 'Customization'],
    }),
    deleteCustomization: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customization'],
    }),
  }),
});

export const {
  useGetCustomizationQuery,
  useGetCustomizationByIdQuery,
  useAddCustomizationMutation,
  useUpdateCustomizationMutation,
  useDeleteCustomizationMutation,
} = customizeApi;





