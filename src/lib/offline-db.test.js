// Context: Unit testing for offline-first synchronization
// Feature: PRF-01, PRF-05, TC-09, TC-10, TC-11

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isOnline,
  getQueue,
  addToQueue,
  getPendingQueue,
  updateQueueEntryStatus,
  clearQueueAfterSync,
} from "@/lib/offline-db";

describe("Offline Sync Manager", () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    const store = {};
    const mockLocalStorage = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
      removeItem: vi.fn((key) => { delete store[key]; }),
      clear: vi.fn(() => { for (const key in store) delete store[key]; }),
    };
    
    vi.stubGlobal("localStorage", mockLocalStorage);
    vi.stubGlobal("navigator", { onLine: false });
  });

  // Scenario: Add order to queue when navigator.onLine is false
  it("adds order to queue when offline (navigator.onLine is false)", async () => {
    const payload = { items: [{ id: "1", qty: 2 }], total: 100 };
    const result = await addToQueue(payload);
    expect(result.id).toBeDefined();
    expect(result.status).toBe("pending");
    const queue = await getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].payload).toEqual(payload);
    expect(queue[0].status).toBe("pending");
  });

  // Scenario: Order should have 'pending' status in local queue
  it("order has 'pending' status in local queue", async () => {
    await addToQueue({ items: [] });
    const pending = await getPendingQueue();
    expect(pending.length).toBe(1);
    expect(pending[0].payload).toEqual({ items: [] });
  });

  // Scenario: When online, process queue and call API (we test queue state; API call is integration)
  it("getPendingQueue returns only pending entries for sync", async () => {
    await addToQueue({ a: 1 });
    await addToQueue({ b: 2 });
    const pending = await getPendingQueue();
    expect(pending.length).toBe(2);
    await updateQueueEntryStatus(pending[0].id, "synced");
    const pendingAfter = await getPendingQueue();
    expect(pendingAfter.length).toBe(1);
  });

  // Scenario: Handle sync conflict (e.g., item out of stock during offline)
  it("can mark entry as failed with error (e.g. conflict / out of stock)", async () => {
    const { id } = await addToQueue({ productId: "x", qty: 10 });
    await updateQueueEntryStatus(id, "failed", "Item out of stock");
    const queue = await getQueue();
    const entry = queue.find((e) => e.id === id);
    expect(entry.status).toBe("failed");
    expect(entry.error).toBe("Item out of stock");
  });

  // Scenario: Clear local queue after successful sync
  it("clears synced entries from queue after successful sync", async () => {
    const r1 = await addToQueue({ a: 1 });
    const r2 = await addToQueue({ b: 2 });
    await updateQueueEntryStatus(r1.id, "synced");
    await updateQueueEntryStatus(r2.id, "synced");
    await clearQueueAfterSync();
    const queue = await getQueue();
    expect(queue.length).toBe(0);
  });

  it("clearQueueAfterSync(ids) removes only given ids", async () => {
    const r1 = await addToQueue({ a: 1 });
    await addToQueue({ b: 2 });
    await updateQueueEntryStatus(r1.id, "synced");
    await clearQueueAfterSync([r1.id]);
    const queue = await getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].payload).toEqual({ b: 2 });
  });

  it("isOnline reflects navigator.onLine", () => {
    vi.stubGlobal("navigator", { onLine: false });
    expect(isOnline()).toBe(false);
    vi.stubGlobal("navigator", { onLine: true });
    expect(isOnline()).toBe(true);
  });
});
