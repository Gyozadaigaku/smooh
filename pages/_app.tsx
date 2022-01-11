import '../styles/globals.css'
import '../styles/calendar.css'
import '../styles/date-picker.css'
import { AppProps } from 'next/app'
// import initAuth from '../firebase/initAuth'
import { AuthProvider } from '../Auth'
// import { AuthProvider } from '../components/Auth'
import { ChakraProvider } from '@chakra-ui/react'

// initAuth()

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
