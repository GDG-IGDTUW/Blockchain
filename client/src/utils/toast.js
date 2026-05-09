import { toast } from "react-toastify";

export const showSuccess = (message) => {
  toast.success(message, {
    autoClose: 3500,
  });
};

export const showError = (message) => {
  toast.error(message, {
    autoClose: 4000,
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    autoClose: 3500,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    autoClose: 3500,
  });
};