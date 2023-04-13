import {
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Stack,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Icon } from "@incmix/ui";
import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { useFetch } from "../../lib/auth/hooks";
import { ApiError, OAuthResponse } from "../../lib/auth/types/auth-response";

export const SocialLogin: React.FC<{
  text?: string;
  redirect?: string;
  disabled?: boolean;
  onLogin?: () => void;
}> = ({ disabled, onLogin, text = "or continue with" }) => {
  const socialLogin = async (provider: string) => {
    if (onLogin) onLogin();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/new`;
    const resp = await fetch(url, {
      method: "get",
    });
    return {
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      data: await resp.json(),
    };
  };

  const onSocialLoginSuccess = (data: OAuthResponse) => {
    sessionStorage.setItem(
      "auth_state_id",
      JSON.stringify({ session_params: data.data.session_params }),
    );
    window.location.href = data.data.url;
  };

  const {
    data: socialLoginData,
    error: socialLoginError,
    execute: executeSocialLogin,
    isLoading: isSocialLoginLoading,
  } = useFetch<OAuthResponse, ApiError>(socialLogin, {
    autoFetch: false,
    onSuccess: onSocialLoginSuccess,
  });
  return (
    <Stack spacing="6">
      <HStack>
        <Divider />
        <Text fontSize="sm" whiteSpace="nowrap" color="muted">
          {text}
        </Text>
        <Divider />
      </HStack>
      <ButtonGroup variant="outline" spacing="4" width="full">
        <Button
          width="full"
          onClick={() => executeSocialLogin("google")}
          isDisabled={disabled}
          isLoading={isSocialLoginLoading}
        >
          <VisuallyHidden>Continue with google</VisuallyHidden>
          <Icon as={FaGoogle} />
        </Button>
        <Button
          width="full"
          onClick={() => executeSocialLogin("github")}
          isDisabled={disabled}
          isLoading={isSocialLoginLoading}
        >
          <VisuallyHidden>Continue with github</VisuallyHidden>
          <Icon as={FaGithub} />
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
