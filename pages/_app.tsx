import '../styles/globals.css'
import '../styles/calendar.css'
import initAuth from '../firebase/initAuth'
import { ChakraProvider } from '@chakra-ui/react'

initAuth()

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
