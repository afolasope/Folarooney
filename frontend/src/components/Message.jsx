import React from 'react';

export default function Message({ message }) {
  return (
    <div
      className={`flex mb-2 ${
        message.sender === 'server' ? 'justify-start' : 'justify-end'
      }`}
    >
      <p
        className={`w-max max-w-[50vw] min-w-[25vw] p-2 whitespace-pre-line ${
          message.sender === 'server'
            ? 'bg-pink-300 rounded-r-lg rounded-bl-lg'
            : 'bg-blue-400 rounded-l-lg rounded-br-lg'
        }`}
      >
        {message.body}
      </p>
    </div>
  );
}
