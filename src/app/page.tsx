// Add this so we can import and use useState in react. https://nextjs.org/docs/app/api-reference/directives/use-client
'use client'

import Image from "next/image";
import React, {useState, useEffect, use} from "react";
import {AiOutlinePlus} from 'react-icons/ai'
import {FaRegTrashAlt, FaPencilAlt} from 'react-icons/fa'
import swal from 'sweetalert';
// Import our task component to use in main page
import Task from "./components/Task"
// Import our task interface for type checking
import {TaskInterface} from "./interfaces/Task";
// Import firebase database and functions
import {db} from "./firebase"
import {query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc} from "firebase/firestore"

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[1000px] m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 ml-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-100`,
  count: `text-center p-2`
}

export default function Home() {
  // Tasks is the current string array, setTasks is what we use to update
  // Set the type to be a taskInterface
  const [tasks, setTasks] = useState<TaskInterface[]>([])
  // Create a usestate for entering a new task and default to empty
  const [title, setTitle] = useState<string>("")
  // Create usestate for description
  const [description, setDescription] = useState<string>("")
  // Create usestate for deadline
  const [deadline, setDeadline] = useState<string>(() => {
    // Get current date as default in yyyy-mm-dd
    const date = new Date()
    return date.toISOString().slice(0, 10)
  })
  // Create a usestate for the task priority
  const [priority, setPriority] = useState<string>("low")
  // Create a usestate for the task status
  const [status, setStatus] = useState<string>("todo")

  // Create a usestate for the editbutton toggle
  const [editState, setEditState] = useState<string>("edit test")



  // Create task
  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    // Stops page from reloading
    e.preventDefault()

    // Check for title
    if (title === "") {
      swal("Enter a name for the task", "", "warning");
      // Old alert
      // alert("Enter a name for the task")
      return
    }

    // Add doc to tasks
    await addDoc(collection(db, "tasks"), {
      title: title,
      description: description,
      deadline: deadline,
      priority: priority,
      status: status,
      isEditing: false
      
    })
    // Reset all components
    setTitle("")
    setDescription("")
    setDeadline(() => {
      // Get current date as default
      const date = new Date()
      return date.toISOString().slice(0, 10)
    })
    setPriority("low")
    setStatus("todo")
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
      status: "completed"
    })
  }

  // Toggle task into edit mode
  const toggleEditTask = async (task: TaskInterface, title: string, description: string, deadline: string, priority: string, status: string) => {
    // Update the tasks information and the edit button toggle
    await updateDoc(doc(db, "tasks", task.id), {
      title: title,
      description: description,
      deadline: deadline,
      priority: priority,
      status: status,
      isEditing: !task.isEditing
    })
    }
  
  // Delete task
  const deleteTask = async (task: TaskInterface) => {
    
    swal({
      title: "Delete " + task.title,
      text: "Are you sure you want to delete this task?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        await deleteDoc(doc(db, "tasks", task.id))
      }
    });
    
    // Old alert
    // if (confirm("Are you sure you want to delete " + task.title + "?")) {
    //   await deleteDoc(doc(db, "tasks", task.id))
    // }
    
  }

  return (

    <div className={style.bg}>
      <div className={style.container}>
       <h3 className={style.heading}>Task Tracker</h3>
       <form className={style.form} onSubmit={createTask} >
         <input className={style.input} value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title"></input>
         <input className={style.input} value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Description"></input>
         <input className={style.input} value={deadline} onChange={(e) => setDeadline(e.target.value.toString())} type="date"></input>

         <fieldset>
         <legend>Priority Level</legend>
          <div>
            <input type="radio" id="low" value="low" name="priority" onChange={(e) => setPriority(e.target.value)} checked={priority === "low"} />
            <label htmlFor="low" >Low</label>
          </div>
          <div>
            <input type="radio" id="medium" value="medium" name="priority" onChange={(e) => setPriority(e.target.value)} checked={priority === "medium"} />
            <label htmlFor="medium" >Medium</label>
          </div>
          <div>
            <input type="radio" id="high" value="high" name="priority" onChange={(e) => setPriority(e.target.value)} checked={priority === "high"} />
            <label htmlFor="high" >High</label>
          </div>
         </fieldset>

         <fieldset>
         <legend>Status</legend>
          <div>
            <input type="radio" id="todo" value="todo" name="status" onChange={(e) => setStatus(e.target.value)} checked={status === "todo"} />
            <label htmlFor="todo" >To do</label>
          </div>
          <div>
            <input type="radio" id="in_progress" value="in_progress" name="status" onChange={(e) => setStatus(e.target.value)} checked={status === "in_progress"} />
            <label htmlFor="in_progress" >In Progress</label>
          </div>
          <div>
            <input type="radio" id="completed" value="completed" name="status" onChange={(e) => setStatus(e.target.value)} checked={status === "completed"} />
            <label htmlFor="completed" >Completed</label>
          </div>
         </fieldset>

         <button className={style.button}><AiOutlinePlus size={30}/></button>
       </form>
       <ul>
          {tasks.map((task, index) => (
            <Task key={index} task={task} toggleComplete={toggleComplete} toggleEditTask={toggleEditTask} deleteTask={deleteTask} />
            
          ))}
       </ul>
       {tasks.length < 1 ? null : <p className={style.count}>You have {tasks.length} tasks</p>}
    </div>
  </div>

  )
}