/**
 * Generate stable color from string
 * Same text = same color
 */

export function generateColorFromString(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;

  return `hsl(${h}, 65%, 55%)`;
}