import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  chakra,
  Stack,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";

import { AuthContainer, InputField } from "../../components/Auth";
import { useFetch } from "../../lib/auth/hooks";
import { ApiError } from "../../lib/auth/types/auth-response";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");

  const forgetPasswordRequest = async () => {
    const data = {
      email,
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/forget-password`;

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

  const { data, error, execute, isLoading } = useFetch<
    { message: string },
    ApiError
  >(forgetPasswordRequest, {
    autoFetch: false,
  });

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    execute();
  };

  return (
    <AuthContainer>
      <chakra.form onSubmit={submitForm}>
        <Stack spacing="5">
          <InputField
            type="email"
            label="Enter your email to reset password"
            name="email"
            value={email}
            setValue={setEmail}
            isRequired
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
              <AlertDescription>
                Password reset link sent. Please check your inbox.
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Submit
          </Button>
        </Stack>
      </chakra.form>
    </AuthContainer>
  );
}
