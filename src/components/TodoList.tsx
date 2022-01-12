import { collection, onSnapshot, orderBy, query, where } from '@firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../Auth'
import { useState, useEffect } from 'react'
import Todo from '../components/Todo'

const TodoList = ({ todosProps, handleToggleModal }: any) => {
  const [todos, setTodos] = useState([])
  const { currentUser } = useAuth()
  useEffect(() => {
    setTodos(JSON.parse(todosProps))
  }, [todosProps])

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

  return (
    <div>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          id={todo.id}
          title={todo.title}
          isCompleted={todo.isCompleted}
          startDate={todo.startDate}
          endDate={todo.endDate}
          timestamp={todo.timestamp}
          handleToggleModal={handleToggleModal}
        />
      ))}
    </div>
  )
}

export default TodoList
