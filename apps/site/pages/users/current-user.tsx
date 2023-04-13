import { Box, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

import { AuthContainer, SocialLogin } from "../../components/Auth";
import { AuthButton } from "../../components/Auth/AuthButton";
import { useFetch } from "../../lib/auth/hooks";
import { authContext } from "../../lib/auth/hooks/authContext";
import { ApiError, User } from "../../lib/auth/types/auth-response";

export default function CurrentUser() {
  const router = useRouter();
  const { user, setUser } = useContext(authContext);
  const [isSocialLoginInProgress, setIsSocialLoginInProgress] = useState(false);
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

  const { error, isLoading } = useFetch<User, ApiError>(fetchUser, {
    autoFetch: user == undefined,
    onSuccess,
  });

  function onSuccess(data: User) {
    setUser(data);
  }

  return (
    <AuthContainer>
      {isLoading && (
        <HStack alignItems="center">
          <Spinner />
          <Text>Loading...</Text>
        </HStack>
      )}
      {user && (
        <Stack>
          <Text>First name: {user.first_name}</Text>
          <Text>Last name: {user.last_name}</Text>
          <Text>Email: {user.email}</Text>
          <AuthButton />
          <Link href="/" style={{ color: "blue" }}>
            Home
          </Link>
        </Stack>
      )}
      {error && (
        <Stack>
          <Text color="red">Error: {error.status}</Text>
          <Text>Access Denied</Text>
          <AuthButton />
        </Stack>
      )}
      {user && (
        <Box marginTop={4}>
          <SocialLogin
            disabled={isLoading}
            onLogin={() => setIsSocialLoginInProgress(true)}
            text="Link Social Accounts"
          />
        </Box>
      )}
    </AuthContainer>
  );
}
