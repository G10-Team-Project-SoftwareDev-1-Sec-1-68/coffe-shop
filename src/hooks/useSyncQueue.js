/**
 * Hook / facade for offline sync queue.
 * Uses offline-db and can trigger sync when online.
 */

import {
  isOnline,
  getQueue,
  addToQueue,
  getPendingQueue,
  updateQueueEntryStatus,
  clearQueueAfterSync,
} from "@/lib/offline-db";

export {
  isOnline,
  getQueue,
  addToQueue,
  getPendingQueue,
  updateQueueEntryStatus,
  clearQueueAfterSync,
};
