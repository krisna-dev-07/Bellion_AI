import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    // Handle form submission
    const submitHandler = (e) => {
        e.preventDefault()

        axios.post('/api/v1/users/login', {
            email,
            password
        }, { withCredentials: true }) // Ensure cookies are handled by the browser
        .then((res) => {
            console.log('Response from backend:', res.data) // Log the entire response to inspect its structure

            // Extract data from the response
            const { data } = res.data || {};  // Assuming response structure is { data: { user, accessToken, refreshToken } }

            if (data) {
                const { accessToken, refreshToken, user } = data;

                // If tokens are found in the response, store them in localStorage
                if (accessToken && refreshToken) {
                    localStorage.setItem('accessToken', accessToken)
                    localStorage.setItem('refreshToken', refreshToken)

                    // Store user info in context/state
                    setUser(user)

                    // Redirect to homepage or dashboard
                    navigate('/')
                } else {
                    console.error('Tokens not found in the response:', data)
                }
            }
        })
        .catch((err) => {
            console.error(err.response ? err.response.data : err.message) // Log any errors that occur
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                <p className="text-gray-400 mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
