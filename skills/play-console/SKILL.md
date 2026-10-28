---
name: play-console
description: "Query and manage Google Play Developer Console via MCP. Manage Android app tracks (internal, alpha/closed testing, beta, production), releases, staged rollouts, release notes, user reviews, store listings, Android Vitals (crash rate, ANRs), and bundle/APK metadata."
license: MIT
---

# Google Play Console MCP: App Publishing & Vitals Management

Use this skill when interacting with Google Play Developer Console, querying releases, managing tracks (internal, closed testing, open testing, production), inspecting user reviews, checking Android Vitals, or updating store metadata.

---

## 1. Prerequisites & Environment

The MCP server connects to Google Play Developer API via a Google Cloud Service Account with API access enabled in Play Console:

* **Node.js**: Required (`npx -y @orellbuehler/play-console-mcp@0.3.1`).
* **Service Account Key**: JSON credentials file downloaded from Google Cloud IAM with service account granted access under **Play Console → Users and permissions**.
* **Environment Variables**:
  * `GOOGLE_SERVICE_ACCOUNT_KEY_PATH`: Absolute path to service account JSON (e.g., `C:\Users\super\.gemini\play-console-key.json`).
  * `GOOGLE_PLAY_PACKAGE_NAME` *(optional)*: Default application package name (e.g., `com.tapop.app`).

### MCP Server Registration

#### Claude Desktop (`claude_desktop_config.json`)
```json
"play-console": {
  "command": "cmd.exe",
  "args": ["/d", "/c", "npx", "-y", "@orellbuehler/play-console-mcp@0.3.1"],
  "env": {
    "GOOGLE_SERVICE_ACCOUNT_KEY_PATH": "C:\\Users\\super\\.gemini\\play-console-key.json"
  }
}
```

#### ChatGPT / Codex (`config.toml`)
```toml
[mcp_servers.play-console]
command = "cmd.exe"
args = ["/d", "/c", "npx", "-y", "@orellbuehler/play-console-mcp@0.3.1"]

[mcp_servers.play-console.env]
GOOGLE_SERVICE_ACCOUNT_KEY_PATH = "C:\\Users\\super\\.gemini\\play-console-key.json"
```

#### Google Antigravity (`settings.json`)
```json
"play-console": {
  "command": "cmd.exe",
  "args": ["/d", "/c", "npx", "-y", "@orellbuehler/play-console-mcp@0.3.1"],
  "env": {
    "GOOGLE_SERVICE_ACCOUNT_KEY_PATH": "C:\\Users\\super\\.gemini\\play-console-key.json"
  }
}
```

---

## 2. Core Capabilities & Tool Playbooks

### A. Tracks & Releases

* **List Tracks**: `list_tracks({ packageName: "com.tapop.app" })`
  * Inspect existing tracks (`internal`, `alpha`, `beta`, `production`).
* **Inspect Current Release on Track**:
  ```json
  get_track({
    "packageName": "com.tapop.app",
    "track": "alpha"
  })
  ```
  Returns status (`draft`, `inProgress`, `completed`, `halted`), version codes, release name, and user fraction.
* **Promote Release**:
  ```json
  promote_release({
    "packageName": "com.tapop.app",
    "fromTrack": "internal",
    "toTrack": "alpha",
    "status": "completed"
  })
  ```
* **Staged Rollout Management**:
  * Adjust rollout percentage: `update_rollout({ packageName, track: "production", userFraction: 0.2 })` (for 20%).
  * Halt rollout on spike in crash rates: `halt_rollout({ packageName, track: "production" })`.

### B. Bundles & APK Verification

* **List Uploaded App Bundles**:
  ```json
  list_bundles({ "packageName": "com.tapop.app" })
  ```
  Returns version codes, bundle IDs, and SHA256 hashes to verify newly built `.aab` artifacts against Play Store.

### C. Android Vitals & Crash Diagnostics

* **Crash Rate**: `query_crash_rate({ packageName, dimension: "API_LEVEL" })`
* **ANR Rate**: `query_anr_rate({ packageName })`
* **Search Errors & Stack Traces**: `search_error_issues({ packageName })` & `search_error_reports({ packageName, issueId })`
* **Performance Vitals**:
  * `query_slow_start_rate`: App startup latency anomalies.
  * `query_slow_rendering_rate`: Frozen/slow frame rates (>16ms/frame).
  * `query_lmk_rate`: Low Memory Killer kills.

### D. User Reviews & Ratings

* **Fetch Recent Reviews**:
  ```json
  list_reviews({ "packageName": "com.tapop.app", "maxResults": 20 })
  ```
* **Reply to Review**:
  ```json
  reply_to_review({
    "packageName": "com.tapop.app",
    "reviewId": "review_id_here",
    "replyText": "Thank you for the feedback! We fixed this in update 0.3.0."
  })
  ```

### E. Store Listing & Metadata

* **Fetch Store Listing**: `list_listings({ packageName: "com.tapop.app" })`
* **Update Store Description**:
  ```json
  update_listing({
    "packageName": "com.tapop.app",
    "language": "en-US",
    "title": "Tapop! - Tap to Pop!",
    "shortDescription": "Addictive colorful block-popping puzzle game",
    "fullDescription": "..."
  })
  ```

---

## 3. Best Practices & Safety Guardrails

1. **Service Account Permissions**:
   * For viewing analytics and reviews: `Viewer` or `Read-only` permissions are sufficient.
   * For uploading releases and managing tracks: `Releases: Manage production and testing tracks` is required.
2. **Version Code Constraints**:
   * Google Play requires strictly monotonically increasing `versionCode` integers (`1, 2, 3...`).
   * Never reset or reuse a `versionCode`.
3. **Draft vs Completed Releases**:
   * When creating a release in Closed Testing or Production via API, setting status to `draft` allows human review and manual submit in the Play Console UI.
   * Setting status to `completed` makes it immediately enter the review queue.
4. **Credential Security**:
   * Never commit service account JSON files to version control (`.gitignore` must contain `*play-console-key*.json`).
