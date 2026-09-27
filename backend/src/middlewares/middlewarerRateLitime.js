import rateLimit from 'express-rate-limit';

// Limita tentativas de login
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    }
});

// Limita criação de contas
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        error: 'Limite de cadastros excedido. Tente novamente mais tarde.'
    }
});