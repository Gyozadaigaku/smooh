import { AddIcon } from '@chakra-ui/icons'
import { collection, orderBy, query, getDocs } from '@firebase/firestore'
import { db } from '../firebase'
import { IconButton, useDisclosure, Box, Flex, Heading } from '@chakra-ui/react'
import { TodoContext } from './TodoContext'
import { useAuth } from '../Auth'
import { useState } from 'react'
import { verifyIdToken } from '../firebaseAdmin'
import nookies from 'nookies'
import LeftNavList from '../components/LeftNavList'
import ProfileMenu from '../components/ProfileMenu'
import React from 'react'
import Sidebar from '../components/Sidebar'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'

const Home = ({ todosProps }: any) => {
  const { currentUser } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [todo, setTodo] = useState([])

  console.log('index.tsx')
  console.log('todosProps:', todosProps)
  console.log('todo:', todo)

  return (
    <TodoContext.Provider value={{ todo, setTodo }}>
      <Flex minH="100vh" m="auto">
        <Flex direction="column" minW={372} w={372} px={2} pt={4} pb={4}>
          <Sidebar />
          <LeftNavList />
          <ProfileMenu currentUser={currentUser} />
        </Flex>
        <Box flex={1} px={12} py={4} bg="gray.900">
          <Heading>Inbox</Heading>
          <TodoForm isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
          <TodoList todosProps={todosProps} handleToggleModal={onOpen} />
          <IconButton
            aria-label="Create task"
            pos="fixed"
            bottom={8}
            right={8}
            colorScheme="blue"
            bg="blue.400"
            borderRadius="50%"
            size="lg"
            p={0}
            onClick={onOpen}
          >
            <AddIcon w={6} h={6} />
          </IconButton>
        </Box>
      </Flex>
    </TodoContext.Provider>
  )
}

export default Home

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
