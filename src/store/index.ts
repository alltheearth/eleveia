// src/store/index.ts - CORRIGIDO COM RTK QUERY
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadReducer from './slices/leadSlice';
import contatoReducer from './slices/contatoSlice';

// ✅ IMPORTAR RTK QUERY APIs
import { schoolApi } from '../services/schoolApi';
import { leadsApi } from '../services/leadsApi';
import { contactsApi } from '../services/contactsApi';
import { eventsApi } from '../services/eventsApi';
import { faqsApi } from '../services/faqsApi';
import { uzapiApi } from '../services/uzapiApi';

const store = configureStore({
  reducer: {
    // Redux Slices tradicionais
    auth: authReducer,
    leads: leadReducer,
    contatos: contatoReducer,
    
    // ✅ RTK Query APIs
    [schoolApi.reducerPath]: schoolApi.reducer,
    [leadsApi.reducerPath]: leadsApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [uzapiApi.reducerPath]: uzapiApi.reducer,
  },
  
  // ✅ Adicionar middleware do RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(schoolApi.middleware)
      .concat(leadsApi.middleware)
      .concat(contactsApi.middleware)
      .concat(eventsApi.middleware)
      .concat(faqsApi.middleware)
      .concat(uzapiApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;