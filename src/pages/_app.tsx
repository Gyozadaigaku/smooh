import '../styles/calendar.css'
import '../styles/date-picker.css'
import '../styles/globals.css'
import { AppProps } from 'next/app'
import { AuthProvider } from '../Auth'
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  )
}

export default MyApp
