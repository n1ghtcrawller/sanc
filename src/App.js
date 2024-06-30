import { useEffect } from 'react';
import './App.css';
import {useTelegram} from "./hooks/useTelegram";
import Header from "./components/Header/Header";


function App() {
  const {onToggleButton, tg} = useTelegram()

  useEffect(() => {
    tg.ready();
  })


  return (
    <div className= "App">
      <Header />
        <div>
      <button onClick={onToggleButton}>toggle</button>
        </div>
    </div>

  );
}

export default App;
