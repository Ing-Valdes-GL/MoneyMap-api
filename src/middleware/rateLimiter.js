import ratelimit from "../config/upstash.js";


const rateLimiter = async (req, res, next) => {
    try {
        // Vérifier si la limite de requêtes est atteinte
        const { success } = await ratelimit.limit("my-rate-limit");
        if (!success) {
            return res.status(429).json({ message: "Veuillez réessayer plus tard." });
        }
        next();
    } catch (error) {
        console.error("Rate limit exceeded:", error);
        next({ error });
    }
};
export default rateLimiter;
