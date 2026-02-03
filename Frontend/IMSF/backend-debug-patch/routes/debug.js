// routes/debug.js
const express = require('express');
const router = express.Router();

router.post('/echo', (req, res) => {
  res.json({
    ok: true,
    received: {
      headers: req.headers,
      body: req.body,
      time: new Date().toISOString()
    }
  });
});

module.exports = router;
