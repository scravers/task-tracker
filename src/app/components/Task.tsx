import React, { useState } from 'react'
import {FaRegTrashAlt, FaPencilAlt, FaCheck} from 'react-icons/fa'

// Import our task interface for type checking
import {TaskInterface} from "../interfaces/Task";
import { todo } from 'node:test';

const style = {
  li: ` bg-slate-200 p-4 my-2`,
  row: `flex`,
  input: `border p-1 ml-2 w-full text-xl max-w-[200px]`,
  text_small: `ml-2 resize-y min-w-[100px]`,
  text_medium: `ml-2 resize-y max-w-[150px]`,
  text_large: `ml-2 resize-y w-full max-w-[500px]`,
  button: `cursor-pointer flex items-center p-2`,
  greenCircle: `w-6 h-6 bg-green-500 rounded-full mr-2 inline-block`,
  yellowCircle: `w-6 h-6 bg-yellow-300 rounded-full mr-2 inline-block`,
  redCircle: `w-6 h-6 bg-red-500 rounded-full mr-2 inline-block`
}

// Need to have checkmark button press send up the changed information to a function to change in db

// Type safety
const Task = ({task, editTask, deleteTask}: {task: TaskInterface, editTask: Function, deleteTask: Function}) => {

  // Use states for editing info set to original title
  const [title, editTitle] = useState<string>(task.title)
  const [desc, editDesc] = useState<string>(task.description)
  const [deadline, editDeadline] = useState<string>(task.deadline)
  const [priority, editPriority] = useState<string>(task.priority)
  const [status, editStatus] = useState<string>(task.status)




  return (
    <li className={style.li}>
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
            id="low_edit" 
            value="low" 
            name="priority_edit" 
            onChange={(e) => editPriority(e.target.value)} 
            checked={priority === "low"} >
            </input>
            <label 
            htmlFor="low_edit" 
            > Low
            </label>
          </div>

          {/* Medium */}
          <div>
            <input 
            type="radio" 
            id="medium_edit" 
            value="medium" 
            name="priority_edit" 
            onChange={(e) => editPriority(e.target.value)} 
            checked={priority === "medium"} >
            </input>
            <label 
            htmlFor="medium_edit" 
            > Medium
            </label>
          </div>

          {/* High */}
          <div>
            <input 
            type="radio" 
            id="high_edit" 
            value="high" 
            name="priority_edit" 
            onChange={(e) => editPriority(e.target.value)} 
            checked={priority === "high"} >
            </input>
            <label 
            htmlFor="high_edit" 
            > High
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
            id="todo_edit" 
            value="todo" 
            name="status_edit" 
            onChange={(e) => editStatus(e.target.value)} 
            checked={status === "todo"} >
            </input>
            <label 
            htmlFor="todo_edit" 
            >To Do
            </label>
          </div>

          {/* In Progress */}
          <div>
            <input 
            type="radio" 
            id="in_progress_edit" 
            value="in_progress" 
            name="status_edit" 
            onChange={(e) => editStatus(e.target.value)} 
            checked={status === "in_progress"} >
            </input>
            <label 
            htmlFor="in_progress_edit" 
            > In Progress
            </label>
          </div>

          {/* Completed */}
          <div>
            <input 
            type="radio" 
            id="completed_edit" 
            value="completed" 
            name="status_edit" 
            onChange={(e) => editStatus(e.target.value)} 
            checked={status === "completed"} >
            </input>
            <label 
            htmlFor="completed_edit" 
            >Completed
            </label>
          </div>
         </fieldset>

        </div>
      :
        <div className={style.row}>
          {/* Title */}
          <p 
            className={style.text_small}
            >{task.title}
          </p>

          {/* Desc */}
          <p 
            className={style.text_large}
            > {task.description}
          </p>

          {/* Deadline */}
          <p 
            className={style.text_medium}
            > Deadline: {task.deadline}
          </p>

          {/* Priority */}
          <p 
            className={style.text_small}
            >{task.priority == "low" ? <>Low Priority</> : task.priority == "medium" ? <>Medium Priority</> : <>High Priority</>}
          </p>

          {/* Status */}
          <p 
            className={style.text_small}
            >{task.status == "todo" ? <span className={style.redCircle}></span> : task.status == "in_progress" ? <span className={style.yellowCircle}></span> : <span className={style.greenCircle}></span>}
          </p>

        </div>
      }
      { /* Send up the task that was toggled, as well as send up the information in the usestates to update the task*/ }
      <div className="flex justify-end">
        <button className={style.button} onClick={() => editTask(task, title, desc, deadline, priority, status)}> {task.isEditing ? <FaCheck /> : <FaPencilAlt />} </button>
        <button className={style.button} onClick={() => deleteTask(task)}>{<FaRegTrashAlt />}</button>
      </div>
    </li>
  )
}

export default Task