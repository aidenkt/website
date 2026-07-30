const express = require('express');
const path = require('path');
const { PostHog } = require('posthog-node');
const app = express();
const port = 3000;

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') {
    posthog.capture({
      distinctId: req.ip || 'anonymous',
      event: 'page viewed',
      properties: {
        $current_url: req.protocol + '://' + req.get('host') + req.originalUrl,
        $referrer: req.get('referer') || '',
        $user_agent: req.get('user-agent') || '',
      },
    });
  }
  if (req.path === '/resume.pdf') {
    posthog.capture({
      distinctId: req.ip || 'anonymous',
      event: 'resume downloaded',
      properties: {
        $referrer: req.get('referer') || '',
        $user_agent: req.get('user-agent') || '',
      },
    });
  }
  next();
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'resources/static/privacy/index.html'));
});

app.use(express.static('resources/static'))

app.use((err, req, res, next) => {
  posthog.captureException(err, req.ip || 'anonymous');
  next(err);
});

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
