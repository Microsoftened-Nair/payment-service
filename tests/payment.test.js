const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/server");
const { JWT_SECRET } = require("../src/middleware/auth");

describe("Payment Service Integration Test Suite", () => {
  let validToken;

  beforeAll(() => {
    validToken = jwt.sign(
      { userId: "usr_1029", username: "fin_admin", role: "finance" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  it("GET /health returns 200 and healthy status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("HEALTHY");
    expect(res.body.service).toBe("payment-service");
  });

  it("POST /api/payments/charge rejects requests without Bearer token (401)", async () => {
    const res = await request(app)
      .post("/api/payments/charge")
      .send({ amount: 100, currency: "USD", recipientId: "rec_99" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("UNAUTHORIZED");
  });

  it("POST /api/payments/charge succeeds with valid JWT Bearer token", async () => {
    const res = await request(app)
      .post("/api/payments/charge")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        amount: 250.50,
        currency: "USD",
        recipientId: "rec_merchant_42",
        description: "Cloud subscription payment",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("SUCCESS");
    expect(res.body.transaction.amount).toBe(250.50);
    expect(res.body.transaction.currency).toBe("USD");
    expect(res.body.transaction.status).toBe("SETTLED");
  });
});
