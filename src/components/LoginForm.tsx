import { useState, type SubmitEvent } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Login failed. Check your email and password.')
    }
  }

  async function handleSignUp() {
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Sign up failed. Password needs at least 6 characters.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Log in</button>
      <button type="button" onClick={handleSignUp}>Sign up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )

}