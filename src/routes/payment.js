const express = require("express");
const axios = require("axios");

const router = express.Router();

// Mock in-memory transaction store
const transactions = [];

/**
 * POST /api/payments/charge
 * Process a credit or debit charge request.
 */
router.post("/charge", async (req, res) => {
  const { amount, currency, recipientId, description } = req.body;

  if (!amount || amount <= 0 || !currency || !recipientId) {
    return res.status(400).json({
      error: "INVALID_TRANSACTION",
      message: "Required fields: amount > 0, currency, recipientId",
    });
  }

  const transaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    amount: parseFloat(amount),
    currency: currency.toUpperCase(),
    recipientId,
    description: description || "Payment charge",
    status: "SETTLED",
    createdAt: new Date().toISOString(),
    processedBy: req.user ? req.user.username : "anonymous",
  };

  transactions.push(transaction);

  // Simulated optional webhook notification dispatch
  if (process.env.WEBHOOK_URL) {
    try {
      await axios.post(process.env.WEBHOOK_URL, {
        event: "payment.settled",
        data: transaction,
      }, { timeout: 3000 });
    } catch {
      // Non-blocking webhook failure
    }
  }

  return res.status(201).json({
    status: "SUCCESS",
    transaction,
  });
});

/**
 * GET /api/payments/history
 * List recent transactions.
 */
router.get("/history", (req, res) => {
  res.json({
    total: transactions.length,
    transactions: transactions.slice(-20),
  });
});

module.exports = router;
