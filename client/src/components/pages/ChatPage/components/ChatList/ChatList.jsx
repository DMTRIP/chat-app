import React from 'react';
import './ChatList.scss';
import SearchIcon from './SearchIcon';
import person1 from './person-1.jpeg';

export default function ChatList() {
  return (
    <div className="chat-list">
      <div className="chat-list__search">
        <div className="chat-list__search-icon">
          <SearchIcon />
        </div>
        <input className="chat-list__input" placeholder="Search"></input>
      </div>

      <div className="chat-list__divider"></div>

      <div className="chat-list__chats">
        <div className="chat-list__chat">
          <div className="chat-list__status"></div>
          <div className="chat-list__avatar">
            <div className="chat-list__underline"></div>
            <div className="chat-list__cropper">
              <img src={person1} alt="" />
            </div>
            <div className="chat-list__underline"></div>
          </div>
          <div className="chat-list__text">
            <div className="chat-list__name">Matt Thompson</div>
            <div className="chat-list__message">
              Thanks again you have been...
            </div>
          </div>
          <div className="chat-list__footer">
            <p className="chat-list__actions">...</p>
            <div className="chat-list__time">5 min</div>
          </div>
        </div>
        <div className="chat-list__chat chat-list__chat--active">
          <div className="chat-list__avatar">
            <div className="chat-list__underline"></div>
            <div className="chat-list__cropper">
              <img src={person1} alt="" />
            </div>
            <div className="chat-list__underline"></div>
          </div>
          <div className="chat-list__text">
            <div className="chat-list__name">Matt Thompson</div>
            <div className="chat-list__message">
              Thanks again you have been...
            </div>
          </div>
          <div className="chat-list__footer">
            <p className="chat-list__actions">...</p>
            <div className="chat-list__time chat-list__time--active">5 min</div>
          </div>
        </div>
        <div className="chat-list__chat">
          <div className="chat-list__avatar">
            <div className="chat-list__underline"></div>
            <div className="chat-list__cropper">
              <img src={person1} alt="" />
            </div>
            <div className="chat-list__underline"></div>
          </div>
          <div className="chat-list__text">
            <div className="chat-list__name">Matt Thompson</div>
            <div className="chat-list__message">
              Thanks again you have been...
            </div>
          </div>
          <div className="chat-list__footer">
            <p className="chat-list__actions">...</p>
            <div className="chat-list__time">5 min</div>
          </div>
        </div>
      </div>
    </div>
  );
}
