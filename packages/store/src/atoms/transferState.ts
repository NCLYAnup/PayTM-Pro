import { atom } from 'recoil';

export const transferState = atom({
  key: 'transferState',
  default: {
    amount: '',
    recipient: '',
  },
});