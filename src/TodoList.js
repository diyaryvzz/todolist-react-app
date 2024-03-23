import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { fetchTasks, addTask, deleteTask, updateTask } from './todoFunctions';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchTasks()
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      addTask(taskInput, selectedDate)
        .then(data => {
          setTasks([...tasks, data]);
          setTaskInput('');
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };

  const handleDeleteTask = (taskId, index) => {
    deleteTask(taskId)
      .then(() => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const handleEditTask = (taskId, index, newValue) => {
    updateTask(taskId, newValue)
      .then(() => {
        const updatedTasks = [...tasks];
        updatedTasks[index].task = newValue;
        setTasks(updatedTasks);
        setEditIndex(null);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const handleConfirmEdit = (taskId, index) => {
    handleEditTask(taskId, index, editValue);
  };
  
  const handleCompleteTask = async (taskId, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks);
    
    try {
      await updateTask(taskId, { ...tasks[index], completed: true });
      console.log('Task completed successfully');
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };
  
  return (
    <Container>
      <h1 className="mt-5 mb-3">Görev Listesi</h1>
      <Form className="mb-3">
        <Row>
          <Col sm={6}>
            <Form.Group controlId="formTask">
              <Form.Control
                type="text"
                placeholder="Görev giriniz"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="formDate">
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Button variant="primary" className='mt-2' onClick={handleAddTask} block>
              Ekle
            </Button>
          </Col>
        </Row>
      </Form>
      <ListGroup>
        {tasks.map((task, index) => (
          <ListGroup.Item key={index}>
            <>
              {task.completed ? (
                <del>{task.task} - {new Date(task.date).toLocaleDateString()}</del>
              ) : (
                <>{task.task} - {new Date(task.date).toLocaleDateString()}</>
              )}
              {!task.completed && (
                <>
                  <Button
                    className="float-end"
                    variant="danger"
                    onClick={() => handleDeleteTask(task.id, index)}
                    style={{ marginRight: '5px' }}
                  >
                    Sil
                  </Button>
                  <Button
                    className="float-end"
                    variant="warning"
                    onClick={() => {
                      setEditIndex(index);
                      setEditValue(task.task);
                    }}
                    style={{ marginRight: '5px' }}
                  >
                    Düzenle
                  </Button>
                  <Button
                    className="float-end"
                    variant="success"
                    onClick={() => handleCompleteTask(task.id, index)}
                    style={{ marginRight: '5px' }}
                  >
                    Tamamlandı
                  </Button>
                </>
              )}
            </>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default TodoList;
