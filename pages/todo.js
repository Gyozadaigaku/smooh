import React, { useState, useEffect, useRef } from 'react'
import {
  Flex,
  FormLabel,
  Field,
  Heading,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Box,
  Text,
  IconButton,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Checkbox,
  VStack,
} from '@chakra-ui/react'
import DarkModeSwitch from '../components/DarkModeSwitch'
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth'
import getAbsoluteURL from '../firebase/getAbsoluteURL'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { BsInboxes } from 'react-icons/bs'
import { MdOutlineLogout } from 'react-icons/md'
import firebase from 'firebase/app'
import 'firebase/firestore'
// import Sidebar from '../components/Sidebar'
import TagList from '../components/TagList'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DatePicker } from '@orange_digital/chakra-datepicker'

const Todo = () => {
  const AuthUser = useAuthUser()
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const calendarRef = useRef(null)

  useEffect(() => {
    AuthUser.id &&
      firebase
        .firestore()
        .collection(AuthUser.id)
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setTodos(snapshot.docs.map((doc) => doc.data().todo))
        })
  }, [input, AuthUser.id])

  const sendData = () => {
    try {
      // try to update doc
      firebase
        .firestore()
        .collection(AuthUser.id) // each user will have their own collection
        .doc(input) // set the collection name to the input so that we can easily delete it later on
        .set({
          todo: input,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(console.log('Data was successfully sent to cloud firestore!'))

      const api = calendarRef.current.getApi()

      api.addEvent({
        title: input,
        start: '2022-01-08',
        end: '2022-01-08',
      })

      // clear form
      setInput('')
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTodo = (t) => {
    try {
      firebase.firestore().collection(AuthUser.id).doc(t).delete().then(console.log('Data was successfully deleted!'))
    } catch (error) {
      console.log(error)
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef()

  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])

  const handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        // id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      })
    }
  }

  const handleEventClick = (clickInfo) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  const fullCalendar = (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      // events={[{ title: "Today", date: new Date() }]}
      headerToolbar={{
        left: 'title',
        center: '',
        right: 'prev,today,next',
      }}
      initialView="dayGridMonth"
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={weekendsVisible}
      // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
      select={handleDateSelect}
      eventContent={renderEventContent} // custom render function
      eventClick={handleEventClick}
      eventsSet={(e) => setCurrentEvents([{ title: 'Today', date: new Date() }])} // called after events are initialized/added/changed/removed
      ref={calendarRef}
      /* you can update a remote database when these fire:
            eventAdd={(e) => setCurrentEvents([{ title: "Today", date: new Date() }])}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
    />
  )

  /*
  Select dates and you will be prompted to create a new event
  Drag, drop, and resize events
  Click an event to delete it
  */
  return (
    <Flex minH="100vh" m="auto">
      <Box minW="400px" px={2} py={8}>
        {fullCalendar}
        <div className="demo-app-sidebar">
          <div className="demo-app-sidebar-section">
            <h2>All Events ({currentEvents.length})</h2>
            <ul>{currentEvents.map(renderSidebarEvent)}</ul>
          </div>
        </div>
      </Box>

      <Box flex="1" px={12} py={8} bg="gray.900">
        <Flex justify="space-between" w="100%" align="center">
          <Flex align="baseline">
            <Box color="blue.400">
              <BsInboxes size={24} />
            </Box>
            <Heading pl={2} mb={4} size="lg">
              Inbox
            </Heading>
          </Flex>
          <Flex>
            <DarkModeSwitch />
            <IconButton ml={2} onClick={AuthUser.signOut} icon={<MdOutlineLogout />} />
          </Flex>
        </Flex>

        <Modal initialFocusRef={initialRef} blockScrollOnMount={false} onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <InputGroup>
                  <Input
                    ref={initialRef}
                    type="text"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key == 'Enter') {
                        e.preventDefault()
                        onClose()
                        sendData()
                      }
                    }}
                    placeholder="Search or Create"
                    value={input}
                  />
                </InputGroup>
                <HStack>
                  <Box>
                    <FormLabel mb={1} htmlFor="start-date">
                      start
                    </FormLabel>
                    <DatePicker initialValue={new Date()} />
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
                      onClose()
                      sendData()
                    }}
                  >
                    Add Todo
                  </Button>
                </Box>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
        {!todos.length ? (
          <Spinner pos="fixed" top="50%" left="50%" translateX="-50%" translateY="-50%" size="xl" color="blue.500" />
        ) : (
          todos.map((t, i) => {
            return (
              <>
                {/* {i > 0 && <Divider />} */}
                <Flex key={i} w="100%" pl={0} py={4} align="center" borderRadius={5} justifyContent="start">
                  <IconButton
                    // colorScheme='whiteAlpha'
                    border="none"
                    variant="outline"
                    onClick={() => deleteTodo(t)}
                    icon={<MinusIcon />}
                  />
                  <Box ml={4}>
                    <Checkbox size="md" mb={1} colorScheme="blue">
                      <Text>{t}</Text>
                    </Checkbox>
                    <TagList />
                  </Box>
                </Flex>
              </>
            )
          })
        )}
        <IconButton
          isFullWidth="true"
          border="none"
          variant="outline"
          color="gray"
          justifyContent="start"
          pl={3}
          mt={5}
          icon={<AddIcon />}
          onClick={onOpen}
        />
      </Box>
      <IconButton pos="fixed" bottom="8" right="8" colorScheme="blue" bg="blue.400" borderRadius="50%" size="lg" p={0} onClick={onOpen}>
        <AddIcon w={6} h={6} />
      </IconButton>
    </Flex>
  )
}

const renderEventContent = (eventInfo) => {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

const renderSidebarEvent = (event) => {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  // Optionally, get other props.
  // You can return anything you'd normally return from
  // `getServerSideProps`, including redirects.
  // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
  const token = await AuthUser.getIdToken()
  const endpoint = getAbsoluteURL('/api/example', req)
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: token || 'unauthenticated',
    },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`)
  }
  return {
    props: {
      favoriteColor: data.favoriteColor,
    },
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Todo)
