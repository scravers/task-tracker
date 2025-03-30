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


  return (
    <li className={task.status === "completed" ? style.liComplete : style.li} id="test">
      <div className={style.row}>
        <input type="checkbox" onChange={() => toggleComplete(task)} checked={task.status === "completed" ? true : false}></input>

        {
        // Check if the task is currently being edited, if it is then change the title to a text field
        task.isEditing ? 
          <input 
            className={style.input} 
            onChange={(e) => editTitle(e.target.value)} 
            value={title} 
            type="text" 
            placeholder="New Title" 
            >
          </input> 
        :
          <p 
            className={style.text}
            onClick={() => toggleComplete(task)}
            >{task.title}
          </p>
        }
      </div>
      { /* Send up the task that was toggled, as well as send up the information in the usestates to update the task*/ }
      <button className={style.button} onClick={() => toggleEditTask(task, title)}> {task.isEditing ? <FaCheck /> : <FaPencilAlt />} </button>
      <button className={style.button} onClick={() => deleteTask(task.id)}>{<FaRegTrashAlt />}</button>
    </li>
  )
}

export default Task