import { Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import todosSlice from '../../features/todosSlice'
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
import React from 'react'
import DatePicker from 'react-datepicker'

const NewNoteInput = () => {
  const [title, setTitle] = useState<string>('')
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [timestamp, setTimestamp] = useState<Date>(new Date())

  const dispatch = useDispatch<Dispatch<PayloadAction<string>>>()

  //テキストエリアの入力値監視用
  const updateTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const updateIsCompleted = (event: ChangeEvent<HTMLInputElement>) => {
    setIsCompleted(event.target.checked)
  }

  const updateStartDate = (date: Date) => {
    setStartDate(date)
  }

  const updateEndDate = (date: Date) => {
    setEndDate(date)
  }

  const updateTimestamp = (date: Date) => {
    setEndDate(date)
  }

  //storeへのdispatch
  const addTodo = (title: string, isCompleted: boolean, startDate: Date, endDate: Date, timestamp: Date) => {
    dispatch(todosSlice.actions.add({ title, isCompleted, startDate, endDate, timestamp }))
  }

  //ボタンを押したときの処理
  const handleAddTodo = () => {
    addTodo(title, isCompleted, startDate, endDate, timestamp) //グローバルstateにnoteを追加
    setTitle('') //テキストエリアリセット
  }

  return (
    <VStack spacing={4}>
      <InputGroup>
        <Checkbox mr={4} isChecked={isCompleted} onChange={updateIsCompleted} />
        <Input
          type="text"
          onChange={updateTitle}
          onKeyPress={(e) => {
            // if (e.key == 'Enter') {
            //   e.preventDefault()
            //   onClose()
            //   // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'sendData'.
            //   sendData()
            // }
          }}
          placeholder="Search or Create"
          value={title}
        />
      </InputGroup>
      <HStack>
        <Box>
          <FormLabel mb={1} htmlFor="start-date">
            start
          </FormLabel>
          <DatePicker selected={startDate} onChange={updateStartDate} />
        </Box>
        <Box>
          <FormLabel mb={1} htmlFor="end-date">
            end
          </FormLabel>
          <DatePicker selected={endDate} onChange={updateEndDate} />
        </Box>
      </HStack>
      <Button isFullWidth={true} mt={3} mb={4} onClick={handleAddTodo}>
        Add
      </Button>
      <div>debug:{title}</div>
      <div>{isCompleted.toString()}</div>
    </VStack>
  )
}

export default NewNoteInput
