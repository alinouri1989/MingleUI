import { toast } from 'react-hot-toast';

export const SuccessAlert = (message, duration = 3500) => {
  toast.success(message, {
    duration: duration,
    style: {
      border: '0px solid #713200',
      padding: '16px 20px',
      color: '#585CE1',
      fontSize: "15px",
      background:"#E8EBFD"
    },
    iconTheme: {
      primary: '#585CE1',
      secondary: '#ffffff',
    },
  });
};

export const ErrorAlert = (message, duration = 4000) => {
  toast.error(message, {
    duration: duration,
    style: {
      border: '0px solid #713200',
      padding: '16px 20px',
      color: '#EB6262',
      fontSize: "14px",

    },
    iconTheme: {
      primary: '#EB6262',
      secondary: '#ffffff',
    },
  });
};