import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);

  // Safely access the state and project object
  const project = location.state?.project || null;
  console.log(project);

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative h-full flex flex-col min-w-72">
        {/* Header */}
        <header className="flex justify-end p-2 px-4 max-w-full bg-emerald-200">
          <button
            onClick={() => setIsSidepanelOpen(!isSidepanelOpen)} // Corrected toggle logic
            className="p-2"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        {/* Conversation Area */}
        <div className="conversation-area flex-grow flex flex-col gap-2 py-2 px-2">
          {/* Incoming Message */}
          <div className="message bg-emerald-100 max-w-44 max-h-24 w-fit rounded-lg p-3 overflow-y-clip">
            <small className="opacity-65 text-xs">test@gmail.com</small>
            <p className="text-sm">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, nam! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, nam! Lorem ipsum
              dolor, sit amet consectetur adipisicing elit. Omnis, nam!
            </p>
          </div>

          {/* Outgoing Message */}
          <div className="message self-end bg-emerald-200 max-w-44 w-fit rounded-lg p-3 ml-auto h-fit">
            <small className="opacity-65 text-xs text-left">test@gmail.com</small>
            <p className="text-sm text-left">Lorem ipsum dolor sit amet.</p>
          </div>
        </div>

        {/* Input Field */}
        <div className="inputField w-full flex absolute bottom-0 p-2 gap-2">
          <input
            className="flex-grow  p-2 px-4 border border-gray-300 rounded-full outline-none"
            type="text"
            placeholder="Enter your message"
          />
          <button className="p-2  bg-emerald-400 text-white rounded-full flex items-center justify-center">
            <i className="ri-send-plane-2-fill"></i>
          </button>
        </div>

        {/* Side Panel */}
        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-transform duration-300 ease-in-out ${isSidepanelOpen ? 'translate-x-0' : '-translate-x-full'
            } top-0 left-0`}
        >
          <header className="flex justify-end p-2 px-4 max-w-full bg-emerald-200">

            <button
              onClick={() => setIsSidepanelOpen(false)}
              className="p-2  rounded flex justify-end"
            >
              <i class="ri-close-circle-line text-2xl"></i>
            </button>
          </header>
          <div className="flex-grow p-4">
            <p>This is the side panel content. Add whatever you want here!</p>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Project;
