/**
 * useContact Hook
 * Handles CRUD operations for contact section
 */

'use client'

import { useEffect, useState } from "react"

export interface ContactInfo {
  name?: string
  title?: string
  email?: string
  location?: string
  github?: string
  linkedin?: string
}

const useContact = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  /**
   * Fetch Contact Section
   */
  const fetchContact = async (section: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/resume?section=${section}`)

      if (!res.ok) {
        throw new Error("Failed to fetch contact info")
      }

      const data = await res.json()
      setContact(data.data.contactInfo)

    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update Contact Section
   */
  const updateContact = async (updatedData: ContactInfo) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "contactInfo",
          data: updatedData,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update contact info")
      }

      const data = await res.json()

      setContact(data.data.contactInfo)
      setSuccess("Contact updated successfully")

    } catch (err: any) {
      setError(err.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Auto fetch on mount
   */
  useEffect(() => {
    fetchContact("contactInfo")
  }, [])

  return {
    contact,
    loading,
    error,
    success,
    fetchContact,
    updateContact,
    setContact,
  }
}

export default useContact