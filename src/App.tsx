import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery } from 'convex/react'
import type { FunctionReference } from 'convex/server'
import './App.css'

type Task = {
  _id: string
  title: string
  completed: boolean
  assignee?: string
}

function App() {
  const tasks = (useQuery('tasks:listTasks' as unknown as FunctionReference<'query'>) ??
    []) as Task[]
  const createTask = useMutation(
    'tasks:createTask' as unknown as FunctionReference<'mutation'>,
  )
  const updateTask = useMutation(
    'tasks:updateTask' as unknown as FunctionReference<'mutation'>,
  )
  const closeTask = useMutation(
    'tasks:closeTask' as unknown as FunctionReference<'mutation'>,
  )
  const deleteTask = useMutation(
    'tasks:deleteTask' as unknown as FunctionReference<'mutation'>,
  )
  const assignTask = useMutation(
    'tasks:assignTask' as unknown as FunctionReference<'mutation'>,
  )

  const [title, setTitle] = useState('')
  const [newAssignee, setNewAssignee] = useState('')
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [assignments, setAssignments] = useState<Record<string, string>>({})

  const openCount = tasks.filter((task) => !task.completed).length

  const onCreate = async (event: FormEvent) => {
    event.preventDefault()
    const nextTitle = title.trim()
    if (!nextTitle) return

    await createTask({
      title: nextTitle,
      assignee: newAssignee.trim() || undefined,
    })

    setTitle('')
    setNewAssignee('')
  }

  return (
    <main className="app">
      <h1>Convex Todo</h1>
      <p>{openCount} open tasks</p>

      <form className="create" onSubmit={onCreate}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          placeholder="Assignee (optional)"
          value={newAssignee}
          onChange={(event) => setNewAssignee(event.target.value)}
        />
        <button type="submit">Create task</button>
      </form>

      <ul className="tasks">
        {tasks.map((task) => {
          const editValue = edits[task._id] ?? task.title
          const assignValue = assignments[task._id] ?? task.assignee ?? ''

          return (
            <li key={task._id} className={task.completed ? 'closed' : ''}>
              <div className="task-main">
                <strong>{task.title}</strong>
                <span>{task.assignee ? `Assigned: ${task.assignee}` : 'Unassigned'}</span>
              </div>

              <div className="actions">
                <input
                  aria-label={`Update ${task.title}`}
                  value={editValue}
                  onChange={(event) =>
                    setEdits((current) => ({ ...current, [task._id]: event.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    updateTask({
                      id: task._id as never,
                      title: editValue,
                    })
                  }
                >
                  Update
                </button>
                <input
                  aria-label={`Assign ${task.title}`}
                  value={assignValue}
                  onChange={(event) =>
                    setAssignments((current) => ({
                      ...current,
                      [task._id]: event.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    assignTask({
                      id: task._id as never,
                      assignee: assignValue,
                    })
                  }
                >
                  Assign
                </button>
                <button type="button" onClick={() => closeTask({ id: task._id as never })}>
                  Close
                </button>
                <button type="button" onClick={() => deleteTask({ id: task._id as never })}>
                  Delete
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default App
