import { Button, Modal } from "react-bootstrap";
import { User } from "../types/user";
import { useDispatch } from "react-redux";
import { deleteUser } from "../store/usersSlice";

interface UserModalProps {
  show: boolean;
  onHide: () => void;
  user?: User;
  onDeleteSuccess: () => void;
}

const DeleteModal: React.FC<UserModalProps> = ({
  show,
  user,
  onHide,
  onDeleteSuccess,
}) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (user) {
      dispatch(deleteUser(user.id));
      onDeleteSuccess();
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <>
            Are you sure you want to delete <b>{user.name}</b>?
          </>
        ) : (
          "No user selected."
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={!user}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
