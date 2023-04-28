import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  viewportWidth: 1500,
  viewportHeight: 1000,
  requestTimeout: 60000,
  responseTimeout: 60000,
  defaultCommandTimeout: 60000,
  env: {
    'security_enabled': true
  },
  e2e: {
    baseUrl: 'http://192.168.56.1:5603/tjh',
    setupNodeEvents(on, config) {
    }
  }
});
