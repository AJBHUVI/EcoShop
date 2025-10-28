import { useEffect,useState } from "react";
interface message{
    id:number;
    firstName: string;
    lastName:string;
    email: string;
    subject: string;
    message: string;
    date: string;
}

function messages() {
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    fetch("/contact/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);
  
  return (
   <div className="mt-8">
  <h2 className="text-xl font-semibold mb-4">🗨️ Feedback Messages</h2>
  
  {messages.length === 0 ? (
    <p className="text-gray-500">No feedback yet.</p>
  ) : (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
        >
          <p>
            <strong>{msg.firstName} {msg.lastName}</strong>  
            <span className="text-sm text-gray-500"> ({msg.email})</span>
          </p>
          <p className="mt-1">
            <strong>Subject:</strong> {msg.subject}
          </p>
          <p className="mt-2">{msg.message}</p>
          <p className="text-xs text-gray-400 mt-2 text-right">
            {msg.date}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
);
}

export default messages;