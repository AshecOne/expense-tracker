import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  id: number;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

const initialState: IUserState = {
  id: 0,
  name: "",
  email: "",
  isLoggedIn: false,
};

const loadUserFromStorage = (): IUserState => {
  if (typeof window !== "undefined") {
    const storedUserData = localStorage.getItem("user");
    console.log("Loading user data from local storage");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      console.log("Parsed user data:", parsedData);
      if (parsedData.id && parsedData.name && parsedData.email) {
        return { ...parsedData, isLoggedIn: true };
      }
    }
  }
  return initialState;
};

const userSlice = createSlice({
  name: "user",
  initialState: loadUserFromStorage(),
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      console.log("User logged in:", state);
    },
    resetUser: (state) => {
      state.id = 0;
      state.name = "";
      state.email = "";
      state.isLoggedIn = false;
    },
    updateUser: (
      state,
      action: PayloadAction<{ name?: string; email?: string }>
    ) => {
      if (action.payload.name !== undefined) {
        state.name = action.payload.name;
      }
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(state));
      }
      console.log("User data stored in local storage:", state);
    },
    logout: (state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      return initialState;
    },
  },
});
export const { setUser, resetUser, updateUser, logout } = userSlice.actions;
export default userSlice.reducer;
