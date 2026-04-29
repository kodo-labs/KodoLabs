import { createContext, useContext, useEffect, useState } from 'react'
import { RESOURCES } from '../data/mockData'
import {
  createResource,
  deleteResource,
  fetchResources,
  updateResource,
} from '../services/bookdeskRepository'

const ResourcesContext = createContext(null)

export function ResourcesProvider({ children }) {
  const [resources, setResources] = useState(RESOURCES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadResources() {
      try {
        const data = await fetchResources()
        if (active) {
          setResources(data)
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err.message)
          setResources(RESOURCES)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadResources()
    return () => {
      active = false
    }
  }, [])

  async function addResource(resource) {
    const saved = await createResource(resource)
    setResources(prev => [...prev, saved])
    return saved
  }

  async function saveResource(resource) {
    const saved = await updateResource(resource)
    setResources(prev => prev.map(item => item.id === saved.id ? saved : item))
    return saved
  }

  async function removeResource(id) {
    await deleteResource(id)
    setResources(prev => prev.filter(resource => resource.id !== id))
  }

  return (
    <ResourcesContext.Provider value={{ resources, loading, error, addResource, saveResource, removeResource }}>
      {children}
    </ResourcesContext.Provider>
  )
}

export function useResources() {
  return useContext(ResourcesContext)
}
