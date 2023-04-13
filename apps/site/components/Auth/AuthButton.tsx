import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useAuth } from "../../lib/auth/hooks/authContext";

export const AuthButton = () => {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  return user ? (
    <Button colorScheme="red" onClick={logout} isLoading={isLoading}>
      Logout
    </Button>
  ) : (
    <Button
      colorScheme="blue"
      onClick={() => router.push("/users/login")}
      isLoading={isLoading}
    >
      Login
    </Button>
  );
};
