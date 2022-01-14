import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

//Noteオブジェクトの型を用意する
type Todo = {
  id: string
  isCompleted: Boolean
  title: string
  startDate: Date
  endDate: Date
  timestamp: Date
}

//todosReducerが受けるaction
export type TodosState = {
  todos: Todo[]
}

const initialState: TodosState = {
  todos: [],
}

const todosSlice = createSlice({
  name: 'todos',
  initialState: initialState,
  reducers: {
    //action名：その処理　を定義する
    add: (state, action: PayloadAction<Todo>) => {
      console.log('action:', action)

      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: nanoid(),
            title: action.payload.title,
            isCompleted: action.payload.isCompleted,
            startDate: action.payload.startDate.toString(),
            endDate: action.payload.endDate.toString(),
            timestamp: action.payload.timestamp.toString(),
          },
        ],
      }
    },

    remove: (state, action: PayloadAction<string>) => {
      return { ...state, todos: state.todos.filter((note) => note.id != action.payload) }
    },

    reset: (state, action: PayloadAction<string>) => initialState,
  },
})

export default todosSlice
