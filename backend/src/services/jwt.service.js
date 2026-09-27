import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export class JwtService {

    createToken(payload) {
        try {
            return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        } catch (error) {
            throw new Error(`Erro ao gerar token (service): ${error}`);
        }
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error(`Erro ao verificar token (service): ${error}`);
        }
    }

}