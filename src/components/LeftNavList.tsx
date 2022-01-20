import { CalendarIcon } from '@chakra-ui/icons'
import { CgTag } from 'react-icons/cg'
import { FaInbox, FaRegListAlt } from 'react-icons/fa'
import { Wrap, WrapItem, Avatar, IconButton, Flex, Text, Button, VStack, Box, StackDivider, Icon, Divider } from '@chakra-ui/react'
import Link from 'next/link'

const LeftNavList = () => {
  const navItems = [
    {
      icon: FaInbox,
      label: 'Inbox',
      path: '/',
    },
    {
      icon: CalendarIcon,
      label: 'Schedule',
      path: '/schedule',
    },
    {
      icon: FaRegListAlt,
      label: 'List',
      path: '/list',
    },
    {
      icon: CgTag,
      label: 'Tags',
      path: '/tags',
    },
  ]

  return (
    <>
      <VStack spacing={4} align="stretch" justifyContent="center" flex={1}>
        <Divider />
        <Box m="auto" width="100%" textAlign="center">
          {navItems.map((navItems, id) => {
            return (
              <Link key={id} href={navItems.path}>
                <a>
                  <Button justifyContent="left" variant="ghost" width="95%" px={2} py={6} my={1} key={id}>
                    <Icon as={navItems.icon} boxSize={6} />
                    <Text pl={4}>{navItems.label}</Text>
                  </Button>
                </a>
              </Link>
            )
          })}
        </Box>
        <Divider />
      </VStack>
    </>
  )
}

export default LeftNavList
