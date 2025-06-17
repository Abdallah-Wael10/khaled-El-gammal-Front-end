// features/api/galleryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/gallery` }),
  tagTypes: ['Gallery'],
  endpoints: (builder) => ({
    getGallery: builder.query({
      query: () => `/`,
      providesTags: ['Gallery'],
    }),
    getGalleryById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Gallery', id }],
    }),
    addGalleryItem: builder.mutation({
      query: (formData) => ({
        url: `/`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Gallery'],
    }),
    updateGalleryItem: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Gallery', id }, 'Gallery'],
    }),
    deleteGalleryItem: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useGetGalleryByIdQuery,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = galleryApi;