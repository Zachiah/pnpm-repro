import { useRouter } from "next/router";
import { createContext, FC, MutableRefObject, ReactNode, useContext, useEffect, useRef, useState } from "react";

import { RxDBContext } from "../../db/db";
import { ApiError, ErrorResponse, User } from "../types/auth-response";
import { useFetch } from "./useFetch";

interface UserContextType {
  user?: User;
  setUser: (user?: User) => void;
  next: MutableRefObject<string>;
}

export const authContext = createContext<UserContextType>({
  setUser: () => { },
  next: { current: "/" },
});

interface Props {
  initialUser?: User;
  children: ReactNode;
}

export const AuthProvider: FC<Props> = ({ initialUser, children }) => {
  const [user, setUser] = useState(initialUser);
  const next = useRef<string>('/');

  return (
    <authContext.Provider value={{ user: user, setUser, next }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const { user, setUser } = useContext(authContext);
  const db = useContext(RxDBContext);

  const fetchUser = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/me`;
    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    return {
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      data: await resp.json(),
    };
  };

  const { isLoading, execute } = useFetch<User, ApiError>(fetchUser, {
    autoFetch: user == undefined,
    onSuccess,
    onError,
  });

  function onError(error: ErrorResponse<ApiError>) {
    if (error.status === 401) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/session/refresh`;
      fetch(url, {
        method: "POST",
        credentials: "include",
      }).then((resp) => {
        if (resp.ok) execute();
      });
    }
  }

  async function onSuccess(data: User) {
    setUser(data);
    await db?.user.insert(data);
    

  }

  const logout = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/logout`;
    fetch(url, {
      method: "DELETE",
      credentials: "include",
    }).then(async (resp) => {
      if (resp.ok) {
        await db?.user.findOne(
          {
            selector:{
              id: user?.id
            }
          }
        )
        .exec()
        .then(async (doc) => {
          if (doc) await doc.remove();
        });
        setUser(undefined);
      }
    });
  };

  return { user, logout, isLoading };
};
