import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

const toastOptions = {
  position: 'top-center',
  autoClose: 1250,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    textAlign: 'center',
    alignItems: 'center'
  }
};

let currentToastId = 1;

export const ToastService = (message, type) => {
  if (currentToastId !== null) {
    toast.dismiss(currentToastId);
  }

  switch (type) {
    case 'success':
      currentToastId = toast.success(message, toastOptions);
      break;
    case 'error':
      currentToastId = toast.error(message, toastOptions);
      break;
    default:
      break;
  }
};

ToastService.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']),
};
