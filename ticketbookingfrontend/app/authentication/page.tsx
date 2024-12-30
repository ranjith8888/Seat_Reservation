'use client'

import { useState } from 'react'
import LoginForm from './components/login-form'
import SignupForm from './components/signup-form'
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        {isLogin ? <LoginForm /> : <SignupForm />}
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </Button>
        </div>
      </div>
    </div>
  )
}

