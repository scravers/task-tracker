// Add this so we can import and use useState in react. https://nextjs.org/docs/app/api-reference/directives/use-client
'use client'

import Image from "next/image";
import React, {useState, useEffect, use, ButtonHTMLAttributes} from "react";
import {FaExclamation, FaPlus, FaRegCalendarAlt, FaSyncAlt, FaTextHeight} from 'react-icons/fa'
import swal from 'sweetalert';
// Import our task component to use in main page
import Task from "./components/Task"
// Import our task interface for type checking
import {TaskInterface} from "./interfaces/Task";
// Import firebase database and functions
import {db} from "./firebase"
import {query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc} from "firebase/firestore"

const style = {
  bg: `min-h-screen w-screen p-4 bg-gradient-to-r from-[#0078E8] to-[#93C9FE]`,
  container: `bg-slate-100 max-w-[1000px] m-auto rounded-md shadow-xl p-4`,
  sort_container: `bg-slate-100 max-w-[1000px] pt-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between items-start`,
  input: `border p-1 ml-2 w-full text-xl max-w-[200px]`,
  tooltip: `absolute mb-2 w-30 p-2 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity`,
  fieldset: `flex flex-col space-y-2`,
  button: `border p-4 ml-2 bg-purple-100 group`,
  sort_button: `border p-4 ml-2 bg-green-100 group`,
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

  // Create task
  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    // Stops page from reloading
    e.preventDefault()
    console.log(tasks);

    // Check for title
    if (title === "") {
      swal("Enter a name for the task", "", "warning");
      // Old alert
      // alert("Enter a name for the task")
      return
    }

    // Add task to a document
    await addDoc(collection(db, "tasks"), {
      title: title,
      description: description,
      deadline: deadline,
      priority: priority,
      status: status,
      isEditing: false
      
    })
    // Reset all parameters
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
  // Once on first run
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
      // Sort by title by default
      tasksArr.sort((a, b) => a.title.localeCompare(b.title))
      // Set the tasks using the useStatehook
      setTasks(tasksArr)
    })
    return() => unsubscribe()

  // Run once after first render
  }, [])

  // Update task
  // Async so we dont pause the application
  const sortByTitle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Need to update a copy of array for react to notice
    setTasks([...tasks].sort((a, b) => a.title.localeCompare(b.title)))
  }

  const sortByDeadline = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setTasks([...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline)))
  }

  const sortByPriority = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Sort order
    const priority_order = { low: 3, medium: 2, high: 1 };
    setTasks([...tasks].sort((a, b) => priority_order[a.priority] - priority_order[b.priority]))
  }

  const sortByStatus = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Sort order
    const status_order = { todo: 1, in_progress: 2, completed: 3 };
    setTasks([...tasks].sort((a, b) => status_order[a.status] - status_order[b.status]))
  }

  // Toggle task into edit mode
  // Async so we dont pause the application
  const editTask = async (task: TaskInterface, id: string, title: string, description: string, deadline: string, priority: string, status: string) => {

    let count = 0
    let id_being_edited = ""
    // Check if any other tasks are currently being edited
    tasks.forEach(item => {
      if (item.isEditing === true) {
        count++
        id_being_edited = item.id
      }
    });

    if (count === 0) {
      await updateDoc(doc(db, "tasks", task.id), {
        isEditing: true
      })
      return
    }
    // Make sure there are non being edited and its the correct id
    else if (count === 1 && id_being_edited == id) {
      await updateDoc(doc(db, "tasks", task.id), {
        title: title,
        description: description,
        deadline: deadline,
        priority: priority,
        status: status,
        isEditing: false
      })
    }
    else {
      swal("Save changes before making new edit", "", "warning")
      return
    }
    
    // // Make sure there are non being edited or the current task is in edit mode already
    // if (task.isEditing) {
    //   console.log("Updates?");
    //   // Update the tasks information and the edit button toggle
    //   await updateDoc(doc(db, "tasks", task.id), {
    //     title: title,
    //     description: description,
    //     deadline: deadline,
    //     priority: priority,
    //     status: status,
    //     isEditing: false
    //   })
    // }
    // else {
    //   
    // }

  }

  // Delete task
  const deleteTask = async (task: TaskInterface) => {
    // https://github.com/t4t5/sweetalert
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
    })
    
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
         <input 
            className={style.input} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            type="text" placeholder="Title"
            >
          </input>
          <input 
            className={style.input} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            type="text" placeholder="Description"
            >
          </input>
          <input 
            className={style.input} 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value.toString())} 
            type="date"
            >
          </input>

         <fieldset className={style.fieldset}>
         <legend>Priority Level</legend>
          <div>
            <input 
              className="cursor-pointer"
              type="radio" 
              id="low" 
              value="low" 
              name="priority" 
              onChange={(e) => setPriority(e.target.value)} 
              checked={priority === "low"}
              >
            </input>
            <label
              className="cursor-pointer"
              htmlFor="low" 
              > Low
            </label>
          </div>

          <div>
            <input 
              className="cursor-pointer"
              type="radio" 
              id="medium" 
              value="medium" 
              name="priority" 
              onChange={(e) => setPriority(e.target.value)} 
              checked={priority === "medium"}
              >
            </input>
            <label 
              className="cursor-pointer"
              htmlFor="medium" 
              > Medium
            </label>
          </div>

          <div>
            <input
              className="cursor-pointer"
              type="radio" 
              id="high" 
              value="high" 
              name="priority" 
              onChange={(e) => setPriority(e.target.value)} 
              checked={priority === "high"}
              >
            </input>
            <label 
              className="cursor-pointer"
              htmlFor="high" 
              > High
            </label>
          </div>
         </fieldset>

         <fieldset className={style.fieldset}>
         <legend>Status</legend>
          <div>
            <input 
              className="accent-red-400 cursor-pointer"
              type="radio" 
              id="todo" 
              value="todo" 
              name="status" 
              onChange={(e) => setStatus(e.target.value)} 
              checked={status === "todo"}
              >
            </input>
            <label 
              className="cursor-pointer"
              htmlFor="todo" 
              > To do
            </label>
          </div>

          <div>
            <input 
              className="accent-yellow-300 cursor-pointer"
              type="radio" 
              id="in_progress" 
              value="in_progress" 
              name="status" 
              onChange={(e) => setStatus(e.target.value)} 
              checked={status === "in_progress"}
              >
            </input>
            <label 
              className="cursor-pointer"
              htmlFor="in_progress" 
              > In Progress
            </label>
          </div>

          <div>
            <input 
              className="accent-green-500 cursor-pointer"
              type="radio" 
              id="completed" 
              value="completed" 
              name="status" 
              onChange={(e) => setStatus(e.target.value)} 
              checked={status === "completed"}
              >
            </input>
            <label 
              className="cursor-pointer"
              htmlFor="completed" 
              > Completed
            </label>
          </div>
         </fieldset>

         <button 
          className={style.button}
          ><FaPlus size={16}/>
          <span 
            className={style.tooltip}
            > Add Task
          </span>
        </button>
      </form>

      <div className={style.sort_container}>
        <button 
          className={style.sort_button} 
          onClick={sortByTitle} ><FaTextHeight size={16}/>
          <span 
            className={style.tooltip}
            > Sort by Title
          </span>
        </button>

        <button 
          className={style.sort_button} 
          onClick={sortByDeadline} ><FaRegCalendarAlt size={16}/>
          <span 
            className={style.tooltip}
            > Sort by Deadline
          </span>
        </button>

        <button 
          className={style.sort_button} 
          onClick={sortByPriority} ><FaExclamation size={16}/>
          <span 
            className={style.tooltip}
            > Sort by Priority
          </span>
        </button>

        <button 
          className={style.sort_button} 
          onClick={sortByStatus} ><FaSyncAlt size={16}/>
          <span 
            className={style.tooltip}
            > Sort by Status
          </span>
        </button>
      </div>

       <ul>
          {tasks.map((task, index) => (
            <Task 
              key={index} 
              task={task} 
              editTask={editTask} 
              deleteTask={deleteTask}
            />
          ))}
       </ul>

        {tasks.length < 1 ? 
          null
        : 
          <p 
          className={style.count}
          >You have {tasks.length} tasks
          </p>
        }
    </div>
  </div>

  )
}