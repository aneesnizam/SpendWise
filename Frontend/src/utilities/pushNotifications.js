import api from "./axios";


const Public_Key = "BOUbdwZthI965v6EUxsB3f6G3GQl3VTSIzNKQx8GTwU4A3-tT4TPR_JENX-8ONECKFOMQF1mHMt5KJegQBrJ-qk";

export const subscribeUserToPush = async (userId) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: Public_Key,
  });

  const res = await api.post("api/subscribe", { userId, subscription });

};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};
