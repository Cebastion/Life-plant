import { Keyboard } from "react-native";
import { useEffect, useState } from "react";

export function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return visible;
}

