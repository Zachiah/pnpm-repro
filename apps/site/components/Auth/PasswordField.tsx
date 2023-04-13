import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { Icon } from "@incmix/ui";
import cuid from "cuid";
import React, { useCallback, useEffect, useState } from "react";

import { InputFieldProps } from "./types";

export const PasswordField = React.forwardRef<
  HTMLInputElement,
  InputFieldProps & { disableValidation?: boolean }
>(
  (
    {
      name,
      errors,
      label,
      value,
      setValue,
      isRequired,
      disableValidation,
      ...props
    },
    ref,
  ) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const mergeRef = useMergeRefs(inputRef, ref);
    const onClickReveal = () => {
      onToggle();
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [dirty, setDirty] = useState(false);

    const putError = (error: string) => {
      setValidationErrors((prev) => [...prev, error]);
    };

    useEffect(() => {
      if (!disableValidation) {
        setValidationErrors(errors ?? []);
        const lowerCaseLetters = /[a-z]/g;
        const upperCaseLetters = /[A-Z]/g;
        const numbersAndSymbols = /[!?@#$%^&*_0-9]/g;

        if (value.length < 8) putError("should be at least 8 characters");
        if (!lowerCaseLetters.test(value))
          putError("at least one lower case character");
        if (!upperCaseLetters.test(value))
          putError("at least one upper case character");
        if (!numbersAndSymbols.test(value))
          putError("at least one digit or punctuation character");
      }
    }, [disableValidation, errors, value]);

    return (
      <FormControl isRequired={isRequired}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <InputGroup>
          <InputRightElement>
            <IconButton
              variant="link"
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={isOpen ? <Icon icon="eye-slash" /> : <Icon icon="eye" />}
              onClick={onClickReveal}
            />
          </InputRightElement>
          <Input
            id={name}
            ref={mergeRef}
            type={isOpen ? "text" : "password"}
            autoComplete="current-password"
            required={isRequired}
            minLength={8}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              setDirty(true);
            }}
            sx={{
              "&::-ms-reveal": {
                display: "none",
              },
              "&::-ms-clear ": {
                display: "none",
              },
            }}
            {...props}
          />
        </InputGroup>
        {dirty &&
          validationErrors.map((error) => (
            <Text color="red" fontSize="sm" key={`${name}_error_${cuid()}`}>
              {error}
            </Text>
          ))}
      </FormControl>
    );
  },
);

PasswordField.displayName = "PasswordField";
