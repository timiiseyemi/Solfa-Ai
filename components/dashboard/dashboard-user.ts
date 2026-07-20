export type DashboardUser = {
  fullName: string
  firstName: string
  email: string
  avatarUrl?: string
  bio?: string
  joinedAt?: string | null
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
