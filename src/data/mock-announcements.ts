import type { Announcement } from '@/types'

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Spring Tournament Registration Open',
    content: 'Registration for the annual spring tournament is now open! Singles and doubles categories available. Sign up before March 10th to secure your spot. Entry fee can be paid with credits.',
    authorId: 'admin-1',
    date: '2026-02-12',
    isPinned: true,
  },
  {
    id: 'ann-2',
    title: 'New Items in the Credit Shop',
    content: 'We have added several new items to the credit shop including family BBQ tickets and group training passes. Check them out and spend your hard-earned credits!',
    authorId: 'admin-2',
    date: '2026-02-10',
    isPinned: false,
  },
  {
    id: 'ann-3',
    title: 'Clubhouse Renovation Update',
    content: 'The clubhouse renovation is progressing well. The new changing rooms are expected to be ready by April. During construction, please use the temporary facilities near Court 6.',
    authorId: 'admin-1',
    date: '2026-02-08',
    isPinned: true,
  },
  {
    id: 'ann-4',
    title: 'Volunteer Appreciation Evening',
    content: 'To thank all our amazing volunteers, we are hosting a special appreciation evening on March 28th. Food, drinks, and a small surprise for our top contributors. Mark your calendars!',
    authorId: 'admin-2',
    date: '2026-02-05',
    isPinned: false,
  },
  {
    id: 'ann-5',
    title: 'Court Booking System Update',
    content: 'The online court booking system has been updated with a new interface. You can now book up to 3 days in advance. Premium members can book 7 days ahead.',
    authorId: 'admin-1',
    date: '2026-02-01',
    isPinned: false,
  },
]
