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
    if (!storedData) return null

    try {
      return JSON.parse(storedData)
    } catch (parseError) {
      console.error('Ошибка при разборе JSON:', parseError)
      console.log('Поврежденные данные:', storedData)
      localStorage.removeItem(key)
      return null
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных из localStorage:', error)
    localStorage.removeItem(key)
    return null
  }
}
