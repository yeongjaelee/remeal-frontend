import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  function handlePlusClick() {
    setCount((c) => c + 1);
  }

  function handleMinusClick() {
    setCount((c) => c - 1);
  }

  return (
    <div>
      <button className="plus" onClick={handlePlusClick}></button>
      <div className="count">{count}</div>
      <button className="minus" onClick={handleMinusClick}></button>
    </div>
  );
}
