import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "@/app/utils/page";

export const shippingApi = createApi({
  reducerPath: "shippingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/shipping",
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Shipping"],
  endpoints: (builder) => ({
    getShipping: builder.query({
      query: () => "/",
      providesTags: ["Shipping"],
    }),
    createShipping: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shipping"],
    }),
    updateShipping: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Shipping"],
    }),
    deleteShipping: builder.mutation({
      query: () => ({
        url: "/",
        method: "DELETE",
      }),
      invalidatesTags: ["Shipping"],
    }),
  }),
});

export const {
  useGetShippingQuery,
  useCreateShippingMutation,
  useUpdateShippingMutation,
  useDeleteShippingMutation,
} = shippingApi;