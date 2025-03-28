// Add this so we can import and use useState in react. https://nextjs.org/docs/app/api-reference/directives/use-client
'use client'

import Image from "next/image";
import React, {useState, useEffect, use} from "react";
import {AiOutlinePlus} from 'react-icons/ai'
// Import our task component to use in main page
import Task from "./components/Task"
// Import our task interface for type checking
import {TaskInterface} from "./interfaces/Task";
// Import firebase database and functions
import {db} from "./firebase"
import {query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc} from "firebase/firestore"

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-100`,
  count: `text-center p-2`
}

export default function Home() {
  // Tasks is the current string array, setTasks is what we use to update
  // Set the type to be a task
  const [tasks, setTasks] = useState<TaskInterface[]>([])
  // Create a usestate for entering a new task and default to empty
  const [input, setInput] = useState<string>("")

  // Create task
  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    // Stops page from reloading
    e.preventDefault()

    // Check for name
    if (input === "") {
      alert("Enter a name for the task")
      return
    }

    // Add doc to tasks
    await addDoc(collection(db, "tasks"), {
      text: input,
      completed: false
    })
    setInput("")
  }

  // Read task
  useEffect(()=>{
    // Return a query of the tasks collection in the database
    const q = query(collection(db, "tasks"))
    // Take snapshot of the current database
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Empty array to hold tasks
      let tasksArr: TaskInterface[] = []
      // Iterate over each doc in the snapshot of the database
      querySnapshot.forEach((doc) => {
        // Push data to the tasksArr with the document id from the db, and assert the type as a Task
        tasksArr.push({...doc.data(), id: doc.id} as TaskInterface)
      });
      // Set the tasks using the useStatehook
      setTasks(tasksArr)
    })
    return() => unsubscribe()

  // Run once after first render
  }, [])
  // Update task
  // Async so we dont pause the application
  const toggleComplete = async (task: TaskInterface) => {
  // Await to pause until complete
    await updateDoc(doc(db, "tasks", task.id), {
      // Toggle boolean
      completed: !task.completed
    })
  }
  // Delete task

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id))
  }

  return (

    <div className={style.bg}>
      <div className={style.container}>
       <h3 className={style.heading}>Task Tracker</h3>
       <form className={style.form} onSubmit={createTask} >
         <input className={style.input} value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Add Task"></input>
         <button className={style.button}><AiOutlinePlus size={30}/></button>
       </form>
       <ul>
          {tasks.map((task, index) => (
            <Task key={index} task={task} toggleComplete={toggleComplete} deleteTask={deleteTask} />
          ))}
       </ul>
       {tasks.length < 1 ? null : <p className={style.count}>You have {tasks.length} tasks</p>}
    </div>
  </div>

  )
}