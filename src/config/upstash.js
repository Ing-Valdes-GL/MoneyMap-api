import { Redis } from "@upstash/redis";
import pkg from "@upstash/ratelimit";
const { Ratelimit } = pkg; // note la majuscule 'Ratelimit'

import "dotenv/config";

// Créer le rate limiter
const ratelimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(80, "60 s") // 80 requêtes / 60 secondes
});

export default ratelimiter;
    