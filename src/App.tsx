import { useEffect, useState } from "react";
import init, { InitOutput } from "./lib/hello_world";
import wasmUrl from "./assets/hello_world_bg.wasm?url";

function App() {
  const [wasm, setWasm] = useState<InitOutput | null>(null);
  const [a, setA] = useState("0");
  const [b, setB] = useState("0");
  const [sum, setSum] = useState(0);

  const wasmGreet = () => {
    if (wasm === null) return;

    wasm.greet();
  };

  useEffect(() => {
    if (wasm === null) return;

    // sanitize inputs
    const numA = Number(a);
    const numB = Number(b);
    if (isNaN(numA) || isNaN(numB)) {
      setSum(NaN);
      return;
    }

    const result = wasm.add(numA, numB);
    // calculate sum
    setSum(result);
  }, [a, b]);

  useEffect(() => {
    const initWasm = async () => {
      const module = await init(wasmUrl);
      setWasm(module);
    };
    initWasm();
  }, []);

  return (
    <>
      <h1>WASM Test</h1>
      <div>Module Ready: {wasm !== null ? "Yes" : "No"}</div>
      <div>
        A:{" "}
        <input
          type="number"
          value={a}
          disabled={!wasm}
          onChange={(e) => setA(e.target.value)}
        />
        <br />
        B:{" "}
        <input
          type="number"
          value={b}
          disabled={!wasm}
          onChange={(e) => setB(e.target.value)}
        />
        <br />
        <br />
        Sum: {sum}
      </div>
      <div>
        <button onClick={wasmGreet}>Call JS from Wasm</button>
      </div>
    </>
  );
}

export default App;
