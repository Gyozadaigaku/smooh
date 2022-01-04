import React, { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Box,
  Text,
  IconButton,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Checkbox,
} from '@chakra-ui/react'
import DarkModeSwitch from '../components/DarkModeSwitch'
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth'
import getAbsoluteURL from '../firebase/getAbsoluteURL'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { BsInboxes } from 'react-icons/bs'
import { MdOutlineLogout } from 'react-icons/md'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Sidebar from '../components/Sidebar'
import TagList from '../components/TagList'

const Todo = () => {
  const AuthUser = useAuthUser()
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // console.log(AuthUser)
  // console.log(todos)

  useEffect(() => {
    AuthUser.id &&
      firebase
        .firestore()
        .collection(AuthUser.id)
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setTodos(snapshot.docs.map((doc) => doc.data().todo))
        })
  }, [input, AuthUser.id])

  const sendData = () => {
    try {
      // try to update doc
      firebase
        .firestore()
        .collection(AuthUser.id) // each user will have their own collection
        .doc(input) // set the collection name to the input so that we can easily delete it later on
        .set({
          todo: input,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(console.log('Data was successfully sent to cloud firestore!'))
      // clear form
      setInput('')
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTodo = (t) => {
    try {
      firebase.firestore().collection(AuthUser.id).doc(t).delete().then(console.log('Data was successfully deleted!'))
    } catch (error) {
      console.log(error)
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef()

  return (
    <Flex minH="100vh" m="auto">
      <Sidebar input={input} />
      <Box flex="1" px={12} py={8} bg="gray.900">
        <Flex justify="space-between" w="100%" align="center">
          <Flex align="baseline">
            <Box color="blue.400">
              <BsInboxes size={24} />
            </Box>
            <Heading pl={2} mb={4} size="lg">
              Inbox
            </Heading>
          </Flex>
          <Flex>
            <DarkModeSwitch />
            <IconButton ml={2} onClick={AuthUser.signOut} icon={<MdOutlineLogout />} />
          </Flex>
        </Flex>

        <Modal initialFocusRef={initialRef} blockScrollOnMount={false} onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <AddIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  ref={initialRef}
                  type="text"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key == 'Enter') {
                      e.preventDefault()
                      onClose()
                      sendData()
                    }
                  }}
                  placeholder="Search or Create"
                  value={input}
                />
                <Button
                  ml={2}
                  onClick={() => {
                    onClose()
                    sendData()
                  }}
                >
                  Add Todo
                </Button>
              </InputGroup>
            </ModalBody>
          </ModalContent>
        </Modal>
        {!todos.length ? (
          <Spinner pos="fixed" top="50%" left="50%" translateX="-50%" translateY="-50%" size="xl" color="blue.500" />
        ) : (
          todos.map((t, i) => {
            return (
              <>
                {/* {i > 0 && <Divider />} */}
                <Flex key={i} w="100%" pl={0} py={4} align="center" borderRadius={5} justifyContent="start">
                  <IconButton
                    // colorScheme='whiteAlpha'
                    border="none"
                    variant="outline"
                    onClick={() => deleteTodo(t)}
                    icon={<MinusIcon />}
                  />
                  <Box ml={4}>
                    <Checkbox size="md" mb={1} colorScheme="blue">
                      <Text>{t}</Text>
                    </Checkbox>
                    <TagList />
                  </Box>
                </Flex>
              </>
            )
          })
        )}
        <IconButton
          isFullWidth="true"
          border="none"
          variant="outline"
          color="gray"
          justifyContent="start"
          pl={3}
          mt={5}
          icon={<AddIcon />}
          onClick={onOpen}
        />
      </Box>

      <IconButton pos="fixed" bottom="8" right="8" colorScheme="blue" bg="blue.400" borderRadius="50%" size="lg" p={0} onClick={onOpen}>
        <AddIcon w={6} h={6} />
      </IconButton>
    </Flex>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  // Optionally, get other props.
  // You can return anything you'd normally return from
  // `getServerSideProps`, including redirects.
  // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
  const token = await AuthUser.getIdToken()
  const endpoint = getAbsoluteURL('/api/example', req)
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: token || 'unauthenticated',
    },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`)
  }
  return {
    props: {
      favoriteColor: data.favoriteColor,
    },
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Todo)
