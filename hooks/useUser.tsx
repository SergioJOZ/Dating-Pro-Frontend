import auth from "@react-native-firebase/auth";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useUser() {
  const authUser = auth().currentUser;
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const fetchUser = async () => {
      const userDB = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/id/${authUser?.uid}`
      );
      setUser(userDB.data);
    };

    fetchUser();
  }, []);

  return { authUser, user };
}
