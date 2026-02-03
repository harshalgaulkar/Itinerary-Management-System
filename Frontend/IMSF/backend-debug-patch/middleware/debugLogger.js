// middleware/debugLogger.js
module.exports = function debugLogger(req, res, next) {
  try {
    console.log('--- DEBUG REQUEST START ---');
    console.log('Time:', new Date().toISOString());
    console.log('URL:', req.method, req.originalUrl);
    try {
      console.log('Headers:', JSON.stringify(req.headers, null, 2));
    } catch (hErr) {
      console.log('Headers (raw):', req.headers);
    }
    if (req.body) {
      try {
        console.log('Body:', JSON.stringify(req.body, null, 2));
      } catch (bErr) {
        console.log('Body (raw):', req.body);
      }
    } else {
      console.log('Body: <empty>');
    }
    console.log('--- DEBUG REQUEST END ---');
  } catch (e) {
    console.error('debugLogger error:', e);
  }
  next();
};
