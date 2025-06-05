import React, { useEffect, useState } from 'react'

export default function Target({target}) {
const[count,setCount] = useState()
  useEffect(() => {
  let current = 0
  const duration = 2000;
  const steps = 40;

  const increment = target / steps;
  const interval = duration / steps;

const timer = setInterval( () => {current += increment   ;
  if(current>=target){
    clearInterval(timer)
setCount(target)
  }
else{
setCount(Math.ceil(current))

}},interval);

return () => clearInterval(timer)




},[target])
  return (
    <div>
      {count}
    </div>
  )
}
