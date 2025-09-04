import logo from './logo.svg';
import './App.css';
import { useEffect, useRef,useState } from 'react';
import { io } from 'socket.io-client';
function App() {

  let [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      autoConnect: false,
    });

    setSocket(newSocket);
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);


  useEffect(() => {
    if (socket) {
    
      socket.on("connect", () => {
        console.log("✅ Connected to socket:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected from socket");
      });
    }
  }, [socket]);



  return (
    <>

    </>
  );
}

export default App;
