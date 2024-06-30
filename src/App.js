import { useEffect } from 'react';
import './App.css';
import {useTelegram} from "./hooks/useTelegram";
import header from "./components/Header/header";


function App() {
  const {onToggleButton, tg} = useTelegram()

  useEffect(() => {
    tg.ready();
  })


  return (
    <div className= "App">
      <header />
      <button onClick={onToggleButton}>toggle</button>
    </div>

  );
}

export default App;
