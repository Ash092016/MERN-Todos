import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TodoItem from '../components/TodoItem';

/**
 * Home Page Component
 * Main todo management interface
 */
const Home = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  // Configure axios to include JWT token in all requests
  axios.defaults.headers.common['Authorization'] = `Bearer ${user?.token}`;

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Filter todos when date changes
  useEffect(() => {
    filterTodosByDate();
  }, [selectedDate, todos]);

  /**
   * Fetch all todos from API
   */
  const fetchTodos = async () => {
    try {
      const { data } = await axios.get('/api/todos');
      setTodos(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
      setLoading(false);
    }
  };

  /**
   * Filter todos by selected date
   */
  const filterTodosByDate = () => {
    if (selectedDate === 'all') {
      setFilteredTodos(todos);
      return;
    }

    const filtered = todos.filter((todo) => {
      const todoDate = new Date(todo.createdAt).toDateString();
      const filterDate = new Date(selectedDate).toDateString();
      return todoDate === filterDate;
    });

    setFilteredTodos(filtered);
  };

  /**
   * Add a new todo
   */
  const handleAddTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodoTitle.trim()) return;

    try {
      const { data } = await axios.post('/api/todos', {
        title: newTodoTitle,
        description: newTodoDescription,
      });

      setTodos([data, ...todos]);
      setNewTodoTitle('');
      setNewTodoDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add todo');
    }
  };

  /**
   * Update an existing todo
   */
  const handleUpdateTodo = async (id, updates) => {
    try {
      const { data } = await axios.put(`/api/todos/${id}`, updates);
      setTodos(todos.map((todo) => (todo._id === id ? data : todo)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo');
    }
  };

  /**
   * Delete a todo
   */
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    }
  };

  /**
   * Get unique dates from todos for filter dropdown
   */
  const getUniqueDates = () => {
    const dates = todos.map((todo) => new Date(todo.createdAt).toDateString());
    return [...new Set(dates)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-gray-600 dark:text-gray-300">
            Loading todos...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add new todo form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Add New Todo
          </h2>
          
          <form onSubmit={handleAddTodo} className="space-y-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            
            <textarea
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
            />
            
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Add Todo
            </button>
          </form>
        </div>

        {/* Filter by date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Todos</option>
            {getUniqueDates().map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* Todos list */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Todos ({filteredTodos.length})
          </h2>
          
          {filteredTodos.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No todos found. Add your first todo above!
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;