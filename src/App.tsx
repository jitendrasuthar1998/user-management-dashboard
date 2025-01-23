import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Spinner, Table } from "react-bootstrap";
import { Pencil, Trash2 } from "lucide-react";
import { fetchUsers } from "./store/usersSlice";
import { AppDispatch, RootState } from "./store/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-danger text-center mt-4">{error}</div>;
  }

  return (
    <Container className="py-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1>Users Dashboard</h1>
    </div>

    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>City</th>
          <th>Zip Code</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.address.city}</td>
            <td>{user.address.zipcode}</td>
            <td>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="danger"
                size="sm"
              >
                <Trash2 size={16} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Container>
  )
}

export default App
