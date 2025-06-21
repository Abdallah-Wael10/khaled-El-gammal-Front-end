import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '@/app/utils/page';
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/products` }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `/`,
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation({
      query: (formData) => ({
        url: `/`,
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ['Product'],
    }),
    addProductImage: builder.mutation({
      query: ({ id, image }) => {
        const formData = new FormData();
        formData.append("image", image);
        return {
          url: `/${id}/images`,
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        };
      },
      invalidatesTags: ['Product'],
    }),
    replaceProductImage: builder.mutation({
      query: ({ id, imageName, image }) => {
        const formData = new FormData();
        formData.append("image", image);
        return {
          url: `/${id}/images/${imageName}`,
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        };
      },
      invalidatesTags: ['Product'],
    }),
    deleteProductImage: builder.mutation({
      query: ({ id, imageName }) => ({
        url: `/${id}/images/${imageName}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductImageMutation,
  useReplaceProductImageMutation,
  useDeleteProductImageMutation,
} = productApi;