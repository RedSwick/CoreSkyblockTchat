/**
 * Les erreurs Supabase (PostgrestError, AuthError...) ne sont pas des
 * `instanceof Error` natives mais des objets avec un champ `message` — un
 * simple `err instanceof Error` les rate et masque la vraie cause derrière un
 * texte générique. Cette fonction couvre les deux cas.
 */
export function getErrorMessage(err: unknown, fallback = 'Une erreur est survenue'): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message
  }
  return fallback
}
