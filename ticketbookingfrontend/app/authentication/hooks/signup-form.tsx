

import { useState } from 'react'
import apiRoutes from '@/routes'
export function signupForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords don't match")
            return
        }
        fetch(apiRoutes.SIGNUP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        }).then(response => response.json()).then((data) => {
            if (data.message === 'success') {
                window.location.href='/'
            }
        })
        console.log('Signup attempt', { name, email, password })
    }

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleSubmit
    }
}