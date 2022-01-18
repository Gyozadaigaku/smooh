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

  console.log('TodoForm.tsx')
  console.log('todo:', todo)

  const handleClickOverlay = () => {
    setTodo({ title: '', isCompleted: false, startDate: new Date(), endDate: new Date(), tags: [] })
  }

  const handleTagCheck = (e) => {
    setTodo({
      ...todo,
      tags: [...todo.tags, { name: e.target.value, isChecked: e.target.checked }],
    })
  }

  const handleTagUncheck = (index, e) => {
    const newTags = [...todo.tags]
    newTags.map((newTag, i) => {
      if (newTag.name === e.target.value) {
        newTags.splice(i, 1)
        return
      }
    })
    setTodo({ ...todo, tags: newTags })
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

  const focusInputField = (input) => {
    if (input) {
      setTimeout(() => {
        input.focus()
      }, 100)
    }
  }

  return (
    // input form
    <Modal onOverlayClick={handleClickOverlay} blockScrollOnMount={false} onClose={onClose} isOpen={isOpen} isCentered>
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
                variant="unstyled"
                ref={focusInputField}
              />
            </InputGroup>

            <Popover>
              <PopoverTrigger>
                <HStack spacing={4}>
                  <Tag size="sm" key={-1} borderRadius="full" variant="solid" colorScheme="gray" cursor="pointer">
                    <SmallAddIcon />
                    <TagLabel>Tags</TagLabel>
                  </Tag>
                  {/* horizontal tags */}
                  {todo.tags &&
                    todo.tags.map((tag: string, id: number) => {
                      return (
                        <Tag key={id} borderRadius="full" size="sm" variant="solid" colorScheme="blue" cursor="pointer">
                          <TagLabel>{tag.name}</TagLabel>
                        </Tag>
                      )
                    })}
                </HStack>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                {/* <PopoverCloseButton /> */}
                <Button
                  alignItems="center"
                  boundary="clippingParents"
                  colorScheme="whiteAlpha"
                  display="flex"
                  h={8}
                  justifyContent="center"
                  onClick={onClose}
                  position="absolute"
                  px={2}
                  py={0}
                  right={2}
                  top={1}
                  variant="ghost"
                >
                  Done
                </Button>
                <PopoverHeader>Tags</PopoverHeader>
                <PopoverBody>
                  <CheckboxGroup
                    colorScheme="blue"
                    defaultValue={
                      todo.tags &&
                      todo.tags.map((tag: string, id: number) => {
                        return tag.name
                      })
                    }
                  >
                    <Stack spacing={[1, 3]}>
                      {/* vertical tags */}
                      {tags.map((tag, id) => {
                        return (
                          <Checkbox
                            key={id}
                            value={tag.name}
                            onChange={(e) => {
                              e.target.checked ? handleTagCheck(e) : handleTagUncheck(id, e)
                            }}
                          >
                            {tag.name}
                          </Checkbox>
                        )
                      })}
                    </Stack>
                  </CheckboxGroup>
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
