import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`[EcoQuest Server] Running on http://localhost:${config.port} (${config.nodeEnv})`);
});

process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err);
});

export default server;
