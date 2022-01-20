import { AddIcon } from '@chakra-ui/icons'
import { addDoc, collection, serverTimestamp, doc, updateDoc, onSnapshot, orderBy, query, where } from '@firebase/firestore'
import { CgTag } from 'react-icons/cg'
import { db } from '../firebase'
import { IconButton, useDisclosure, Box, Flex, Text, Heading, HStack, Stack, Checkbox, List, ListItem, ListIcon } from '@chakra-ui/react'
import { TodoContext } from './TodoContext'
import { useAuth } from '../Auth'
import { useState, useEffect } from 'react'
import { verifyIdToken } from '../firebaseAdmin'
import nookies from 'nookies'
import LeftNavList from '../components/LeftNavList'
import ProfileMenu from '../components/ProfileMenu'
import React from 'react'
import Sidebar from '../components/Sidebar'
import Title from '../components/Title'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import { VscCircleOutline } from 'react-icons/vsc'

const Tags = ({ todosProps }: any) => {
  const { currentUser } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tags, setTags] = useState([])

  const [todo, setTodo] = useState({ title: '', isCompleted: false, startDate: new Date(), endDate: new Date(), tags: [] })

  console.log('tags.tsx')
  console.log('todosProps:', todosProps)
  console.log('todo:', todo)

  useEffect(() => {
    const collectionRef = collection(db, 'tags')
    const q = query(collectionRef)

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      return setTags(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })),
      )
    })
    return unsubscribe
  }, [])

  return (
    <TodoContext.Provider value={{ todo, setTodo }}>
      <Flex minH="100vh" m="auto">
        <Flex direction="column" minW={372} w={372} px={2} pt={4} pb={4}>
          <Sidebar />
          <LeftNavList />
          <ProfileMenu currentUser={currentUser} />
        </Flex>
        <Box flex={1} px={12} py={4} bg="gray.900">
          <Title icon={CgTag} title="Tags" color="green.500" />
          <List w="100%" pl={0} py={4} spacing={3}>
            {/* vertical tags */}
            {tags.map((tag, id) => {
              return (
                <>
                  <ListItem
                    key={id}
                    cursor="pointer"
                    borderRadius={5}
                    p={4}
                    _hover={{
                      background: 'gray.800',
                    }}
                  >
                    <Flex alignItems="center">
                      <ListIcon
                        value={tag.name}
                        onChange={(e) => {
                          e.target.checked ? handleTagCheck(e) : handleTagUncheck(id, e)
                        }}
                        as={VscCircleOutline}
                        color="gray"
                      />
                      <div>
                        {tag.name}
                        <HStack spacing="24px" fontSize="xs">
                          <Text color="gray.500">0 items</Text>
                          <Text color="gray.500" marginStart={4}>
                            0 unscheduled
                          </Text>
                        </HStack>
                      </div>
                    </Flex>
                  </ListItem>
                </>
              )
            })}
          </List>
        </Box>
      </Flex>
    </TodoContext.Provider>
  )
}

export default Tags

export async function getServerSideProps(context: any) {
  try {
    const cookies = nookies.get(context)
    const token = await verifyIdToken(cookies.token)
    const { email } = token
    const collectionRef = collection(db, 'todos')
    const q = query(
      collectionRef,
      // where("email", "==", currentUser?.email),
      orderBy('timestamp', 'desc'),
    )
    const querySnapshot = await getDocs(q)
    let todos: any = []
    querySnapshot.forEach((doc) => {
      todos.push({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp.toDate().getTime() })
    })
    return {
      props: {
        todosProps: JSON.stringify(todos) || [],
      },
    }
  } catch (error) {
    return { props: {} }
  }
}
