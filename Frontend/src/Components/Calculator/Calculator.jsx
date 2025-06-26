import React, { useState } from "react";
import { evaluate } from 'mathjs';
import "./Calculator.css";


export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    if (value === "=") {
      try {
        if (input) {
        const evalResult = evaluate(input);
          setInput(evalResult.toString());
          setResult("");
        }
      } catch {
        setResult("err");
      }
    } else if (value === "c") {
      setInput("");
      setResult("");
    } else if (value === "clr") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setResult("");
      setInput((prev) => prev + value);
    }
  };

  return (
    <div className="calculatorWrapper">
    <section id="calculator">
      <h1>Calculator</h1>

      <div className="calculator-top">
        <div className="screen">
          <h2>{result || input || "0"}</h2>
        </div>

        <div className="clear">
          <button onClick={() => handleClick("c")}>Clear</button>
          <button onClick={() => handleClick("clr")}>Back</button>
        </div>
      </div>

      <div className="calculator-bottom">
        <div className="key-wrapper">
          {[
            ["7", "8", "9", "/"],
            ["4", "5", "6", "*"],
            ["1", "2", "3", "-"],
            ["0", ".", "=", "+"],
          ].map((row, idx) => (
            <div className="button-row" key={idx}>
              {row.map((btn) => (
                <button key={btn} onClick={() => handleClick(btn)}>
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
