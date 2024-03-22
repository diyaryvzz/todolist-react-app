import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      axios.post('http://localhost:3001/tasks', { task: taskInput })
        .then(response => {
          setTasks([...tasks, response.data]);
          setTaskInput('');
        })
        .catch(error => {
          console.error('Error adding task:', error);
        });
    }
  };

  const handleDeleteTask = index => {
    axios.delete(`http://localhost:3001/tasks/${tasks[index].id}`)
      .then(() => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
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
            {task.task}
            <Button
              className="float-end"
              variant="danger"
              onClick={() => handleDeleteTask(index)}
              style={{ marginRight: '5px' }}
            >
              Sil
            </Button>
            <Button
              className="float-end"
              variant="warning"
              onClick={() => alert('Görev Güncellendi!')}
            >
              Güncelle
            </Button>
            <Button
              className="float-end"
              variant="success"
              onClick={() => alert('Görev Tamamlandı!')}
            >
              Tamamlandı
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default TodoList;
