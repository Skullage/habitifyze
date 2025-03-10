self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  console.log('Уведомление было нажато')
})
