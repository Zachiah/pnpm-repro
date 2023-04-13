import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  chakra,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useContext, useEffect, useState } from "react";

import {
  AuthContainer,
  InputField,
  PasswordField,
  SocialLogin,
} from "../../components/Auth";
import { useFetch } from "../../lib/auth/hooks";
import { authContext } from "../../lib/auth/hooks/authContext";
import {
  ApiError,
  AuthResponseSuccess,
} from "../../lib/auth/types/auth-response";
import { RxDBContext } from "../../lib/db/db";

export default function Login() {
  const router = useRouter();

  const { user, setUser, next } = useContext(authContext);
  const db = useContext(RxDBContext);

  useEffect(() => {
    if (user) {
      router.push(next.current || "/");
    }
  }, [next, router, user]);

  const [isSocialLoginInProgress, setIsSocialLoginInProgress] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    const data = {
      email,
      password,
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;

    const resp = await fetch(url, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(data),
      credentials: "include",
    });
    return {
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      data: await resp.json(),
    };
  };

  const { error, execute, isLoading } = useFetch<AuthResponseSuccess, ApiError>(
    loginUser,
    {
      autoFetch: false,
      onSuccess: onLoginSuccess,
    },
  );

  async function onLoginSuccess(data: AuthResponseSuccess) {
    if (data?.user) {
      await db?.user.insert(data.user);
    }
    setUser(data?.user);
    router.push(next.current || "/");
  }

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    execute();
  };

  return (
    <AuthContainer>
      <Stack spacing="8">
        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
            Log in to your account
          </Heading>
          <HStack spacing="1" justify="center">
            <Text color="muted">Don&apos;t have an account?</Text>
            <Link href="/users/register" passHref style={{ color: "blue" }}>
              <chakra.a color="blue">Sign up</chakra.a>
            </Link>
          </HStack>
        </Stack>

        <Stack spacing="6">
          <chakra.form onSubmit={submitForm}>
            <Stack spacing="5">
              <InputField
                type="email"
                label="Email"
                name="email"
                value={email}
                setValue={setEmail}
                isRequired
              />
              <PasswordField
                name="password"
                label="Password"
                value={password}
                setValue={setPassword}
                isRequired
              />
              <Link
                href="/users/forget-password"
                passHref
                style={{ color: "blue" }}
              >
                <chakra.a color="blue">Forgot password?</chakra.a>
              </Link>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Login Failed!</AlertTitle>
                  <AlertDescription>{error.data?.message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                disabled={isSocialLoginInProgress}
              >
                Sign in
              </Button>
            </Stack>
          </chakra.form>
          <SocialLogin
            disabled={isLoading}
            onLogin={() => setIsSocialLoginInProgress(true)}
          />
        </Stack>
      </Stack>
    </AuthContainer>
  );
}
