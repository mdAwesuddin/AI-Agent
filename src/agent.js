import 'dotenv/config';
import express from 'express';
import agentRoutes from './routes/agent.js';
import taskRoutes from './routes/tasks.js';

const app = express();

app.use(express.json());
app.use('/.well-known', agentRoutes);
app.use('/tasks', taskRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Agent running at http://localhost:${PORT}`);
});
