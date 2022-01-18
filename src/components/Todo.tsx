import { db } from '../firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { Flex, Box, Text, IconButton, Checkbox, HStack, Tag, TagLabel } from '@chakra-ui/react'
import { MinusIcon } from '@chakra-ui/icons'
import { TodoContext } from '../pages/TodoContext'
import { useContext } from 'react'
import moment from 'moment'

const Todo = ({ id, title, isCompleted, startDate, endDate, timestamp, tags, handleToggleModal }: any) => {
  const { setTodo } = useContext(TodoContext)
  const deleteTodo = async (id: any, e: any) => {
    e.stopPropagation()
    const docRef = doc(db, 'todos', id)
    await deleteDoc(docRef).then(console.log('Data was successfully deleted!'))
  }

  return (
    <>
      <Flex
        onClick={() => {
          setTodo({ id, title, isCompleted, startDate, endDate, tags, timestamp })
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
            <Text fontSize="lg" mb={1}>
              {title}
            </Text>
            <HStack spacing={4}>
              {tags &&
                tags.map((tag: string, id: number) => {
                  return (
                    <Tag key={id} borderRadius="full" size="sm" variant="solid" colorScheme="blue">
                      <TagLabel>{tag.name}</TagLabel>
                    </Tag>
                  )
                })}
            </HStack>
          </Checkbox>
        </Box>
      </Flex>
    </>
  )
}

export default Todo
