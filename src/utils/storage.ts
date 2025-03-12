export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Ошибка при сохранении данных в localStorage:', error)
  }
}

export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : null
  } catch (error) {
    console.error('Ошибка при загрузке данных из localStorage:', error)
    return null
  }
}
