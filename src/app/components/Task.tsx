import React from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
// Import our task interface for type checking
import {TaskInterface} from "../interfaces/Task";

const style = {
  li: `flex justify-between bg-slate-200 p-4 my-2 capitalize`,
  liComplete: `flex justify-between bg-slate-400 p-4 my-2 capitalize`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`
}

// Type safety. Key is not passed
const Task = ({task, toggleComplete, deleteTask}: {task: TaskInterface, toggleComplete: Function, deleteTask: Function}) => {

  return (
    <li className={task.completed ? style.liComplete : style.li}>
      <div className={style.row}>
        <input type="checkbox" onChange={() => toggleComplete(task)} checked={task.completed ? true : false}></input>
        <p className={task.completed ? style.textComplete : style.text} onClick={() => toggleComplete(task)}>{task.title}</p>
      </div>
      <button className={style.button} onClick={() => deleteTask(task.id)}>{<FaRegTrashAlt />}</button>
    </li>
  )
}

export default Task