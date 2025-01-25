import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Manage dark mode state

  const navigate = useNavigate(); // Hook for navigation

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const createProject = (e) => {
    e.preventDefault();
    console.log(projectName);
    axios.post('/api/v1/projects/create', {
      name: projectName
    }).then((res) => {
      console.log(res);
      handleCloseModal();
      // Add the newly created project to the existing projects list
      setProjects((prevProjects) => [...prevProjects, res.data.project]); 
    }).catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    axios
      .get('/api/v1/projects/all')
      .then((res) => {
        console.log(res.data); // Log to check the API response
        setProjects(res.data.data || []); // Update to match the API response structure
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <main className={`p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Projects</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)} // Toggle dark mode
          className="p-2 bg-gray-300 dark:bg-gray-700 rounded-md"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="projects flex flex-wrap gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-4 border border-slate-300 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
        >
          New Project
          <i className="ri-link ml-2"></i>
        </button>

        {
          projects.length === 0 ? (
            <p>No projects available. Create a new project to get started.</p>
          ) : (
            projects.map((project) => (
              project && project.name && (  // Ensure project and name are valid
                <div key={project._id}
                  onClick={() => {
                    navigate(`/project`, {
                      state: { project }
                    });
                  }}
                  className="flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200 dark:hover:bg-gray-700"
                >
                  <h2 className="font-semibold">{project.name}</h2>
                  <div className="flex gap-2">
                    <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                    {project.users?.length || 0}
                  </div>
                </div>
              )
            ))
          )
        }
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3 dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="button" className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-white rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md dark:bg-blue-700 dark:hover:bg-blue-600">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
