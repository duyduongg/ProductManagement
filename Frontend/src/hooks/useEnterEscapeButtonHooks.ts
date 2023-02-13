import { useEffect } from 'react';

interface IUseEnterEscButtonsProps {
  handleCancel: Function;
  handleConfirm: Function;
}

export const useEnterEscButtonsHook = ({ handleCancel, handleConfirm }: IUseEnterEscButtonsProps) => {
  useEffect(() => {
    const listener = (ev: { code: string; preventDefault: () => void }) => {
      if (ev.code === 'Enter' || ev.code === 'NumpadEnter') {
        handleConfirm();
        ev.preventDefault();
      }
    };

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleConfirm]);

  useEffect(() => {
    const listener = (ev: { code: string; preventDefault: () => void }) => {
      if (ev.code === 'Escape') {
        handleCancel();
        ev.preventDefault();
      }
    };

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleCancel]);
};
