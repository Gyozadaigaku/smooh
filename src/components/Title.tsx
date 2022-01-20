import { Flex, Heading, Icon } from '@chakra-ui/react'

const Title = ({ icon, title, color }) => {
  return (
    <Flex alignItems="center">
      <Icon as={icon} boxSize={6} color={color} />
      <Heading ml={4}>{title}</Heading>
    </Flex>
  )
}

export default Title
