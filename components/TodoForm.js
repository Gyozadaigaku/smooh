import React, { useState, useEffect, useRef, useContext } from 'react'
import {
  FormLabel,
  HStack,
  InputGroup,
  Input,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
} from '@chakra-ui/react'

import { addDoc, collection, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { DatePicker } from '@orange_digital/chakra-datepicker'
import { TodoContext } from '../pages/TodoContext'

const TodoForm = ({ isOpen, onClose }) => {
  const inputAreaRef = useRef(null)
  const [startDate, setStartDate] = useState(new Date())
  const { todo, setTodo } = useContext(TodoContext)
  const initialRef = useRef()
  console.log('todos:todoform')
  console.log(todo)

  const changeDateHandler = (newDate) => {
    setDate(newDate)
  }

  const handleClickOverlay = () => {
    setTodo({ title: '' })
  }

  const onSubmit = async () => {
    console.log('hello!!!!!!!!!!!!')
    console.log(db)
    console.log(todo)
    console.log(todo.title)

    // Update todo
    if (todo?.hasOwnProperty('timestamp')) {
      const docRef = doc(db, 'todos', todo.id)
      const todoUpdated = { ...todo, startDate: serverTimestamp(), endDate: serverTimestamp(), timestamp: serverTimestamp() }
      updateDoc(docRef, todoUpdated)
      setTodo({ title: '', startDate: new Date() })
    }
    // Create todo
    else {
      const collectionRef = collection(db, 'todos')
      const docRef = await addDoc(collectionRef, {
        ...todo,
        startDate: serverTimestamp(),
        endDate: serverTimestamp(),
        timestamp: serverTimestamp(),
      })
      setTodo({ title: '', startDate: new Date() })
      // alert(`Todo with id ${docRef.id} is added successfully`)
    }
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      console.log('inputAreaRef')
      console.log(inputAreaRef)
      // Click outside the modal
      if (!inputAreaRef.current.contains(e.target)) {
        // setTodo({ title: '' })
        console.log('外')
      } else {
        console.log('中！！')
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [])

  return (
    <div ref={inputAreaRef}>
      <Modal
        onOverlayClick={handleClickOverlay}
        initialFocusRef={initialRef}
        blockScrollOnMount={false}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <pre>{JSON.stringify(todo)}</pre> */}
            <VStack spacing={4}>
              <InputGroup>
                <Input
                  ref={initialRef}
                  type="text"
                  onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key == 'Enter') {
                      e.preventDefault()
                      onClose()
                      sendData()
                    }
                  }}
                  placeholder="Search or Create"
                  value={todo.title}
                />
              </InputGroup>
              <HStack>
                <Box>
                  <FormLabel mb={1} htmlFor="start-date">
                    start
                  </FormLabel>
                  <DatePicker
                    initialValue={startDate}
                    onDateChange={(e) => {
                      console.log('datepicker!!')
                      console.log(e)
                      id = 'aaa'
                    }}
                  />
                  {/* <SingleDatepicker
                    name="date-input"
                    date={date}
                    // onDateChange={(e) => {
                    //   console.log("datepicker!!");
                    //   console.log(e);
                    //   // console.log(e.target.value);
                    //   setTodo({ ...todo, endDate: e })
                    // }}
                    onDateChange={setDate}
                    onChange={(e) => {
                      console.log("datepicker!!");
                      // console.log(e);
                      // console.log(e.target.value);
                      // setTodo({ ...todo, endDate: e })
                    }}
                  /> */}
                </Box>
                <Box>
                  <FormLabel mb={1} htmlFor="end-date">
                    end
                  </FormLabel>
                  <DatePicker initialValue={new Date()} />
                </Box>
              </HStack>
              <Box w="100%">
                <Button
                  isFullWidth={true}
                  mt={3}
                  mb={4}
                  onClick={() => {
                    onSubmit()
                  }}
                >
                  {todo.hasOwnProperty('timestamp') ? 'Update' : 'Add'}
                </Button>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default TodoForm
