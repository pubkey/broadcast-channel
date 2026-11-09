import { BUILD_ENV, BUILD_ENV_TYPE } from "@toruslabs/constants";
import { describe, expect, it } from "vite-plus/test";

import { fillOptionsWithDefaults } from "../../src/options";

const EXPECTED_SERVER_URLS: Record<BUILD_ENV_TYPE, { api_url: string; socket_url: string }> = {
  [BUILD_ENV.PRODUCTION]: { api_url: "https://api.web3auth.io/session-service/v2", socket_url: "https://session.web3auth.io" },
  [BUILD_ENV.STAGING]: { api_url: "https://api.web3auth.io/session-service/v2", socket_url: "https://session.web3auth.io" },
  [BUILD_ENV.DEVELOPMENT]: { api_url: "https://api-develop.web3auth.io/session-service/v2", socket_url: "https://develop-session.web3auth.io" },
  [BUILD_ENV.TESTING]: { api_url: "https://api-develop.web3auth.io/session-service/v2", socket_url: "https://develop-session.web3auth.io" },
};

describe("fillOptionsWithDefaults", () => {
  it.each(Object.values(BUILD_ENV))("sets the server URLs for build_env %s", (buildEnv) => {
    const { server } = fillOptionsWithDefaults({ server: { build_env: buildEnv } });
    expect(server.api_url).toBe(EXPECTED_SERVER_URLS[buildEnv].api_url);
    expect(server.socket_url).toBe(EXPECTED_SERVER_URLS[buildEnv].socket_url);
  });

  it("uses the production server when build_env is not set", () => {
    const { server } = fillOptionsWithDefaults();
    expect(server.build_env).toBe(BUILD_ENV.PRODUCTION);
    expect(server.api_url).toBe(EXPECTED_SERVER_URLS[BUILD_ENV.PRODUCTION].api_url);
    expect(server.socket_url).toBe(EXPECTED_SERVER_URLS[BUILD_ENV.PRODUCTION].socket_url);
  });

  it("keeps server URLs that the caller sets", () => {
    const { server } = fillOptionsWithDefaults({ server: { api_url: "https://example.com/api", socket_url: "https://example.com" } });
    expect(server.api_url).toBe("https://example.com/api");
    expect(server.socket_url).toBe("https://example.com");
  });
});
