import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Message = {
  sender_id: number;
  receiver_id: number;
  message: string;
};

const Chat = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const userId = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();
  const receiverId = 2;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const ws = new WebSocket("ws://localhost:5001");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send(JSON.stringify({ type: "register", user_id: userId }));
    };

    ws.onmessage = (event) => {
      console.log("Received message:" + JSON.stringify(event.data));
      const receivedMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, receivedMessage]);
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, navigate]);

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      const newMessage = { sender_id: userId, receiver_id: receiverId, message };
      socket.send(JSON.stringify(newMessage)); 
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto border p-4 rounded-lg shadow-lg">
      <div className="h-64 overflow-y-auto w-full flex flex-col border-b p-2">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex w-full ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
          >
            <div className={`p-2 my-1 rounded-lg w-fit max-w-[80%] ${msg.sender_id === userId ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r-lg">Send</button>
      </div>
    </div>
  );
};

export default Chat;
