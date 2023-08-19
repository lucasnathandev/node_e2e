import { describe, before, after, it } from "node:test";
import { deepStrictEqual, ok, strictEqual } from "node:assert";

const BASE_URL = "http://localhost:3000";

describe("API workflow", () => {
  let _server = {};

  before(async () => {
    _server = (await import("./api.js")).app;
    await new Promise((resolve) => _server.once("listening", resolve));
  });

  after((done) => {
    _server.close(done);
  });

  it("should receive not authorized given wrong user and password", async () => {
    const data = {
      user: "lucas",
      password: "",
    };

    const request = await fetch(BASE_URL + "/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    strictEqual(request.status, 401);

    const response = await request.json();

    deepStrictEqual(response, { error: "user invalid" });
  });
});
