import { ChakraProvider, Spinner } from '@chakra-ui/react'

const Loading = () => {
  return (
    <ChakraProvider>
      <Spinner pos="fixed" top="50%" left="50%" translateX="-50%" translateY="-50%" size="xl" color="blue.500" />
    </ChakraProvider>
  )
}

export default Loading
