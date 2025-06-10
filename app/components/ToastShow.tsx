import React from 'react';
import Toast from 'react-native-toast-message';

interface ToastShowProps {
  type?: string;
  text1?: string;
  text2?: string;
  position?: 'top' | 'bottom';
  bottomOffset?: number;
  onHide?: () => void;
}

const ToastShow: React.FC<ToastShowProps> = ({ type = 'success', text1 = '', text2='', position = 'bottom', bottomOffset = 40, onHide }) => {
  React.useEffect(() => {
    if (text1) {
      Toast.show({
        type,
        text1,
        text2,
        position,
        bottomOffset,
        onHide,
      });
    }
  }, [type, text1, position, bottomOffset, onHide]);

  return <Toast />;
};

export default ToastShow;
