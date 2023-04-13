import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AuthContainer } from "../../../components/Auth";

export default function ConfirmEmail() {
  const [status, setStatus] = useState<string>("loading");
  const router = useRouter();
  useEffect(() => {
    const { token } = router.query;
    if (!token) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/confirm-email/${token}`;
    fetch(url, {
      method: "get",
    })
      .then(async (resp) => ({
        ok: resp.ok,
        json: await resp.json(),
      }))
      .then((resp) => {
        setStatus(resp.json.message);
      });
  }, [router.query]);

  return (
    <AuthContainer>
      <Text>{status}</Text>
    </AuthContainer>
  );
}
