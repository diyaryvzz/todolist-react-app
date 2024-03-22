import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { fetchTasks, addTask, deleteTask, updateTask } from './todoFunctions';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchTasks()
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      addTask(taskInput)
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

  return (
    <Container>
      <h1 className="mt-5 mb-3">Görev Listesi</h1>
      <Form className="mb-3">
        <Row>
          <Col sm={8}>
            <Form.Group controlId="formTask">
              <Form.Control
                type="text"
                placeholder="Görev giriniz"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Button variant="primary" className='mt-2' onClick={handleAddTask} block>
              Ekle
            </Button>
          </Col>
        </Row>
      </Form>
      <ListGroup>
        {tasks.map((task, index) => (
          <ListGroup.Item key={index}>
            {index === editIndex ? (
              <>
                <Form.Control
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                />
                <Button
                  className="float-end mt-2"
                  variant="success"
                  onClick={() => handleConfirmEdit(task.id, index)}
                  style={{ marginRight: '5px' }}
                >
                  Onayla
                </Button>
              </>
            ) : (
              <>
                {task.task}
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
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default TodoList;
