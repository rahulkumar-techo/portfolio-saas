/**
 * AI Merge Logic
 * Prevents destructive overwrite
 */

export function safeMergePortfolio(current: any, aiOutput: any) {

  return {
    ...current,
    content: {
      ...current.content,
      ...aiOutput.content,
    },
    design: {
      ...current.design,
      ...aiOutput.design,
    },
  };
}