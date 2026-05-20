<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to both the Express server (`index.js`) and the client-side HTML (`resources/static/index.html`). The server-side SDK (`posthog-node`) was already installed and has been configured with `enableExceptionAutocapture: true` for automatic error tracking. A new `resume downloaded` event was added to track when visitors access the resume PDF. Client-side tracking was added via the posthog-js snippet for `email clicked` and `linkedin clicked` events, capturing engagement with the two main contact links. Graceful shutdown and error middleware capture are both in place.

| Event | Description | File |
|---|---|---|
| `page viewed` | User visited the homepage (already implemented) | `index.js` |
| `resume downloaded` | User accessed the resume PDF via `/resume.pdf` | `index.js` |
| `email clicked` | User clicked the email contact link | `resources/static/index.html` |
| `linkedin clicked` | User clicked the LinkedIn profile link | `resources/static/index.html` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1607210)
- [Page views over time](/insights/2U2N4n8f)
- [Contact link clicks over time](/insights/zaUjzeMQ)
- [Resume downloads over time](/insights/g43tfZu4)
- [Contact conversion rate (visitors who click contact)](/insights/RiOCwxsX)
- [Total contact actions (last 30 days)](/insights/tKBttj4a)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
