const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false, // Disable SSL verification for local development
      onError: (err, req, res) => {
        console.log('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error' });
      }
    })
  );
};