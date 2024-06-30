import { useEffect } from 'react';
import './App.css';


function App() {
  useEffect(() => {
    tg.ready();
  })


  return (
    <div className= "App">
      <div>Приложение работает</div>
      <button onClick={onClose}>Закрыть</button>
    </div>

  );
}

export default App;
