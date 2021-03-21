import React from 'react';
import './ChatPage.scss';
import ChatList from './components/ChatList';

export default function ChatPage() {
  return (
    <div className="chat-page">
      <ChatList />
    </div>
  );
}
