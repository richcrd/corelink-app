export type User = {
  id?: string;
  personId?: string;
  username: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return 'Invitado';
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return fullName || user.username || 'Invitado';
}
