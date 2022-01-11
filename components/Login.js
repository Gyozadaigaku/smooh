import { IconButton, Grid } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { auth, provider } from '../firebase'
import { signInWithPopup } from '@firebase/auth'
import { Button, ChakraProvider } from '@chakra-ui/react'
import { FaGoogle } from 'react-icons/fa'

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
