import { configureStore } from '@reduxjs/toolkit';
import { galleryApi } from '@/app/features/Api/galleryApi';
import { contactApi } from '@/app/features/Api/contactUsApi';
import { businessApi } from '../features/Api/BusinessFormApi';
import { customizeApi } from '../features/Api/CustomizeFormApi';
import { authApi } from '../features/Api/AuthApi';
export const store = configureStore({
  reducer: {
    [galleryApi.reducerPath]: galleryApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [businessApi.reducerPath]: businessApi.reducer,
    [customizeApi.reducerPath]: customizeApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(galleryApi.middleware, contactApi.middleware, businessApi.middleware, customizeApi.middleware, authApi.middleware),
});