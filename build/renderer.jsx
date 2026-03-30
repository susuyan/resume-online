import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { prepareWithSegments, layout, layoutWithLines } from "@chenglou/pretext";

/* ── Page constants ────────────────────────────────────────── */
const PAGE_W = 620;
const PAGE_H = Math.round(PAGE_W * (297 / 210));
const DEFAULT_PAD = 40;
const FONT = "InterVariable, sans-serif";
const LH_MIN = 1.15;
const LH_MAX = 1.8;
const LH_DEFAULT = 1.5;
const FS_MAX_DEFAULT = 14;

/* ── Helper: Process inline bold (**text**) ───────────────────── */
function processInlineBold(text) {
  // Convert **text** to Unicode bold characters for rendering
  // This is a visual approximation; for true rich text would need multi-span rendering
  return text.replace(/\*\*(.+?)\*\*/g, (match, content) => {
    // Unicode Mathematical Bold Sans-Serief characters (approximation)
    const boldMap = {
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
      'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
      'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
      'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
      'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
      'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
      'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
      '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱',
      '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
      ' ': ' ', '-': '-', '_': '_', '.': '.', '@': '@', ':': ':'
    };
    return content.split('').map(char => boldMap[char] || char).join('');
  });
}

/* ── Helper: Parse table rows ─────────────────────────────────── */
function parseTableRow(line) {
  // Split by | and trim, removing empty first/last elements
  const cells = line.split('|').map(cell => cell.trim()).filter((cell, idx, arr) => {
    // Remove leading/trailing empty cells from | at start/end
    if (idx === 0 && cell === '') return false;
    if (idx === arr.length - 1 && cell === '') return false;
    return true;
  });
  return cells;
}

function isTableSeparator(line) {
  // Match |---|---| pattern
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

/* ── Parse markdown into blocks ────────────────────────────── */
function parseMarkdown(md) {
  const blocks = [];
  const lines = md.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      blocks.push({ type: "hr", mb: 16 });
      i++;
      continue;
    }

    // H1 title
    if (line.startsWith("# ")) {
      blocks.push({ text: processInlineBold(line.slice(2)), fontScale: 1.5, bold: true, mb: 4, color: "#111" });
      i++;
      continue;
    }

    // H2 section header
    if (line.startsWith("## ")) {
      blocks.push({ text: processInlineBold(line.slice(3)), fontScale: 0.85, bold: true, mt: 18, mb: 3, color: "#999" });
      i++;
      continue;
    }

    // H3 item header
    if (line.startsWith("### ")) {
      const prev = blocks[blocks.length - 1];
      const afterSection = prev && prev.fontScale === 0.85 && prev.bold;
      blocks.push({ text: processInlineBold(line.slice(4)), fontScale: 1, bold: true, mt: afterSection ? 0 : 10, mb: 2, color: "#111" });
      i++;
      continue;
    }

    // Blockquote (> text)
    if (line.startsWith("> ")) {
      blocks.push({ text: processInlineBold(line.slice(2)), fontScale: 0.9, bold: false, mb: 6, color: "#666", italic: true });
      i++;
      continue;
    }

    // List items
    if (line.startsWith("- ")) {
      blocks.push({ text: "\u2022 " + processInlineBold(line.slice(2)), fontScale: 1, bold: false, mb: 3, color: "#555" });
      i++;
      continue;
    }

    // Table (lines with |)
    if (line.includes("|") && line.trim().startsWith("|")) {
      // Skip table separator line (|---|---|)
      if (isTableSeparator(line)) {
        i++;
        continue;
      }

      // Parse table rows
      const tableRows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
        if (!isTableSeparator(lines[i])) {
          tableRows.push(parseTableRow(lines[i]));
        }
        i++;
      }

      // Render table as formatted text
      // First row is header
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const headerText = header.join(" | ");
        blocks.push({ text: processInlineBold(headerText), fontScale: 0.8, bold: true, mb: 4, color: "#333" });

        // Data rows
        for (let rowIdx = 1; rowIdx < tableRows.length; rowIdx++) {
          const row = tableRows[rowIdx];
          const rowText = row.join(" | ");
          blocks.push({ text: processInlineBold(rowText), fontScale: 0.75, bold: false, mb: 2, color: "#555" });
        }
      }
      continue;
    }

    // Default text handling with context
    const prevBlock = blocks[blocks.length - 1];
    const isAfterTitle = prevBlock && prevBlock.bold && prevBlock.fontScale === 1 && prevBlock.mb === 2;

    if (isAfterTitle) {
      blocks.push({ text: processInlineBold(line), fontScale: 0.8, bold: false, mb: 6, color: "#999" });
    } else if (prevBlock && prevBlock.fontScale === 1.5) {
      blocks.push({ text: processInlineBold(line), fontScale: 1, bold: false, mb: 6, color: "#555" });
    } else if (prevBlock && !prevBlock.bold && prevBlock.color === "#555" && prevBlock.mb === 6 && prevBlock.fontScale === 1) {
      blocks.push({ text: processInlineBold(line), fontScale: 0.8, bold: false, mb: 16, color: "#999" });
    } else {
      blocks.push({ text: processInlineBold(line), fontScale: 1, bold: false, mb: 6, color: "#333" });
    }
    i++;
  }

  return blocks;
}

/* ── Build font string (same for prepare + DOM) ──────────── */
function fontString(baseFontSize, block) {
  const fs = baseFontSize * block.fontScale;
  return `${block.bold ? "bold " : ""}${fs}px ${FONT}`;
}

/* ── Measure blocks (pure math, no DOM) ────────────────────── */
function measureBlocks(blocks, baseFontSize, contentW, lhMult = LH_DEFAULT, sectionSpacing = 18, itemSpacing = 10, separatorSpacing = 16) {
  let h = 0;
  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    if (block.mt) {
      const isSection = block.fontScale === 0.85 && block.bold;
      const isItem = block.mt > 0 && !isSection;
      h += isSection ? sectionSpacing : isItem ? itemSpacing : block.mt;
    }
    if (block.type === "hr") {
      h += separatorSpacing + 1 + separatorSpacing;
      continue;
    }
    const fs = baseFontSize * block.fontScale;
    const lh = fs * lhMult;
    const font = fontString(baseFontSize, block);
    h += layout(prepareWithSegments(block.text, font), contentW, lh).height;
    // Skip mb if the next block has mt or is an hr (spacing is handled by them)
    const next = blocks[idx + 1];
    if (next && (next.mt || next.type === "hr")) continue;
    h += block.mb;
  }
  return h;
}

/* ── Layout blocks into positioned lines ─────────────────── */
function layoutBlocks(blocks, baseFontSize, contentW, pad, lhMult = LH_DEFAULT, sectionSpacing = 18, itemSpacing = 10, separatorSpacing = 16) {
  const positioned = [];
  let y = pad;

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    if (block.mt) {
      const isSection = block.fontScale === 0.85 && block.bold;
      const isItem = block.mt > 0 && !isSection;
      y += isSection ? sectionSpacing : isItem ? itemSpacing : block.mt;
    }
    if (block.type === "hr") {
      y += separatorSpacing;
      positioned.push({ type: "hr", y });
      y += 1 + separatorSpacing;
      continue;
    }

    const fs = baseFontSize * block.fontScale;
    const lh = fs * lhMult;
    const font = fontString(baseFontSize, block);
    const prepared = prepareWithSegments(block.text, font);
    const result = layoutWithLines(prepared, contentW, lh);

    for (const line of result.lines) {
      positioned.push({
        type: "text",
        text: line.text,
        x: pad,
        y,
        font,
        fontSize: fs,
        fontWeight: block.bold ? "bold" : "normal",
        lineHeight: lh,
        color: block.color,
      });
      y += lh;
    }

    // Skip mb if the next block has mt or is an hr (spacing is handled by them)
    const next = blocks[idx + 1];
    if (next && (next.mt || next.type === "hr")) continue;
    y += block.mb;
  }

  return positioned;
}

/* ── Binary search for optimal font size + line height ────── */
function findOptimalFit(blocks, contentW, maxH, minFs = 6, maxFs = 24, sectionSpacing = 18, itemSpacing = 10, separatorSpacing = 16) {
  // Pass 1: max font size at tightest line spacing
  let lo = minFs;
  let hi = maxFs;
  while (hi - lo > 0.01) {
    const mid = (lo + hi) / 2;
    if (measureBlocks(blocks, mid, contentW, LH_MIN, sectionSpacing, itemSpacing, separatorSpacing) <= maxH) lo = mid;
    else hi = mid;
  }
  const fontSize = Math.floor(lo * 100) / 100;

  // Pass 2: expand line-height to fill remaining space
  let lhLo = LH_MIN;
  let lhHi = LH_MAX;
  while (lhHi - lhLo > 0.001) {
    const mid = (lhLo + lhHi) / 2;
    if (measureBlocks(blocks, fontSize, contentW, mid, sectionSpacing, itemSpacing, separatorSpacing) <= maxH) lhLo = mid;
    else lhHi = mid;
  }
  const lineHeightMult = Math.floor(lhLo * 1000) / 1000;

  return { fontSize, lineHeightMult };
}

/* ── Resume Rendering Component ─────────────────────────────── */
function Resume({ markdown, config = {} }) {
  const {
    padding = DEFAULT_PAD,
    maxFontSize = FS_MAX_DEFAULT,
    sectionSpacing = 18,
    itemSpacing = 10,
    separatorSpacing = 16,
  } = config;

  const contentW = PAGE_W - padding * 2;
  const maxH = PAGE_H - padding * 2;

  // Parse markdown into blocks
  const blocks = parseMarkdown(markdown);

  // Find optimal font size and line height
  const { fontSize, lineHeightMult } = findOptimalFit(
    blocks,
    contentW,
    maxH,
    6,
    24,
    sectionSpacing,
    itemSpacing,
    separatorSpacing
  );

  // Cap font size at maxFontSize
  const finalFontSize = Math.min(fontSize, maxFontSize);

  // Layout blocks into positioned lines
  const positioned = layoutBlocks(
    blocks,
    finalFontSize,
    contentW,
    padding,
    lineHeightMult,
    sectionSpacing,
    itemSpacing,
    separatorSpacing
  );

  // Render
  return (
    <div
      data-pagefit-page
      className="relative bg-white"
      style={{
        width: PAGE_W,
        height: PAGE_H,
        overflow: "hidden",
      }}
    >
      {positioned.map((item, i) => {
        if (item.type === "hr") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: padding,
                right: padding,
                top: item.y,
                height: 1,
                backgroundColor: "#ddd",
              }}
            />
          );
        }
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              fontSize: item.fontSize,
              fontWeight: item.fontWeight,
              fontFamily: FONT,
              lineHeight: `${item.lineHeight}px`,
              color: item.color,
              whiteSpace: "pre",
            }}
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
}

/* ── Entry Point for Puppeteer ─────────────────────────────── */
window.renderResume = (markdown, config = {}) => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  // Create React root and render
  const root = createRoot(rootElement);
  root.render(React.createElement(Resume, { markdown, config }));

  // Signal that rendering is complete for Puppeteer
  window.resumeRendered = true;
};

// Export for module usage
export { Resume, parseMarkdown, findOptimalFit, layoutBlocks, measureBlocks };