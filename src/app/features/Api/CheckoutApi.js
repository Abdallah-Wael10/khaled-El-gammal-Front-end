import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '@/app/utils/page';
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/checkout`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createCheckout: builder.mutation({
      query: (body) => ({
        url: `/`,
        method: 'POST',
        body,
      }),
    }),
    // Admin endpoints
    getAllCheckouts: builder.query({
      query: () => `/`,
    }),
    getCheckoutById: builder.query({
      query: (id) => `/${id}`,
    }),
    // Update checkout status (admin)
    updateCheckoutStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
  useGetAllCheckoutsQuery,
  useGetCheckoutByIdQuery,
  useUpdateCheckoutStatusMutation,
} = checkoutApi;