import { configureStore } from '@reduxjs/toolkit';
import { galleryApi } from '@/app/features/Api/galleryApi';
import { contactApi } from '@/app/features/Api/contactUsApi';
import { businessApi } from '../features/Api/BusinessFormApi';
import { customizeApi } from '../features/Api/CustomizeFormApi';
import { authApi } from '../features/Api/AuthApi';
import { productApi } from '@/app/features/Api/ProductApi';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import { checkoutApi } from '../features/Api/CheckoutApi';
import { shippingApi } from '../features/Api/ShippingApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer, 
    [galleryApi.reducerPath]: galleryApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [businessApi.reducerPath]: businessApi.reducer,
    [customizeApi.reducerPath]: customizeApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [shippingApi.reducerPath]: shippingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      galleryApi.middleware,
      contactApi.middleware,
      businessApi.middleware,
      customizeApi.middleware,
      authApi.middleware,
      productApi.middleware,
      checkoutApi.middleware,
      shippingApi.middleware
    ),
});