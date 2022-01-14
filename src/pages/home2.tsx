import { Dispatch, PayloadAction } from '@reduxjs/toolkit'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NewNoteInput from '../components/NewNoteInput'
import todosSlice, { TodosState } from '../../features/todosSlice'
import { Flex, Box, Text, IconButton, Checkbox } from '@chakra-ui/react'
import { useEffect } from 'react'
import { MinusIcon } from '@chakra-ui/icons'
import 'firebase/compat/firestore'
import Todo from '../components/Todo'
import { db } from '../firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { collection, onSnapshot, orderBy, query, where } from '@firebase/firestore'

const Home2 = ({ todosProps }: any) => {
  // const todos = useSelector<TodosState, TodosState['todos']>((state) => state.todos)
  // const dispatch = useDispatch<Dispatch<PayloadAction<string>>>()

  const todos = collection(db, 'todos')

  const deleteTodo = async (id: any, e: any) => {
    e.stopPropagation()
    const docRef = doc(db, 'todos', id)
    await deleteDoc(docRef).then(console.log('Data was successfully deleted!'))
  }

  useEffect(() => {
    const collectionRef = collection(db, 'todos')
    const q = query(
      collectionRef,
      // where("email", "==", currentUser?.email),
      orderBy('timestamp', 'desc'),
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          startDate: doc.data().startDate?.toDate(),
          endDate: doc.data().endDate?.toDate(),
          timestamp: doc.data().timestamp?.toDate().getTime(),
        })),
      )
    })
    return unsubscribe
  }, [])

  // const removeNote = (noteid: string) => {
  //   dispatch(todosSlice.actions.remove(noteid))
  // }

  // //resetボタンを押したときの処理
  // const handleReset = () => {
  //   dispatch(todosSlice.actions.reset('')) //notelistのリセット
  // }

  return (
    <>
      <NewNoteInput />
      {/* <button onClick={handleReset}> notes clear</button> */}
      {todos.map((todo) => (
        <Flex key={todo.id} w="100%" pl={0} py={4} align="center" borderRadius={5} justifyContent="start">
          <IconButton
            // colorScheme='whiteAlpha'
            border="none"
            variant="outline"
            onClick={(e) => deleteTodo(id, e)}
            icon={<MinusIcon />}
          />
          <Box ml={4}>
            <Checkbox size="md" mb={1} colorScheme="blue">
              <Text>{todo.title}</Text>
            </Checkbox>
            <div>{todo.isCompleted.toString()}</div>
            <div>{todo.startDate}</div>
            <div>{todo.endDate}</div>
            <div>{todo.timestamp}</div>
          </Box>
        </Flex>
      ))}
    </>
  )
}

export default Home2
