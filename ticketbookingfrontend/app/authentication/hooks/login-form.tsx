
import React, { useState } from 'react'
import apiRoutes from '@/routes'
export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Login attempt', { email, password })
        // Here you would typically handle the login logic
        fetch(apiRoutes.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        }).then(response => response.json()).then((data) => {
            localStorage.setItem('login', "true");
            window.location.href = '/ticketBook'
        })
    }
    return {
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit
    }
}