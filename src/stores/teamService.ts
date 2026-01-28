import type { TeamMember } from '@/types/teamMember'
import { mockTeamMembers } from '@/data/teamMembers'

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  // Simulating async API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTeamMembers), 100)
  })
}

/**
 * Create a new team member
 * TODO: Replace with actual API call
 * Example: return fetch('/api/team-members', { method: 'POST', body: JSON.stringify(member) }).then(res => res.json())
 */
export async function createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  const newMember: TeamMember = {
    id: Date.now().toString(),
    ...member,
  }
  mockTeamMembers.push(newMember)
  return new Promise((resolve) => {
    setTimeout(() => resolve(newMember), 100)
  })
}

/**
 * Update an existing team member
 * TODO: Replace with actual API call
 * Example: return fetch(`/api/team-members/${id}`, { method: 'PUT', body: JSON.stringify(member) }).then(res => res.json())
 */
export async function updateTeamMember(
  id: string,
  member: Omit<TeamMember, 'id'>,
): Promise<TeamMember> {
  const index = mockTeamMembers.findIndex((m: TeamMember) => m.id === id)
  const updatedMember: TeamMember = { id, ...member }
  if (index !== -1) {
    mockTeamMembers[index] = updatedMember
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(updatedMember), 100)
  })
}

/**
 * Delete a team member
 * TODO: Replace with actual API call
 * Example: return fetch(`/api/team-members/${id}`, { method: 'DELETE' })
 */
export async function deleteTeamMember(id: string): Promise<void> {
  const index = mockTeamMembers.findIndex((m: TeamMember) => m.id === id)
  if (index !== -1) {
    mockTeamMembers.splice(index, 1)
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 100)
  })
}

