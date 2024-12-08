const FORBIDDEN_WORDS = ["list", "of", "forbidden", "words"];

export function validateReview(content: string): boolean {
  const lowercaseContent = content.toLowerCase();

  // Vérifier la longueur
  if (content.length > 800) return false;

  // Vérifier les mots interdits
  return !FORBIDDEN_WORDS.some((word) => lowercaseContent.includes(word));
}
