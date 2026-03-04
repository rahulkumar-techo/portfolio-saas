/**
 * Skills Hook
 * Handles CRUD operations for user skills
 */

'use client'

import { useCallback, useState } from 'react'
import { SkillGroup } from '@/types/server-types/resume'

export default function useSkills() {

  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch Skills
   */
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/resume/skills')
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to fetch skills')
      }

      setSkillGroups(Array.isArray(data?.data?.skillGroups) ? data.data.skillGroups : [])

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch skills')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update Skills (Create / Update)
   */
  const updateSkills = useCallback(async (groups: SkillGroup[]) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/resume/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skillGroups: groups
        })
      })

      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to update skills')
      }

      const nextGroups = Array.isArray(data?.data?.skillGroups) ? data.data.skillGroups : []
      setSkillGroups(nextGroups)
      return nextGroups

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update skills')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Delete Skill Group
   */
  const deleteSkillGroup = useCallback(async (category: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/resume/skills', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category })
      })

      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to delete skill group')
      }

      setSkillGroups(Array.isArray(data?.data?.skillGroups) ? data.data.skillGroups : [])
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill group')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    skillGroups,
    loading,
    error,
    fetchSkills,
    updateSkills,
    deleteSkillGroup
  }
}
