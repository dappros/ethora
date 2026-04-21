#!/usr/bin/env node
// Render features.yaml into:
//   features/README.md          — high-level matrix (all features, SDK columns)
//   features/views/by-category.md — detailed view grouped by category
//
// Usage: npm install && npm run render
// Output is written relative to this script (../ for features/).

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEATURES_DIR = join(__dirname, "..");
const YAML_FILE = join(FEATURES_DIR, "features.yaml");

const STATUS_ICON = {
  present: "✅",
  partial: "🟡",
  roadmap: "🛠",
  absent: "—",
};

const STATUS_LABEL = {
  present: "Present",
  partial: "Partial",
  roadmap: "Roadmap",
  absent: "Absent",
};

function statusCell(entry) {
  if (!entry) return "—";
  return STATUS_ICON[entry.status] || "?";
}

function sortedSdks(sdks) {
  return Object.entries(sdks).sort((a, b) => (a[1].order ?? 99) - (b[1].order ?? 99));
}

function sortedCategories(categories) {
  return [...categories].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

function countStatuses(features, sdkId) {
  const tally = { present: 0, partial: 0, roadmap: 0, absent: 0 };
  for (const f of features) {
    const entry = f.sdks?.[sdkId];
    if (!entry) {
      tally.absent++;
    } else {
      tally[entry.status] = (tally[entry.status] || 0) + 1;
    }
  }
  return tally;
}

function renderOverviewTable(data) {
  const sdks = sortedSdks(data.sdks);
  const sdkIds = sdks.map(([id]) => id);

  let out = "";
  out += "| Feature | " + sdks.map(([, s]) => s.label).join(" | ") + " |\n";
  out += "|---|" + sdks.map(() => "---").join("|") + "|\n";

  const cats = sortedCategories(data.categories);
  for (const cat of cats) {
    const feats = data.features.filter((f) => f.category === cat.id);
    if (feats.length === 0) continue;
    // category header row
    out += `| **${cat.label}** | ${sdkIds.map(() => "").join(" | ")} |\n`;
    for (const f of feats) {
      const cells = sdkIds.map((id) => statusCell(f.sdks?.[id])).join(" | ");
      out += `| ${f.label} | ${cells} |\n`;
    }
  }
  return out;
}

function renderSummaryTable(data) {
  const sdks = sortedSdks(data.sdks);
  const features = data.features;
  const total = features.length;

  let out = "";
  out += "| SDK | Present | Partial | Roadmap | Absent | Coverage |\n";
  out += "|---|---:|---:|---:|---:|---:|\n";

  for (const [id, meta] of sdks) {
    const t = countStatuses(features, id);
    const coverage = Math.round(((t.present + t.partial * 0.5) / total) * 100);
    out += `| **${meta.label}** | ${t.present} | ${t.partial} | ${t.roadmap} | ${t.absent} | ${coverage}% |\n`;
  }
  return out;
}

function renderLegend() {
  return (
    "Legend: " +
    Object.entries(STATUS_ICON)
      .map(([k, v]) => `${v} ${STATUS_LABEL[k]}`)
      .join("  ·  ")
  );
}

function renderReadme(data) {
  const sdks = sortedSdks(data.sdks);
  let out = "";
  out += "# Ethora SDK Feature Matrix\n\n";
  out += `> **Version:** ${data.meta.version}  ·  **Last reviewed:** ${data.meta.last_reviewed}  ·  ${renderLegend()}\n\n`;
  out += "High-level capability coverage across all Ethora SDKs. Source of truth is [`features.yaml`](features.yaml). Detailed view by category, with evidence paths: [views/by-category.md](views/by-category.md).\n\n";

  out += "## Coverage summary\n\n";
  out += renderSummaryTable(data);
  out += `\n_Coverage = (present + partial × 0.5) / ${data.features.length} features._\n\n`;

  out += "## SDK overview\n\n";
  for (const [, meta] of sdks) {
    out += `- **[${meta.label}](${meta.repo})** — ${meta.notes}\n`;
  }
  out += "\n";

  out += "## Full matrix\n\n";
  out += renderOverviewTable(data);
  out += "\n";

  out += "## Methodology\n\n";
  out += data.meta.methodology.trim() + "\n\n";
  out += `Next scheduled review: ${data.meta.next_review}\n\n`;

  out += "## Updating this matrix\n\n";
  out +=
    "1. Edit `features.yaml` — the single source of truth.\n" +
    "2. Run `cd features/scripts && npm install && npm run render` to regenerate `README.md` and `views/by-category.md`.\n" +
    "3. Commit both the YAML and rendered output so diffs are visible in PRs.\n\n";

  return out;
}

function renderByCategory(data) {
  const sdks = sortedSdks(data.sdks);
  const sdkIds = sdks.map(([id]) => id);

  let out = "";
  out += "# SDK Feature Matrix — detailed view\n\n";
  out += "> Rendered from [`features.yaml`](../features.yaml)  ·  " + renderLegend() + "\n\n";
  out +=
    "This view lists every feature by category with status + evidence per SDK. For the condensed matrix, see [../README.md](../README.md).\n\n";

  const cats = sortedCategories(data.categories);
  for (const cat of cats) {
    const feats = data.features.filter((f) => f.category === cat.id);
    if (feats.length === 0) continue;

    out += `## ${cat.label}\n\n`;

    for (const f of feats) {
      out += `### ${f.label}\n\n`;
      if (f.description) out += `${f.description}\n\n`;
      out += "| SDK | Status | Evidence / Notes |\n";
      out += "|---|---|---|\n";
      for (const id of sdkIds) {
        const entry = f.sdks?.[id] || { status: "absent" };
        const icon = STATUS_ICON[entry.status] || "?";
        const label = STATUS_LABEL[entry.status] || "?";
        const bits = [];
        if (entry.evidence) bits.push("`" + entry.evidence + "`");
        if (entry.notes) bits.push(entry.notes);
        out += `| ${data.sdks[id].label} | ${icon} ${label} | ${bits.join(" — ") || "—"} |\n`;
      }
      out += "\n";
    }
  }
  return out;
}

function main() {
  const raw = readFileSync(YAML_FILE, "utf-8");
  const data = yaml.load(raw);

  const readme = renderReadme(data);
  writeFileSync(join(FEATURES_DIR, "README.md"), readme);
  console.log("Wrote features/README.md");

  const byCategory = renderByCategory(data);
  writeFileSync(join(FEATURES_DIR, "views", "by-category.md"), byCategory);
  console.log("Wrote features/views/by-category.md");
}

main();
