// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post('/check', (req, res) => {
  const { invoiceAmount } = req.body;

  // simple placeholder logic
  const flagged = invoiceAmount > 10000;

-  res.json({ fraud: flagged });
+  res.json({ flagged });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
