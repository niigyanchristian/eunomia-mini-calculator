interface Credential {
  email: string
  password: string
}

let users: Credential[] = [
  { email: 'test@gmail.com', password: 'test123' },
]

export function validateCredentials(email: string, password: string): boolean {
  return users.some((u) => u.email === email && u.password === password)
}

export function emailExists(email: string): boolean {
  return users.some((u) => u.email === email)
}

export function addCredential(email: string, password: string): void {
  users.push({ email, password })
}
