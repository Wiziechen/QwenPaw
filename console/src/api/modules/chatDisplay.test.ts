import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../request", () => ({
  request: vi.fn(),
}));

import { request } from "../request";
import { chatDisplayApi } from "./chatDisplay";

describe("chatDisplayApi", () => {
  beforeEach(() => {
    vi.mocked(request).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("reads sparse chat display defaults", async () => {
    vi.mocked(request).mockResolvedValue({});

    await expect(chatDisplayApi.get()).resolves.toEqual({});
    expect(request).toHaveBeenCalledWith("/config/chat-display");
  });

  it("updates the persisted chat display defaults", async () => {
    const chatDisplay = { assistant_message_display_mode: "process-collapsed" };
    vi.mocked(request).mockResolvedValue(chatDisplay);

    await expect(chatDisplayApi.update(chatDisplay)).resolves.toEqual(
      chatDisplay,
    );
    expect(request).toHaveBeenCalledWith("/config/chat-display", {
      method: "PUT",
      body: JSON.stringify(chatDisplay),
    });
  });

  it("resets the persisted chat display defaults", async () => {
    vi.mocked(request).mockResolvedValue(undefined);

    await expect(chatDisplayApi.reset()).resolves.toBeUndefined();
    expect(request).toHaveBeenCalledWith("/config/chat-display", {
      method: "DELETE",
    });
  });
});
