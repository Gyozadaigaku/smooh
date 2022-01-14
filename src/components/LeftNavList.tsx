import { Wrap, WrapItem, Avatar, IconButton, Flex, Text, Button, VStack, Box, StackDivider, Icon, Divider } from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'
import { FaInbox, FaRegListAlt } from 'react-icons/fa'
import { CgTag } from 'react-icons/cg'

const LeftNavList = () => {
  const navItems = [
    {
      icon: FaInbox,
      label: 'Inbox',
    },
    {
      icon: CalendarIcon,
      label: 'Schedule',
    },
    {
      icon: FaRegListAlt,
      label: 'List',
    },
    {
      icon: CgTag,
      label: 'Tags',
    },
  ]

  return (
    <>
      <VStack spacing={4} align="stretch" justifyContent="center" flex={1}>
        <Divider />
        <Box m="auto" width="100%" textAlign="center">
          {navItems.map((navItems, id) => {
            return (
              <Button justifyContent="left" variant="ghost" width="95%" px={2} py={6} my={1} key={id}>
                <Icon as={navItems.icon} boxSize={6} />
                <Text pl={4}>{navItems.label}</Text>
              </Button>
            )
          })}
        </Box>
        <Divider />
      </VStack>
    </>
  )
}

export default LeftNavList
