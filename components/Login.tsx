import { auth, provider } from '../firebase'
import { Button, ChakraProvider } from '@chakra-ui/react'
import { FaGoogle } from 'react-icons/fa'
import { Grid } from '@chakra-ui/react'
import { signInWithPopup } from '@firebase/auth'

const Login = () => {
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
  }
  return (
    <ChakraProvider>
      <Grid justifyContent="center" direction="column" alignItems="center" h="100vh">
        <Button leftIcon={<FaGoogle />} colorScheme="blue" variant="solid" onClick={loginWithGoogle}>
          I&apos;m back
        </Button>
      </Grid>
    </ChakraProvider>
  )
}

export default Login
