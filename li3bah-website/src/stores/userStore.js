import { makeAutoObservable, toJS } from "mobx";
import { instance } from "./instance"; // Axios instance with base URL

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  users = [];

  // Fetch all users
  fetchUsers = async () => {
    try {
      const response = await instance.get("/user");
      this.users = toJS(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Update a single user
  updateUser = async (userId, updatedUser) => {
    try {
      // Make an API call to update the user
      const response = await instance.put(
        `/user/adminupdate/${userId}`,
        updatedUser
      );
      // Update the local state with the updated user data
      this.users = this.users.map((user) =>
        user._id === userId ? response.data : user
      );
    } catch (error) {
      console.log(error);
    }
  };
}

const userStore = new UserStore();
userStore.fetchUsers();
export default userStore;
