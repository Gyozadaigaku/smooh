// need to import @fullcalendar before attempting to import other plugins
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useState, useRef } from 'react'
import timeGridPlugin from '@fullcalendar/timegrid'

const Sidebar = () => {
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const calendarRef = useRef(null)
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const sendData = () => {
    try {
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

  return (
    <>
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
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>All Events ({currentEvents.length})</h2>
          <ul>{currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    </>
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

export default Sidebar
