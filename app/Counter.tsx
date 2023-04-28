'use client';
import { useState } from "react";
import type {RootSate} from "./GlobalRedux/store";
import {useSelector, useDispatch} from "react-redux";
import { increment, decrement, incrementByAmount} from "./GlobalRedux/Features/counterSlice";

export default function Counter() {
    const vain = useSelector((state:RootSate)=>state.counter.value);
    const dispatch = useDispatch();
  const [count, setCount] = useState(0);

  function handlePlusClick() {
    setCount((c) => c + 1);
  }

  function handleMinusClick() {
    setCount((c) => c - 1);
  }

  return (
    <div>
      {/*<button className="plus" onClick={handlePlusClick}></button>*/}
      {/*<div className="count">{count}</div>*/}
      {/*<button className="minus" onClick={handleMinusClick}></button>*/}
        <button onClick={()=>dispatch(increment())}>
            Increment
        </button>
        <span>{vain}</span>
        <button onClick={()=>dispatch(decrement())}>
            Decrement
        </button>
        <button onClick={()=>dispatch(incrementByAmount(2))}>
            Increment by 2
        </button>
    </div>
  );
}
