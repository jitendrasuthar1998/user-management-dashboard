import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Spinner, Table } from "react-bootstrap";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { addUser, editUser, fetchUsers } from "./store/usersSlice";
import { AppDispatch, RootState } from "./store/store";
import { User, UserFormData } from "./types/user";
import UserModal from "./components/UserModal";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, error } = useSelector(
    (state: RootState) => state.users
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleAdd = () => {
    setSelectedUser(undefined);
    setModalTitle("Add User");
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalTitle("Edit User");
    setShowModal(true);
  };

  const handleSubmit = (data: UserFormData) => {
    if (selectedUser) {
      dispatch(editUser({ ...data, id: selectedUser.id }));
    } else {
      dispatch(addUser({ ...data, id: users.length + 1 }));
    }
    setShowModal(false);
  };

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (status === "failed") {
    return <div className="text-danger text-center mt-4">{error}</div>;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Users Dashboard</h1>
        <Button variant="primary" onClick={handleAdd}>
          <Plus className="me-2" size={20} />
          Add User
        </Button>
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
                  onClick={() => handleEdit(user)}
                >
                  <Pencil size={16} />
                </Button>
                <Button variant="danger" size="sm">
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        title={modalTitle}
      />
    </Container>
  );
}

export default App;
