/**
 * useContact Hook 
 * Handles CRUD operations for contact section
 */

'use client'

import { useEffect, useState } from "react"
import { AxiosError ,isCancel} from "axios"
import api from "@/lib/axios"

export interface ContactInterface {
  name?: string
  title?: string
  email?: string
  location?: string
  github?: string
  linkedin?: string
}



const useContact = () => {
  const [contact, setContact] = useState<ContactInterface | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  /* ---------------- Fetch ---------------- */

  const fetchContact = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get<any>("/user");

      console.log("Fetched contact info FROM HOOK:", res); // Debug log

      setContact(res.data.data)

    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      setError(error.response?.data?.message || "Failed to fetch contact info")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- Update ---------------- */

  const updateContact = async (updatedData: ContactInterface) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null);
      console.log("Updating contact with data:", updatedData); // Debug log

      const res = await api.patch<any>("/user", updatedData);

      setContact(res.data.data.ContactInterface)
      setSuccess("Contact updated successfully")

    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      setError(error.response?.data?.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- Auto Fetch ---------------- */

  // useEffect(() => {
  //   fetchContact()
  // }, [])

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