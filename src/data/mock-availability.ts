import type { Availability } from '@/types'

export const mockAvailability: Availability[] = [
  // Thomas van den Berg (vol-1) — available many slots
  { id: 'avail-1', volunteerId: 'vol-1', dayOfWeek: 0, timeSlot: 'morning' },
  { id: 'avail-2', volunteerId: 'vol-1', dayOfWeek: 0, timeSlot: 'afternoon' },
  { id: 'avail-3', volunteerId: 'vol-1', dayOfWeek: 2, timeSlot: 'evening' },
  { id: 'avail-4', volunteerId: 'vol-1', dayOfWeek: 4, timeSlot: 'afternoon' },
  { id: 'avail-5', volunteerId: 'vol-1', dayOfWeek: 5, timeSlot: 'morning' },
  { id: 'avail-6', volunteerId: 'vol-1', dayOfWeek: 5, timeSlot: 'afternoon' },

  // Sophie Jansen (vol-2) — mostly weekends
  { id: 'avail-7', volunteerId: 'vol-2', dayOfWeek: 4, timeSlot: 'evening' },
  { id: 'avail-8', volunteerId: 'vol-2', dayOfWeek: 5, timeSlot: 'morning' },
  { id: 'avail-9', volunteerId: 'vol-2', dayOfWeek: 5, timeSlot: 'afternoon' },
  { id: 'avail-10', volunteerId: 'vol-2', dayOfWeek: 6, timeSlot: 'morning' },
  { id: 'avail-11', volunteerId: 'vol-2', dayOfWeek: 6, timeSlot: 'afternoon' },

  // Lucas Visser (vol-3) — evenings only
  { id: 'avail-12', volunteerId: 'vol-3', dayOfWeek: 1, timeSlot: 'evening' },
  { id: 'avail-13', volunteerId: 'vol-3', dayOfWeek: 3, timeSlot: 'evening' },
  { id: 'avail-14', volunteerId: 'vol-3', dayOfWeek: 4, timeSlot: 'evening' },

  // Emma de Boer (vol-4) — very flexible
  { id: 'avail-15', volunteerId: 'vol-4', dayOfWeek: 0, timeSlot: 'morning' },
  { id: 'avail-16', volunteerId: 'vol-4', dayOfWeek: 1, timeSlot: 'afternoon' },
  { id: 'avail-17', volunteerId: 'vol-4', dayOfWeek: 2, timeSlot: 'morning' },
  { id: 'avail-18', volunteerId: 'vol-4', dayOfWeek: 3, timeSlot: 'afternoon' },
  { id: 'avail-19', volunteerId: 'vol-4', dayOfWeek: 5, timeSlot: 'morning' },
  { id: 'avail-20', volunteerId: 'vol-4', dayOfWeek: 6, timeSlot: 'morning' },

  // Daan Mulder (vol-5) — weekends
  { id: 'avail-21', volunteerId: 'vol-5', dayOfWeek: 5, timeSlot: 'afternoon' },
  { id: 'avail-22', volunteerId: 'vol-5', dayOfWeek: 5, timeSlot: 'evening' },
  { id: 'avail-23', volunteerId: 'vol-5', dayOfWeek: 6, timeSlot: 'morning' },

  // Lisa de Groot (vol-6) — mornings
  { id: 'avail-24', volunteerId: 'vol-6', dayOfWeek: 1, timeSlot: 'morning' },
  { id: 'avail-25', volunteerId: 'vol-6', dayOfWeek: 3, timeSlot: 'morning' },
  { id: 'avail-26', volunteerId: 'vol-6', dayOfWeek: 5, timeSlot: 'morning' },

  // Bram Hendriks (vol-7) — afternoons
  { id: 'avail-27', volunteerId: 'vol-7', dayOfWeek: 0, timeSlot: 'afternoon' },
  { id: 'avail-28', volunteerId: 'vol-7', dayOfWeek: 2, timeSlot: 'afternoon' },
  { id: 'avail-29', volunteerId: 'vol-7', dayOfWeek: 4, timeSlot: 'afternoon' },
  { id: 'avail-30', volunteerId: 'vol-7', dayOfWeek: 6, timeSlot: 'afternoon' },
]
