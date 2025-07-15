import { precacheAndRoute } from 'workbox-precaching';

// ✅ Inject and precache static assets (replaced at build)
precacheAndRoute(self.__WB_MANIFEST);

// ✅ Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'Click to open',
icon: data.icon || '/sw2.png',

    data: {
      url: 'https://spendwise.deno.dev',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ✅ Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || 'https://spendwise.deno.dev';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});