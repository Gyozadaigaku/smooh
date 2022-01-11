import { Flex, Box, Text, IconButton, Checkbox } from '@chakra-ui/react'
import { MinusIcon } from '@chakra-ui/icons'
import moment from 'moment'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useContext } from 'react'
import { TodoContext } from '../pages/TodoContext'

const Todo = ({ id, title, isCompleted, startDate, endDate, timestamp, handleToggleModal }) => {
  const { setTodo } = useContext(TodoContext)
  const deleteTodo = async (id, e) => {
    e.stopPropagation()
    const docRef = doc(db, 'todos', id)
    await deleteDoc(docRef).then(console.log('Data was successfully deleted!'))
  }

  return (
    <>
      <Flex
        onClick={() => {
          setTodo({ id, title, isCompleted, startDate, endDate, timestamp })
          handleToggleModal()
        }}
        key={id}
        w="100%"
        pl={0}
        py={4}
        align="center"
        borderRadius={5}
        justifyContent="start"
      >
        <IconButton
          // colorScheme='whiteAlpha'
          border="none"
          variant="outline"
          onClick={(e) => deleteTodo(id, e)}
          icon={<MinusIcon />}
        />
        <Box ml={4}>
          <Checkbox size="md" mb={1} colorScheme="blue">
            <Text>
              {title}
              {moment(timestamp).format('MMMM do, yyyy')}
            </Text>
          </Checkbox>
        </Box>
      </Flex>
    </>
  )
}

export default Todo
