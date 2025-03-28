// Add this so we can import and use useState in react. https://nextjs.org/docs/app/api-reference/directives/use-client
'use client'

import Image from "next/image";
import React, {useState} from "react";
import {AiOutlinePlus} from 'react-icons/ai'
// Import our task component to use in main page
import Task from "./components/Task"

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
  const [tasks, setTasks] = useState(["Learn React", "Leetcode"])
  return (

    <div className={style.bg}>
      <div className={style.container}>
       <h3 className={style.heading}>Task Tracker</h3>
       <form className={style.form}>
         <input className={style.input} type="text" placeholder="Add Task"></input>
         <button className={style.button}><AiOutlinePlus size={30}/> Add </button>
       </form>
       <ul>
          {tasks.map((task, index) => (
            <Task key={index} task={task} />
          ))}
       </ul>
       <p className={style.count}>You have 2 tasks</p>
    </div>
  </div>

  )
}