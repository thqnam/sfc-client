import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [text, setText] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h4 style={{color: 'yellow'}}>Chào mừng anh Quang Nam đã đến với ReactJS. Bọn em đã đợi anh Nam rất lâu rồi, anh Nam biết không ?</h4>
        <h4 style={{color: 'yellow'}}>Chúc anh Nam sẽ luôn thành công trong sự nghiệp. Và sẽ cưới được người con gái mà anh Nam yêu thương</h4>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p>{text}</p>
      </header>
    </div>
  );
}

export default App;
