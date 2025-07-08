import { useEffect, useState } from "react";
import { getAnimals } from "./domains/animals/api/animalApi";

function App() {
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getAnimals().then((data) => {
      setInstruments(data.data);
    });
  }, []);

  return (
    <>
      <ul className="flex flex-col gap-2 text-2xl">
        {instruments.map((instrument) => (
          <li key={instrument.name} className="text-red-500">
            {instrument.name}
          </li>
        ))}
        ??
      </ul>
      <div className="text-2xl">안녕</div>
    </>
  );
}

export default App;
