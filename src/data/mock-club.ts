import type { Club } from '@/types'

export const mockClub: Club = {
  id: 'club-1',
  name: 'SV Oranje',
  sportType: 'Tennis',
  creditName: 'Credits',
  creditSymbol: 'CR',
  creditToEuroRatio: 0.5,
  stats: {
    totalMembers: 248,
    activeVolunteers: 42,
    totalCreditsIssued: 4850,
    totalCreditsSpent: 3200,
    tasksCompleted: 156,
    tasksOpen: 12,
  },
}
