import { toast } from 'react-hot-toast';

export function showNotAvailableToast() {
  toast('This feature is not currently available.', {
    icon: 'ℹ️',
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
}
