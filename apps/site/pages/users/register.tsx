import {
  Button,
  chakra,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useConst,
} from "@chakra-ui/react";
import { NextPage } from "next";
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
  AuthResponseSuccess,
  RegisterResponseError,
} from "../../lib/auth/types/auth-response";

const Register: NextPage = () => {
  const router = useRouter();
  const { user, setUser, next } = useContext(authContext);

  useEffect(() => {
    if (user) {
      router.push(next.current || "/");
    };
  }, [router, user]);

  const [isSocialLoginInProgress, setIsSocialLoginInProgress] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerUser = async () => {
    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/registration`;

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

  const {
    error: signupError,
    execute: executeSignup,
    isLoading: isSignUpLoading,
  } = useFetch<AuthResponseSuccess, RegisterResponseError>(registerUser, {
    autoFetch: false,
    onSuccess: onLoginSuccess,
  });

  function onLoginSuccess(data: AuthResponseSuccess) {
    setUser(data?.user);
    router.push(next.current || "/");
  }

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    executeSignup();
  };

  return (
    <AuthContainer>
      <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
        <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
          Create a new Account
        </Heading>
        <HStack spacing="1" justify="center">
          <Text color="muted">Already have an account?</Text>
          <Link href="/users/login" passHref style={{ color: "blue" }}>
            <chakra.a color="blue">Sign in</chakra.a>
          </Link>
        </HStack>
      </Stack>
      <Stack spacing="6">
        <chakra.form onSubmit={submitForm}>
          <Stack spacing="5">
            <InputField
              type="text"
              label="First name"
              name="firstName"
              value={firstName}
              setValue={setFirstName}
              errors={signupError?.data?.errors.first_name || []}
              isRequired
            />
            <InputField
              type="text"
              label="Last name"
              name="lastName"
              value={lastName}
              setValue={setLastName}
              errors={signupError?.data?.errors.last_name || []}
            />
            <InputField
              type="email"
              label="Email"
              name="email"
              value={email}
              setValue={setEmail}
              errors={signupError?.data?.errors.email || []}
              isRequired
            />
            <PasswordField
              name="password"
              label="Password"
              value={password}
              setValue={setPassword}
              isRequired
              errors={[]}
            />
            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              isRequired
              errors={
                password !== confirmPassword ? ["passwords does not match"] : []
              }
            />

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSignUpLoading}
              isDisabled={isSocialLoginInProgress}
            >
              Sign up
            </Button>
          </Stack>
        </chakra.form>
        <SocialLogin
          disabled={isSignUpLoading}
          onLogin={() => setIsSocialLoginInProgress(true)}
        />
      </Stack>
    </AuthContainer>
  );
};
export default Register;
