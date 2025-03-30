import React, { useState } from 'react'
import {FaRegTrashAlt, FaPencilAlt, FaCheck} from 'react-icons/fa'

// Import our task interface for type checking
import {TaskInterface} from "../interfaces/Task";

const style = {
  li: `flex justify-between bg-slate-200 p-4 my-2 capitalize`,
  liComplete: `flex justify-between bg-slate-400 p-4 my-2 capitalize`,
  row: `flex`,
  input: `border p-2 ml-2 w-full text-xl`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`
}

// Need to have checkmark button press send up the changed information to a function to change in db

// Type safety
const Task = ({task, toggleComplete, toggleEditTask, deleteTask}: {task: TaskInterface, toggleComplete: Function, toggleEditTask: Function, deleteTask: Function}) => {

  // Use states for editing info set to original title
  const [title, editTitle] = useState<string>(task.title)
  const [desc, editDesc] = useState<string>(task.description)
  const [deadline, editDeadline] = useState<string>(task.deadline)
  const [priority, editPriority] = useState<string>(task.priority)
  const [status, editStatus] = useState<string>(task.status)


  return (
    <li className={task.status === "completed" ? style.liComplete : style.li} id="test">
      {
      // Check if the task is currently being edited, if it is change the items displayed
      task.isEditing ? 
        <div className={style.row}>
          {/* Title */}
          <input 
            className={style.input} 
            onChange={(e) => editTitle(e.target.value)} 
            value={title} 
            type="text" 
            placeholder="New Title" 
            >
          </input>

          {/* Desc */}
          <input 
            className={style.input} 
            onChange={(e) => editDesc(e.target.value)} 
            value={desc} 
            type="text" 
            placeholder="New Desc" 
            >
          </input> 

          {/* Deadline */}
          <input 
            className={style.input} 
            onChange={(e) => editDeadline(e.target.value)} 
            value={deadline} 
            type="date" 
            >
          </input> 

          {/* Priority */}
          <fieldset>
            <legend>Priority Level
            </legend>
          {/* Low */}
          <div>
            <input 
            type="radio" 
            id="low" 
            value="low" 
            name="priority" 
            onChange={(e) => editPriority(e.target.value)} 
            checked={priority === "low"} >
            </input>
            <label 
            htmlFor="low" 
            >Low
            </label>
          </div>

          {/* Medium */}
          <div>
            <input 
            type="radio" 
            id="medium" 
            value="medium" 
            name="priority" 
            onChange={(e) => editPriority(e.target.value)} 
            checked={priority === "medium"} >
            </input>
            <label 
            htmlFor="medium" 
            >Medium
            </label>
          </div>

          {/* High */}
          <div>
            <input 
            type="radio" 
            id="high" 
            value="high" 
            name="priority" 
            onChange={(e) => editPriority(e.target.value)} 
            checked={priority === "high"} >
            </input>
            <label 
            htmlFor="high" 
            >High
            </label>
          </div>
         </fieldset>

          {/* Status */}
          <fieldset>
            <legend>Status
            </legend>
          {/* To Do */}
          <div>
            <input 
            type="radio" 
            id="todo" 
            value="todo" 
            name="status" 
            onChange={(e) => editStatus(e.target.value)} 
            checked={status === "todo"} >
            </input>
            <label 
            htmlFor="todo" 
            >To Do
            </label>
          </div>

          {/* In Progress */}
          <div>
            <input 
            type="radio" 
            id="in_progress" 
            value="in_progress" 
            name="status" 
            onChange={(e) => editStatus(e.target.value)} 
            checked={status === "in_progress"} >
            </input>
            <label 
            htmlFor="in_progress" 
            >In Progress
            </label>
          </div>

          {/* Completed */}
          <div>
            <input 
            type="radio" 
            id="completed" 
            value="completed" 
            name="status" 
            onChange={(e) => editStatus(e.target.value)} 
            checked={status === "completed"} >
            </input>
            <label 
            htmlFor="completed" 
            >Completed
            </label>
          </div>
         </fieldset>

        </div>
      :
        <div className={style.row}>
          {/* Title */}
          <p 
            className={style.text}
            // Could remove this too
            onClick={() => toggleComplete(task)}
            >{task.title}
          </p>

          {/* Desc */}
          <p 
            className={style.text}
            >{task.description}
          </p>

          {/* Deadline */}
          <p 
            className={style.text}
            >{task.deadline}
          </p>

          {/* Priority */}
          <p 
            className={style.text}
            >{task.priority}
          </p>

          {/* Status */}
          <p 
            className={style.text}
            >{task.status}
          </p>

        </div>
      }
      { /* Send up the task that was toggled, as well as send up the information in the usestates to update the task*/ }
      <button className={style.button} onClick={() => toggleEditTask(task, title, desc, deadline, priority, status)}> {task.isEditing ? <FaCheck /> : <FaPencilAlt />} </button>
      <button className={style.button} onClick={() => deleteTask(task.id)}>{<FaRegTrashAlt />}</button>
    </li>
  )
}

export default Task