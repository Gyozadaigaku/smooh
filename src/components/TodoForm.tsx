import 'react-datepicker/dist/react-datepicker.css'
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Tag,
  TagLabel,
  VStack,
} from '@chakra-ui/react'
import { addDoc, collection, serverTimestamp, doc, updateDoc, onSnapshot, orderBy, query, where } from '@firebase/firestore'
import { db } from '../firebase'
import { SmallAddIcon } from '@chakra-ui/icons'
import { TodoContext } from '../pages/TodoContext'
import DatePicker from 'react-datepicker'
import React, { useState, useEffect, useRef, useContext } from 'react'

const TodoForm = ({ isOpen, onClose }: any) => {
  const { todo, setTodo } = useContext(TodoContext)

  const [tags, setTags] = useState([])

  const initialRef = useRef()
  const handleClickOverlay = () => {
    setTodo({ title: '', isCompleted: false, startDate: new Date(), endDate: new Date() })
  }

  useEffect(() => {
    const collectionRef = collection(db, 'tags')
    const q = query(
      collectionRef,
      // where("email", "==", currentUser?.email),
      // orderBy('timestamp', 'desc'),
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      return setTags(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })),
      )
    })
    return unsubscribe
  }, [])

  console.log('TodoForm.tsx')
  console.log('todo:', todo)
  console.log('todo.tags:', todo.tags)
  console.log('tags:', tags)

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
          <VStack spacing={4} alignItems="start">
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

            <Popover>
              <PopoverTrigger>
                <HStack spacing={4}>
                  <Tag size="sm" key={1} borderRadius="full" variant="solid" colorScheme="gray">
                    <SmallAddIcon />
                    <TagLabel>Tags</TagLabel>
                  </Tag>
                  {todo.tags &&
                    todo.tags.map((tag: string, id: number) => {
                      return (
                        <Tag key={id} borderRadius="full" size="sm" variant="solid" colorScheme="blue">
                          <TagLabel>{tag}</TagLabel>
                        </Tag>
                      )
                    })}
                </HStack>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                {/* <PopoverCloseButton /> */}
                <Button
                  position="absolute"
                  top={1}
                  right={2}
                  px={2}
                  py={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  h={8}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  boundary="clippingParents"
                  onClick={onClose}
                >
                  Done
                </Button>
                <PopoverHeader>Tags</PopoverHeader>
                <PopoverBody>
                  <CheckboxGroup colorScheme="blue" defaultValue={['work', 'home']}>
                    <Stack spacing={[1, 3]}>
                      {tags.map((tag, id) => {
                        return (
                          <Checkbox key={id} value={tag.name}>
                            {tag.name}
                          </Checkbox>
                        )
                      })}
                    </Stack>
                  </CheckboxGroup>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            {/* <HStack spacing={4}>
              {todo.tags &&
                todo.tags.map((tag: string, id: number) => {
                  return (
                    <Tag key={id} borderRadius="full" size="sm" variant="solid" colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  )
                })}
            </HStack> */}
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
