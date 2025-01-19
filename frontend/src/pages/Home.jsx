import React, { useState } from 'react';
import axios from '../config/axios';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const createProject = (e) => {
    e.preventDefault();
    console.log(projectName);
    axios.post('/api/v1/projects/create',
      {
        name: projectName

      }).then((res) => {
        console.log(res);
        handleCloseModal();
      }).catch((err) => {
        console.log(err);
      });

  };

  return (
    <main className='p-4 bg-gray-900 min-h-screen text-white'>
      <div className="projects">
        <button
          className='projects p-4 border-slate-300 bg-slate-700 rounded-md hover:bg-slate-600'
          onClick={handleOpenModal}
        >
          <i className="ri-folder-add-line"></i> Add Project
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-gray-800 p-6 rounded-md shadow-md w-96">
              <h2 className="text-2xl mb-4 text-center">New Project</h2>
              <form onSubmit={createProject}>
                <label className="block mb-2">
                  Project Name:
                  <input
                    type="text"
                    className="mt-1 p-2 border border-gray-600 rounded-md w-full bg-gray-700 text-white"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </label>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="mr-2 p-2 bg-gray-600 rounded-md hover:bg-gray-500"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
