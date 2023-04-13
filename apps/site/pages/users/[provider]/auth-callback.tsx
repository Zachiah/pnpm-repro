import { Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import { AuthContainer } from "../../../components/Auth";
import { useFetch } from "../../../lib/auth/hooks";
import { authContext } from "../../../lib/auth/hooks/authContext";
import {
  ApiError,
  AuthResponseSuccess,
} from "../../../lib/auth/types/auth-response";

export default function AuthCallback() {
  const router = useRouter();
  const { setUser } = useContext(authContext);
  const authenticate = async (
    provider: string,
    code: string,
    state: string,
  ) => {
    const sessionParams = sessionStorage.getItem("auth_state_id");

    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/callback?code=${code}&state=${state}`;
    const resp = await fetch(url, {
      method: "post",
      body: sessionParams,
      headers: new Headers({ "content-type": "application/json" }),
      credentials: "include",
    });
    return {
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      data: await resp.json(),
    };
  };
  const onLoginSuccess = (data: AuthResponseSuccess) => {
    setUser(data?.user);
    router.push("/");
  };

  const { data, error, isLoading, execute } = useFetch<
    AuthResponseSuccess,
    ApiError
  >(authenticate, {
    autoFetch: false,
    onSuccess: onLoginSuccess,
    onError: (error) => console.log(error),
  });

  useEffect(() => {
    const { provider, code, state } = router.query;
    if (!provider) return;
    execute(provider, code, state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <AuthContainer>
      <Stack alignItems="center">
        {isLoading && (
          <>
            <Spinner />
            <Text>Signing you in</Text>
          </>
        )}

        {data && (
          <>
            <Text color="green">Sign in successful</Text>
            <Text>{data.user.email}</Text>
            <Text>Redirecting...</Text>
          </>
        )}
        {error && (
          <>
            <Text color="red">Error: {error.status}</Text>
            <Text>
              {error.status === 422
                ? `Email is already linked to another account. Please login and goto 'My Profile' to link with ${router.query.provider}`
                : error.data?.message}
            </Text>
          </>
        )}
      </Stack>
    </AuthContainer>
  );
}
