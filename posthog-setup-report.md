<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog's `posthog-node` SDK was added to `index.js` with a singleton client initialized from environment variables. An Express middleware captures a `page viewed` event for every main page request, with referrer, URL, and user-agent properties. An Express error handler calls `captureException` on any unhandled server errors. A `SIGTERM` handler ensures the PostHog queue is flushed cleanly on shutdown. Environment variables were written to `.env` and `.gitignore` coverage was confirmed.

| Event | Description | File |
|---|---|---|
| `page viewed` | Fired when a visitor loads the main portfolio page (`/` or `/index.html`) | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1606935)
- [Total page views (30 days)](/insights/ZHyTvbey) — bold number KPI for the last 30 days
- [Page views over time](/insights/Nv6Zy6y8) — daily trend line for the last 30 days
- [Unique visitors over time](/insights/ezfB1vd0) — daily unique visitors (DAU) for the last 30 days
- [Page views by referrer](/insights/KCbrVCI9) — bar chart breaking down traffic sources
- [Weekly page views trend](/insights/vk0hSAZz) — week-over-week comparison over the last 90 days

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
