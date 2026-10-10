import { RouterProvider } from 'react-router-dom';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { UIProvider } from '@/context/UIContext';
import { router } from './routes';

export function App() {
  return (
    <PreferencesProvider>
      <UIProvider>
        <RouterProvider router={router} />
      </UIProvider>
    </PreferencesProvider>
  );
}
