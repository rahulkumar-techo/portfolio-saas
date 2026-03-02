/**
 * Revalidate published portfolio
 */

import { revalidatePath } from "next/cache";

export function revalidatePortfolio(username: string) {
  revalidatePath(`/${username}`);
}