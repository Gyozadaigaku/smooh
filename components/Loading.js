import { Spinner } from '@chakra-ui/react'

const Loading = () => {
  return (
    <>
      <Spinner pos="fixed" top="50%" left="50%" translateX="-50%" translateY="-50%" size="xl" color="blue.500" />
    </>
  )
}

export default Loading
