import { auth } from '../firebase'
import { Wrap, WrapItem, Avatar, IconButton, Flex, Text, Button } from '@chakra-ui/react'
import { SettingsIcon } from '@chakra-ui/icons'

const ProfileMenu = ({ currentUser }) => {
  return (
    <Flex mt="auto" px={1} justifyContent="space-between" alignItems="center">
      <Wrap>
        <WrapItem alignItems="center">
          <Button variant="link" onClick={() => auth.signOut()}>
            <Avatar name="user-name" size="sm" src={currentUser.photoURL} />
            <Text pl={2}>{currentUser.displayName}</Text>
          </Button>
        </WrapItem>
      </Wrap>
      <IconButton aria-label="Open setting" variant="ghost" borderRadius="50%" size="lg" icon={<SettingsIcon />} />
    </Flex>
  )
}

export default ProfileMenu
