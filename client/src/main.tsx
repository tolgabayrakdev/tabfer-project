import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import Loading from './components/Loading'
import { ChakraProvider } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <Suspense fallback={<Loading />}>
        <HelmetProvider>
          <RouterProvider router={routes} />
        </HelmetProvider>
      </Suspense>
    </ChakraProvider>
  </StrictMode>,
)
