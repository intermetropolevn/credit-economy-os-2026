import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { resolveAIProvider } from './server/ai/modelRegistry.js';
import { verifyEconomicState } from './server/ai/verificationEngine.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const aiRuntime = resolveAIProvider();
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', demoMode: aiRuntime.mode === 'demo', aiProvider: aiRuntime.provider.displayName });
});
app.post('/api/verify', async (req, res) => {
    const result = await verifyEconomicState((req.body || {}), aiRuntime.provider);
    res.json(result);
});
async function startServer() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (isDevelopment) {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
            server: { middlewareMode: true, host: '0.0.0.0', port },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    }
    else {
        app.use(express.static(path.join(__dirname, 'dist')));
        app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
    }
    app.listen(port, '0.0.0.0', () => {
        console.log(`Credit Economy OS running at http://localhost:${port} (${aiRuntime.mode} AI mode)`);
    });
}
startServer();
