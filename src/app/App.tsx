import { createBrowserRouter, RouterProvider } from 'react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/useAuth'
import { DataProvider } from '@/hooks/useData'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  )
}
