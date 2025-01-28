import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]); // Initialize as an array

  const [users, setUsers] = useState([]); // Ensure it's initialized as an empty array

  const [projects, setProjects] = useState(location.state?.project);

  function addCollaborators() {
    axios
      .put("/api/v1/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        // After successfully adding collaborators, close the modal
        setIsModalOpen(false);

        // Directly update the projects state with the new collaborators
        const updatedUsers = [...projects.users, ...selectedUserId.map(id => users.find(user => user._id === id))];
        setProjects((prevProjects) => ({
          ...prevProjects,
          users: updatedUsers, // Update the users with the new collaborators
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }


  useEffect(() => {

    axios.get(`api/v1/projects/get-project/${location.state.project._id}`).then(res => {
      // console.log("user info",res.data)
      setProjects(res.data.data)

    }).catch(err => {
      console.log(err)
    })

    axios
      .get('/api/v1/users/all-user', { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => {
        // Log the entire response to see its structure
        // console.log('API Response:', res);

        if (res.data && Array.isArray(res.data.data)) { // Check if the 'data' field is an array
          setUsers(res.data.data); // Update the state with the 'data' array
        } else {
          console.error('Users data not found in the response');
        }
      })
      .catch((err) => {
        console.error('Error fetching users:', err.message);
      });
  }, []); // Empty dependency array, so runs only once when component mounts

  // // Log the users state whenever it updates
  // useEffect(() => {
  //   console.log('Users state updated:', users);
  // }, [users]); // This runs every time users state is updated




  const handleUserClick = (id) => {
    setSelectedUserId(prevSelectedUserId => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });


  }

  // Safely access the state and project object
  // const project = location.state?.project || null;
  // console.log(project);

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative h-full flex flex-col min-w-96">
        {/* Header */}
        <header className="flex justify-between items-center p-2 px-4 max-w-full bg-emerald-200">
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button
            onClick={() => setIsSidepanelOpen(!isSidepanelOpen)}
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis,
              nam!
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
            className="flex-grow p-2 px-4 border border-gray-300 rounded-full outline-none"
            type="text"
            placeholder="Enter your message"
          />
          <button className="p-2 bg-emerald-400 text-white rounded-full flex items-center justify-center">
            <i className="ri-send-plane-2-fill"></i>
          </button>
        </div>

        {/* Side Panel */}
        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-transform duration-300 ease-in-out ${isSidepanelOpen ? 'translate-x-0' : '-translate-x-full'
            } top-0 left-0`}
        >
          <header className="flex  justify-between items-center p-2 px-4 max-w-full gap-2 bg-emerald-200">
            <h1 className='text-xl font-semibold'>Collaborators</h1>
            <button
              onClick={() => setIsSidepanelOpen(false)}
              className="p-2 rounded flex justify-end"
            >
              <i className="ri-close-circle-line text-2xl"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2">
            {projects.users && projects.users.map((user) => {
              return (<div
                key={user._id}
                className="user cursor-pointer hover:bg-emerald-100 p-2 flex gap-2 items-center">
                <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-emerald-300">
                  <i className="ri-user-fill absolute"></i>
                </div>
                <h1 className="font-serif text-lg">{user.email}</h1>
              </div>)
            })}
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
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
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
            <button
              onClick={addCollaborators}
              className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
