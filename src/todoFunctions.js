import axios from 'axios';

export const fetchTasks = () => {
  return axios.get('http://localhost:3001/tasks')
    .then(response => {
      const tasks = response.data.tasks.map(task => task.task);
      return response.data.tasks;
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
      throw error;
    });
};


export const addTask = (taskInput, date) => {
  return axios.post('http://localhost:3001/tasks', { task: taskInput, date: date })
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding task:', error);
      throw error;
    });
};

export const deleteTask = (taskId) => {
  return axios.delete(`http://localhost:3001/tasks/${taskId}`)
    .then(() => taskId)
    .catch(error => {
      console.error('Error deleting task:', error);
      throw error;
    });
};

export const updateTask = (taskId, newValue) => {
  return axios.patch(`http://localhost:3001/tasks/${taskId}`, { task: newValue })
    .then(() => newValue)
    .catch(error => {
      console.error('Error updating task:', error);
      throw error;
    });
};
