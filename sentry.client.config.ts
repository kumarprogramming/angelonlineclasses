// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1913105fc3dd3055bbd148281b0ea1f1@o4508002749644800.ingest.de.sentry.io/4508903465418832",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
