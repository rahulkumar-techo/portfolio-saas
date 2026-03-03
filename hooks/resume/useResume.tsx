import React, { useState } from 'react'

// type Props = {}

const useResume = () => {
    const [resume, setResume] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null);


    const fetchResume = async (section?: string) => {
        try {
            setLoading(true)
            setError(null);
            let res: any;
            if (section) {
                res = await fetch(`/api/resume?section=${section}`)
            } else {
                res = await fetch(`/api/resume`);
            }

            if (!res.ok) {
                throw new Error("Failed to fetch resume")
            }
            const data = await res.json()
            setResume(data.data.resume)
        }
        catch (err: any) {
            setError(err.message || "Something went wrong")
        }
        finally {
            setLoading(false)
        }
    }
    return {
        resume,
        loading,
        error,
        success,
        fetchResume
    }
}

export default useResume