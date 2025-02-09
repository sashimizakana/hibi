import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { Snackbar } from "react-native-paper";
import { messageAtom } from "@/atoms/message";
import { useAppTheme } from "@/lib/theme";

export function Message() {
  const [message, setMessage] = useAtom(messageAtom);
  const theme = useAppTheme();

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    }
  }, [message]);

  return (
    <Snackbar
      visible={!!message}
      onDismiss={() => setMessage(null)}
      theme={theme}
    >
      {message}
    </Snackbar>
  );
}
