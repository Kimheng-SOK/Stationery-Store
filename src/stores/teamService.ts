  /**
 * Team Members Service
 * This service handles all team member data operations.
 * Currently uses mock data, but can be easily replaced with API calls.
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

// Mock data - Replace with API calls when ready
const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "SOK Kimheng", role: "Project manager" },
  { id: "2", name: "SOENG Prakbormey", role: "Project manager" },
  { id: "3", name: "SAN Meyheing", role: "Project manager" },
  { id: "4", name: "SAR Vichada", role: "Project manager" },
  { id: "5", name: "PHE Rithika", role: "Project manager" },
];

/**
 * Fetch all team members
 * TODO: Replace with actual API call
 * Example: return fetch('/api/team-members').then(res => res.json())
 */
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  // Simulating async API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTeamMembers), 100);
  });
}

/**
 * Create a new team member
 * TODO: Replace with actual API call
 * Example: return fetch('/api/team-members', { method: 'POST', body: JSON.stringify(member) }).then(res => res.json())
 */
export async function createTeamMember(
  member: Omit<TeamMember, "id">
): Promise<TeamMember> {
  const newMember: TeamMember = {
    id: Date.now().toString(),
    ...member,
  };
  mockTeamMembers.push(newMember);
  return new Promise((resolve) => {
    setTimeout(() => resolve(newMember), 100);
  });
}

/**
 * Update an existing team member
 * TODO: Replace with actual API call
 * Example: return fetch(`/api/team-members/${id}`, { method: 'PUT', body: JSON.stringify(member) }).then(res => res.json())
 */
export async function updateTeamMember(
  id: string,
  member: Omit<TeamMember, "id">
): Promise<TeamMember> {
  const index = mockTeamMembers.findIndex((m) => m.id === id);
  const updatedMember: TeamMember = { id, ...member };
  if (index !== -1) {
    mockTeamMembers[index] = updatedMember;
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(updatedMember), 100);
  });
}

/**
 * Delete a team member
 * TODO: Replace with actual API call
 * Example: return fetch(`/api/team-members/${id}`, { method: 'DELETE' })
 */
export async function deleteTeamMember(id: string): Promise<void> {
  const index = mockTeamMembers.findIndex((m) => m.id === id);
  if (index !== -1) {
    mockTeamMembers.splice(index, 1);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 100);
  });
}

