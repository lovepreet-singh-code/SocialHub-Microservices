import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import timeout from 'connect-timeout';
import { circuitBreakerMiddleware } from './middleware/circuitBreaker';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(timeout('5s'));

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';
const POST_SERVICE_URL = process.env.POST_SERVICE_URL || 'http://localhost:5002';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5003';

// Proxy Factory
const createServiceProxy = (target: string, name: string) => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: (path, _req) => {
            // Simple rewrite: /auth -> /auth, /users -> /users
            // We can customize if services have prefixes
            return path;
        },
        onProxyReq: (_proxyReq, _req, _res) => {
            // If needed, we can log start
        },
        onProxyRes: (proxyRes, req, _res) => {
            // If status is 5xx, we might consider it a failure for the breaker
            const breaker = (req as any).breaker;
            if (proxyRes.statusCode && proxyRes.statusCode >= 500) {
                if (breaker) breaker.fire().catch(() => { });
            }
        },
        onError: (err, _req, res) => {
            // const breaker = (req as any).breaker; // Unused
            // We force a failure in the breaker to record stats
            console.error(`Error communicating with ${name}:`, err);
            res.status(503).json({ message: `${name} Service Unavailable` });
        }
    });
};

// Routes
// Note: We need to strip the prefix for the proxy if the service doesn't expect it?
// User service expects /auth and /users. Gateway receives /auth and /users. No rewrite needed.

app.use(['/auth', '/users', '/media'], circuitBreakerMiddleware('User-Service'), createServiceProxy(USER_SERVICE_URL, 'User-Service'));
app.use('/posts', circuitBreakerMiddleware('Post-Service'), createServiceProxy(POST_SERVICE_URL, 'Post-Service'));
app.use('/notifications', circuitBreakerMiddleware('Notification-Service'), createServiceProxy(NOTIFICATION_SERVICE_URL, 'Notification-Service'));

app.get('/', (_req, res) => {
    res.json({ message: 'API Gateway Running' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
