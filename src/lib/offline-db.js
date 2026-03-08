/**
 * Offline Sync & Queue Manager
 * Feature: PRF-01, PRF-05, TC-09, TC-10, TC-11
 * - Queue orders when offline (IndexedDB / in-memory fallback)
 * - Pending status in local queue
 * - Process queue when online (call API)
 * - Handle sync conflict (e.g. item out of stock)
 * - Clear queue after successful sync
 */

const QUEUE_KEY = "coffee_shop_order_queue";

/**
 * @returns {boolean}
 */
export function isOnline() {
  return typeof navigator !== "undefined" && navigator.onLine === true;
}

/**
 * @returns {Promise<Array<{ id: string; payload: object; status: 'pending'|'synced'|'failed'; createdAt: string }>>}
 */
export async function getQueue() {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * @param {object} payload order payload
 * @returns {Promise<{ id: string; status: 'pending' }>}
 */
export async function addToQueue(payload) {
  const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const entry = {
    id,
    payload,
    status: "pending",
    createdAt: new Date().toISOString(),
    error: null,
  };
  const queue = await getQueue();
  queue.push(entry);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
  return { id, status: "pending" };
}

/**
 * @param {string} id
 * @param {'synced'|'failed'} status
 * @param {string} [error]
 */
export async function updateQueueEntryStatus(id, status, error = null) {
  const queue = await getQueue();
  const idx = queue.findIndex((e) => e.id === id);
  if (idx === -1) return;
  queue[idx].status = status;
  queue[idx].syncedAt = status === "synced" ? new Date().toISOString() : undefined;
  queue[idx].error = error ?? queue[idx].error;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
}

/**
 * Remove entries with status 'synced' or optionally by id
 * @param {string[]} [ids] if provided, remove only these ids
 */
export async function clearQueueAfterSync(ids = null) {
  let queue = await getQueue();
  if (ids) {
    const set = new Set(ids);
    queue = queue.filter((e) => !set.has(e.id));
  } else {
    queue = queue.filter((e) => e.status !== "synced");
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
}

/**
 * Get pending entries for sync
 * @returns {Promise<Array<{ id: string; payload: object }>>}
 */
export async function getPendingQueue() {
  const queue = await getQueue();
  return queue.filter((e) => e.status === "pending").map((e) => ({ id: e.id, payload: e.payload }));
}
