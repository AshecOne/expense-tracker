// Ubah baris ini
require('dotenv').config({ path: '.env.local' });

// Menjadi seperti ini
import { config } from 'dotenv';
config({ path: '.env.local' });

const nextConfig = {};

export default nextConfig;