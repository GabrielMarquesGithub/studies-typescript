import { closeTestApp, createTestApp } from "@tests/utils/test-setup";
import type { FastifyTypedInstance } from "@types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let app: FastifyTypedInstance;

beforeAll(async () => {
	app = await createTestApp();
});

afterAll(async () => {
	await closeTestApp(app);
});

describe("GET /", () => {
	it("Should return hello message when request is successful", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/"
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body).toHaveProperty("message");
		expect(body.message).toBeTypeOf("string");
	});
	it("Should return 404 for methods not allowed", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/"
		});

		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body).toHaveProperty("message");
		expect(body.message).toBeTypeOf("string");
	});
});
