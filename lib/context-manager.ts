import { ChatMessage } from "./personas/types";

/**
 * Context management strategy
 * -----------------------------------------------------------------------
 * Naive approach (what most clone submissions do): send the entire message
 * history on every request. Works for short chats, silently degrades for
 * long ones — token cost grows unbounded, and models pay less attention
 * per-message as the transcript grows, causing persona drift.
 *
 * This implementation: a sliding window of the most recent turns, verbatim,
 * plus a compact rolling summary of everything older than that window. The
 * summary is generated once older turns fall out of the window, then reused
 * (not regenerated every request) and only re-summarized when it grows stale.
 */

const RECENT_TURN_WINDOW = 12; // messages (~6 user/assistant exchanges)
const SUMMARIZE_THRESHOLD = 16; // only bother summarizing once history is long enough to matter

export interface BuiltContext {
  /** Optional synthetic system message carrying the rolling summary. */
  summaryMessage: ChatMessage | null;
  /** Verbatim recent turns to send as-is. */
  recentMessages: ChatMessage[];
}

export function buildContextWindow(
  fullHistory: ChatMessage[],
  existingSummary: string | null
): BuiltContext {
  if (fullHistory.length <= SUMMARIZE_THRESHOLD) {
    return { summaryMessage: null, recentMessages: fullHistory };
  }

  const recentMessages = fullHistory.slice(-RECENT_TURN_WINDOW);
  const summaryMessage: ChatMessage | null = existingSummary
    ? {
        role: "user",
        content: `[Conversation memory so far — do not repeat this back, just use it as context]\n${existingSummary}`,
      }
    : null;

  return { summaryMessage, recentMessages };
}

/** Turns that have aged out of the recent window and need folding into the summary. */
export function getMessagesToSummarize(fullHistory: ChatMessage[]): ChatMessage[] {
  if (fullHistory.length <= SUMMARIZE_THRESHOLD) return [];
  return fullHistory.slice(0, fullHistory.length - RECENT_TURN_WINDOW);
}

export function shouldRefreshSummary(fullHistory: ChatMessage[]): boolean {
  return fullHistory.length > SUMMARIZE_THRESHOLD;
}
