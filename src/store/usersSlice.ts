import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types/user";
import { toast } from "react-toastify";

interface UsersState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      const userWithEmailExists = state.users.some(
        (user) =>
          user.email.toLowerCase() === action.payload.email.toLowerCase()
      );

      if (userWithEmailExists) {
        toast.warning("User with this email already exists.");
      } else {
        state.users.push(action.payload);
      }
    },
    editUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );

      if (index !== -1) {
        const existingUser = state.users[index];
        const currentUser = action.payload;

        // Compare if any fields are different
        const hasChanges = Object.keys(currentUser).some((key) => {
          const currentVal = currentUser[key as keyof User];
          const existingVal = existingUser[key as keyof User];
          // Compare the address fields specifically
          if (key === "address" && currentVal && existingVal) {
            // Type cast currentVal and existingVal to User['address'] to access address properties
            const currentAddress = currentVal as User["address"];
            const existingAddress = existingVal as User["address"];

            return (
              currentAddress.city !== existingAddress.city ||
              currentAddress.zipcode !== existingAddress.zipcode
            );
          }

          return currentVal !== existingVal;
        });
        if (hasChanges) {
          // If there are changes, update the user and show toast
          state.users[index] = action.payload;
          toast.success("User updated successfully!");
        }
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const { addUser, editUser, deleteUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;
