import PaystackPop from '@paystack/inline-js';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import Message from './components/Message';

const URL =
  import.meta.env.MODE === 'production' ? undefined : 'http://localhost:8000';

const socket = io(URL, {
  autoConnect: false,
});

export default function App() {
  const [cookies, setCookie] = useCookies(['deviceId']);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [userIsCheckingOut, setUserIsCheckingOut] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!cookies.deviceId)
      setCookie('deviceId', uuidv4(), { path: '/', maxAge: 2147483647 });

    const handleResponse = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const completeOrder = (orderId) => {
      socket.emit('command', { number: '96', orderId });
    };

    const handleCheckout = (data) => {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: data.email,
        amount: parseInt(data.total) * 100,
        metadata: {
          orderId: data.orderId,
        },
        channels: ['card'],
        callback: () => completeOrder(data.orderId),
        onCancel: () =>
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: 'server',
              body: 'You have cancelled the order.',
            },
          ]),
      });
    };

    getCachedMessages();
    socket.connect();
    socket.on('response', handleResponse);
    socket.on('checkout', handleCheckout);

    return () => {
      socket.off('response', handleResponse);
      socket.off('checkout', handleCheckout);
      socket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
    cacheMessages();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'client',
        body: text,
      },
    ]);

    if (text == '99') {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'server',
          body: 'Enter your email to checkout',
        },
      ]);
      setText('');
      setUserIsCheckingOut(!userIsCheckingOut);
      return;
    }

    if (userIsCheckingOut) {
      socket.emit('command', {
        number: '99',
        deviceId: cookies.deviceId,
        email: text,
      });
      setText('');
      setUserIsCheckingOut(!userIsCheckingOut);
      return;
    }

    socket.emit('command', { number: text, deviceId: cookies.deviceId });
    setText('');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const cacheMessages = () => {
    setTimeout(() => {
      sessionStorage.setItem('messages', JSON.stringify(messages));
    }, 500);
  };

  const getCachedMessages = () => {
    const cachedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];
    setMessages(cachedMessages);
  };

  return (
    <main className="w-screen h-screen px-5 py-2 flex flex-col gap-4">
      <header className="flex gap-5 items-center">
        <i className="fa-solid fa-user" />
        <div>
          <h1 className="">Folarooney</h1>
          <small>online</small>
        </div>
      </header>
      <div className="flex-1 overflow-y-scroll scrollbar-hide overscroll-auto">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        {userIsCheckingOut ? (
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="grow py-2 px-4 border border-blue-500 rounded-full outline-none"
          />
        ) : (
          <input
            type="text"
            pattern="[0-9]+"
            value={text}
            onChange={(e) =>
              setText(
                e.target.value
                  .replace(/[^0-9.]/g, '')
                  .replace(/(\..*)\./g, '$1')
              )
            }
            className="grow py-2 px-4 border border-blue-500 rounded-full outline-none"
          />
        )}
        <button type="submit">
          <i className="fa-solid fa-paper-plane bg-blue-500 p-4 rounded-full" />
        </button>
      </form>
    </main>
  );
}
