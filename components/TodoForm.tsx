import 'react-datepicker/dist/react-datepicker.css'
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'
import { addDoc, collection, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { TodoContext } from '../pages/TodoContext'
import DatePicker from 'react-datepicker'
import React, { useState, useEffect, useRef, useContext } from 'react'

const TodoForm = ({ isOpen, onClose }: any) => {
  const { todo, setTodo } = useContext(TodoContext)
  const initialRef = useRef()
  const handleClickOverlay = () => {
    setTodo({ title: '', isCompleted: false, startDate: new Date(), endDate: new Date() })
  }

  const onSubmit = async () => {
    // Update todo
    if (todo?.hasOwnProperty('timestamp')) {
      const docRef = doc(db, 'todos', todo.id)
      const todoUpdated = {
        ...todo,
        timestamp: serverTimestamp(),
      }
      updateDoc(docRef, todoUpdated)
      setTodo({ title: '', isCompleted: false, startDate: new Date(), endDate: new Date() })

      // db.collection('todos')
      //   .get()
      //   //getしたデータに対し、
      //   .then((snapshot) => {
      //     //docsプロパティ(※)を指定しforEachで各データを取り出します。
      //     snapshot.docs.forEach((doc) => {
      //       const data = doc.data()
      //       //準備しておいた配列に取り出したデータをpushします
      //       posts.push({
      //         ...todo,
      //         timestamp: serverTimestamp(),
      //       })
      //     })
      //     //ここはhooksなので気にしなくてOK
      //     // setCurrentPost(posts)
      //   })
    }
    // Create todo
    else {
      const collectionRef = collection(db, 'todos')
      const docRef = await addDoc(collectionRef, {
        // id: collection(db, 'todos').doc().id,
        ...todo,
        timestamp: serverTimestamp(),
      })
      setTodo({ title: '', isCompleted: false, startDate: new Date(), endDate: new Date() })
    }
  }

  return (
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
              <Checkbox mr={4} isChecked={todo.isCompleted} onChange={(e) => setTodo({ ...todo, isCompleted: e.target.checked })} />
              <Input
                ref={initialRef}
                type="text"
                onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key == 'Enter') {
                    e.preventDefault()
                    onClose()
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'sendData'.
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
                <DatePicker selected={todo.startDate} onChange={(date: any) => setTodo({ ...todo, startDate: date })} />
              </Box>
              <Box>
                <FormLabel mb={1} htmlFor="end-date">
                  end
                </FormLabel>
                <DatePicker selected={todo.endDate} onChange={(date: any) => setTodo({ ...todo, endDate: date })} />
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
  )
}

export default TodoForm
