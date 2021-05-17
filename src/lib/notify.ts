import {toast} from 'react-toastify'
import type {ToastOptions} from 'react-toastify'

const notify = (
  emoji: string,
  text: string,
  {color, ...toastOptions}: {color: string; toastOptions?: ToastOptions},
) =>
  toast.dark(`${emoji} ${text}`, {
    style: {
      color: color,
      fontWeight: 500,
      fontFamily: 'inherit',
      fontSize: '1.5rem',
      textTransform: 'capitalize',
    },
    ...toastOptions,
  })

export {notify}
