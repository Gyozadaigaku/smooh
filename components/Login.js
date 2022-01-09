import { IconButton } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { auth, provider } from '../firebase'
import { signInWithPopup } from '@firebase/auth'

const Login = () => {
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
  }
  return (
    <>
      <IconButton
        pos="fixed"
        bottom={8}
        right={8}
        colorScheme="blue"
        bg="blue.400"
        borderRadius="50%"
        size="lg"
        p={0}
        onClick={loginWithGoogle}
      >
        <AddIcon w={6} h={6} />
      </IconButton>
    </>
  )
}

export default Login
