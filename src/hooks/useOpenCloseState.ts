import { useState } from "react";

export const useOpenCloseState = (): [boolean, () => void, () => void] => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  return [isOpen, open, close];
};
