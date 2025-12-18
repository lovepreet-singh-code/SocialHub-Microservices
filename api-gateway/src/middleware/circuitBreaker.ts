import CircuitBreaker from 'opossum';
import { Request, Response, NextFunction } from 'express';

const breakerOptions = {
    timeout: 3000, 
    errorThresholdPercentage: 50, 
    resetTimeout: 10000 
};

// Map to hold breakers for each service
const breakers: { [key: string]: CircuitBreaker } = {};

export const getBreaker = (serviceName: string) => {
    if (!breakers[serviceName]) {
        // We create a dummy async function because Opossum wraps a function.
        // For proxying, we manually fire/success/fail the breaker.
        const dummyAction = async () => true; 
        breakers[serviceName] = new CircuitBreaker(dummyAction, breakerOptions);
        
        breakers[serviceName].fallback(() => {
            // This fallback isn't strictly used since we manually check, but good for debugging
            return { error: 'Circuit Open' };
        });
        
        console.log(`Circuit Breaker created for ${serviceName}`);
    }
    return breakers[serviceName];
};

export const circuitBreakerMiddleware = (serviceName: string) => {
    const breaker = getBreaker(serviceName);

    return (req: Request, res: Response, next: NextFunction) => {
        if (breaker.opened) {
            res.status(503).json({ 
                success: false, 
                message: `Service ${serviceName} is temporarily unavailable (Circuit Open)` 
            });
            return;
        }

        // Helper to record success/failure from the proxy config
        // We attach the breaker to the request so the proxy error handler can fail it
        (req as any).breaker = breaker;
        next();
    };
};
