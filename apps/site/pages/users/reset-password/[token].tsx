import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  chakra,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

import { AuthContainer, PasswordField } from "../../../components/Auth";
import { useFetch } from "../../../lib/auth/hooks";
import { ApiError } from "../../../lib/auth/types/auth-response";

export default function ConfirmEmail() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordRequest = async (token: string) => {
    const data = {
      user: {
        password,
        confirm_password: confirmPassword,
      },
      token,
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/update-password`;

    const resp = await fetch(url, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(data),
    });
    return {
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      data: await resp.json(),
    };
  };

  const onSuccess = () => {
    setTimeout(() => {
      router.push("/users/login");
    }, 100);
  };

  const { data, error, execute, isLoading } = useFetch<
    { message: string },
    ApiError
  >(resetPasswordRequest, {
    autoFetch: false,
    onSuccess,
  });

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    const { token } = router.query;
    if (token) execute(token);
  };

  return (
    <AuthContainer>
      <chakra.form onSubmit={submitForm}>
        <Stack spacing="5">
          <PasswordField
            name="password"
            label="Password"
            value={password}
            setValue={setPassword}
            isRequired
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
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{error.data?.message}</AlertDescription>
            </Alert>
          )}
          {data && (
            <Alert status="success">
              <AlertIcon />
              <AlertDescription>{data.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Update Password
          </Button>
        </Stack>
      </chakra.form>
    </AuthContainer>
  );
}
