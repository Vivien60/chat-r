self.addEventListener('push', function(event) {
    const data = event.data ? event.data.text() : 'No payload';
    const options = {
        body: data,
        icon: '/images/icon.png',
        badge: '/images/badge.png'
    };
    event.waitUntil(self.registration.showNotification('Title', options));
});