import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { initializeSocket, recieveMessage, sendMessage } from '../config/socket';
import { UserContext } from '../context/user.context';
import Markdown from 'markdown-to-jsx';

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState(location.state?.project);
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageBoxRef = useRef(null);

  const addCollaborators = () => {
    axios
      .put("/api/v1/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        setIsModalOpen(false);
        const updatedUsers = [...projects.users, ...selectedUserId.map(id => users.find(user => user._id === id))];
        setProjects(prevProjects => ({
          ...prevProjects,
          users: updatedUsers,
        }));
      })
      .catch(console.error);
  };

  const send = () => {
    if (message.trim()) {
      sendMessage('project-message', {
        message,
        sender: user
      });
      setMessage('');
      setMessages(prevMessages => [...prevMessages, { message, sender: user, outgoing: true }]);
    }
  };

  useEffect(() => {
    if (!projects._id) return;
  
    initializeSocket(projects._id);
  
    const handleMessage = (data) => {
      setMessages(prev => {
        if (prev.some(msg => msg.message === data.message && msg.sender._id === data.sender._id)) {
          return prev;
        }
        return [...prev, { ...data, outgoing: false }];
      });
    };
  
    recieveMessage('project-message', handleMessage);
  
    return () => {
      // Properly remove the event listener
      recieveMessage('project-message', handleMessage);
    };
  }, [projects._id]);
  
  useEffect(() => {
    axios.get(`/api/v1/projects/get-project/${projects._id}`)
      .then(res => setProjects(res.data.data))
      .catch(console.error);

    axios.get('/api/v1/users/all-user', { headers: { 'Cache-Control': 'no-cache' } })
      .then(res => setUsers(Array.isArray(res.data.data) ? res.data.data : []))
      .catch(console.error);
  }, [projects._id]);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserClick = (id) => {
    setSelectedUserId(prev => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };
  return (
    <main className="h-screen w-screen flex">
      <section className="left relative h-full flex flex-col min-w-96">
        <header className="flex justify-between items-center p-2 px-4 max-w-full bg-emerald-200">
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button onClick={() => setIsSidepanelOpen(!isSidepanelOpen)} className="p-2">
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex-grow flex flex-col gap-2 py-2 px-2 relative">
          <div
            ref={messageBoxRef}
            className="message-box p-1 flex-grow flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide"


            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
          >
            {/* Hide scrollbar for WebKit browsers */}
            <style>
              {`
                .message-box::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message flex flex-col p-2 w-fit rounded-md 
                ${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} 
                ${msg.outgoing ? 'self-end bg-emerald-200 ml-auto' : 'bg-emerald-100'}`
                }
              >


                <small className="opacity-65 text-xs">{msg.sender.email}</small>
                <p className='text-sm'>
                  {msg.sender._id === 'ai' ?
                    <div className='overflow-auto bg-emerald-100 text- p-2 rounded-md'>
                      <Markdown>{msg.message}</Markdown>
                    </div>
                    : msg.message}
                </p>
              </div>
            ))}
          </div>

          <div className="inputField w-full flex absolute bottom-0 p-2 gap-2 bg-white">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 px-4 border border-gray-300 rounded-full outline-none"
              type="text"
              placeholder="Enter your message"
            />
            <button onClick={send} className="p-2 bg-emerald-400 text-white rounded-full flex items-center justify-center">
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>

          <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-transform duration-300 ease-in-out ${isSidepanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 left-0`}>
            <header className="flex justify-between items-center p-2 px-4 max-w-full gap-2 bg-emerald-200">
              <h1 className='text-xl font-semibold'>Collaborators</h1>
              <button onClick={() => setIsSidepanelOpen(false)} className="p-2 rounded flex justify-end">
                <i className="ri-close-circle-line text-2xl"></i>
              </button>
            </header>
            <div className="users flex flex-col gap-2 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>
                {`
                  .users::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {projects.users && projects.users.map((user) => (
                <div key={user._id} className="user cursor-pointer hover:bg-emerald-100 p-2 flex gap-2 items-center">
                  <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-emerald-300">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-serif text-lg">{user.email}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>
                {`
                  .users-list::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user._id} className={`user cursor-pointer hover:bg-slate-200 ${selectedUserId.has(user._id) ? 'bg-slate-200' : ''} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                    <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-emerald-300">
                      <i className="ri-user-fill absolute"></i>
                    </div>
                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No users found</p>
              )}
            </div>
            <button onClick={addCollaborators} className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;