import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import config from './resume-config.json';
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

/* ── Page constants ────────────────────────────────────────── */
const PAGE_W = config.layout.pageWidth;
const PAGE_H = config.layout.pageHeight;
const DEFAULT_PAD = config.layout.padding;
const FONT = config.fonts.primary || "InterVariable, sans-serif";
const LH_MIN = config.typography.lineHeightRange.min;
const LH_MAX = config.typography.lineHeightRange.max;
const LH_DEFAULT = config.typography.lineHeightRange.default;
const FS_MIN = config.typography.fontSizeRange.min;
const FS_MAX_DEFAULT = config.typography.fontSizeRange.max;
const COLORS = config.colors;

/* ── Section spacing config ────────────────────────────────── */
const SECTION_SPACING = config.layout.sectionSpacing || 12;
const ITEM_SPACING = config.layout.itemSpacing || 6;
const SEPARATOR_SPACING = 16;

/* ── Helper: Process inline bold (**text**) ────────────────── */
function processInlineBold(text) {
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
    ' ': ' ', '-': '-', '_': '_', '.': '.', '@': '@', ':': '：', '/': '/', '&': '&', '(': '(', ')': ')', '+': '+', '!': '!', '?': '?', ',': ',', ';': ';', '%': '%', '#': '#', '': ' '
  };
  return text.replace(/\*\*(.+?)\*\*/g, (match, content) => {
    return content.split('').map(char => boldMap[char] || char).join('');
  });
}

/* ── Helper: Parse table rows ─────────────────────────────── */
function parseTableRow(line) {
  return line.split('|').map(cell => cell.trim()).filter((cell, idx, arr) => {
    if (idx === 0 && cell === '') return false;
    if (idx === arr.length - 1 && cell === '') return false;
    return true;
  });
}

function isTableSeparator(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

/* ── Parse markdown into blocks ────────────────────────────── */
function parseMarkdown(md) {
  const blocks = [];
  const lines = md.split("\n");
  let i = 0;
  let currentSection = null;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.trim() === "---") {
      blocks.push({ type: "hr", mb: 16 });
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push({ text: processInlineBold(line.slice(2)), fontScale: 1.5, bold: true, mb: 4, color: COLORS.text || "#111" });
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      const sectionTitle = line.slice(3);
      if (sectionTitle === "核心优势") {
        currentSection = "core-strengths";
      } else if (sectionTitle === "技能") {
        currentSection = "skills";
      } else {
        currentSection = null;
      }
      blocks.push({ text: processInlineBold(sectionTitle), fontScale: 0.85, bold: true, mt: 18, mb: 3, color: COLORS.lightGray || "#999" });
      i++;
      continue;
    }

    if (currentSection === "core-strengths" && line.startsWith("AI-")) {
      blocks.push({ type: "core-strengths", text: line });
      currentSection = null;
      i++;
      continue;
    }

    if (currentSection === "skills" && line && !line.startsWith("#")) {
      blocks.push({ type: "skills-cloud", text: line });
      currentSection = null;
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      const prev = blocks[blocks.length - 1];
      const afterSection = prev && prev.fontScale === 0.85 && prev.bold;
      blocks.push({ text: processInlineBold(line.slice(4)), fontScale: 1, bold: true, mt: afterSection ? 0 : 10, mb: 2, color: COLORS.text || "#111" });
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push({ text: processInlineBold(line.slice(2)), fontScale: 0.9, bold: false, mb: 6, color: "#666" });
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      blocks.push({ text: "\u2022 " + processInlineBold(line.slice(2)), fontScale: 1, bold: false, mb: 3, color: "#555" });
      i++;
      continue;
    }

    if (line.includes("|") && line.trim().startsWith("|")) {
      if (isTableSeparator(line)) { i++; continue; }
      const tableRows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
        if (!isTableSeparator(lines[i])) tableRows.push(parseTableRow(lines[i]));
        i++;
      }
      if (tableRows.length > 0) {
        const headerText = tableRows[0].join(" | ");
        blocks.push({ text: processInlineBold(headerText), fontScale: 0.8, bold: true, mb: 4, color: "#333" });
        for (let rowIdx = 1; rowIdx < tableRows.length; rowIdx++) {
          const rowText = tableRows[rowIdx].join(" | ");
          blocks.push({ text: processInlineBold(rowText), fontScale: 0.75, bold: false, mb: 2, color: "#555" });
        }
      }
      continue;
    }

    // Default text
    const prevBlock = blocks[blocks.length - 1];
    const isAfterTitle = prevBlock && prevBlock.bold && prevBlock.fontScale === 1 && prevBlock.mb === 2;

    if (isAfterTitle) {
      blocks.push({ text: processInlineBold(line), fontScale: 0.8, bold: false, mb: 6, color: COLORS.lightGray || "#999" });
    } else if (prevBlock && prevBlock.fontScale === 1.5) {
      blocks.push({ text: processInlineBold(line), fontScale: 1, bold: false, mb: 6, color: "#555" });
    } else {
      blocks.push({ text: processInlineBold(line), fontScale: 1, bold: false, mb: 6, color: "#333" });
    }
    i++;
  }

  return blocks;
}

/* ── Build font string ────────────────────────────────────── */
function fontString(baseFontSize, block) {
  const fs = baseFontSize * block.fontScale;
  return `${block.bold ? "bold " : ""}${fs}px ${FONT}`;
}

/* ── Measure blocks (pure math, no DOM) ────────────────────── */
function measureBlocks(blocks, baseFontSize, contentW, lhMult = LH_DEFAULT) {
  let h = 0;
  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];

    if (block.mt) {
      const isSection = block.fontScale === 0.85 && block.bold;
      const isItem = block.mt > 0 && !isSection;
      h += isSection ? SECTION_SPACING : isItem ? ITEM_SPACING : block.mt;
    }

    if (block.type === "hr") {
      h += SEPARATOR_SPACING + 1 + SEPARATOR_SPACING;
      continue;
    }

    if (block.type === "core-strengths") {
      // Treat as a single line of text
      const fs = baseFontSize * 0.95;
      const lh = fs * lhMult;
      const font = `normal ${fs}px ${FONT}`;
      const prepared = prepareWithSegments(block.text, font);
      h += layoutWithLines(prepared, contentW, lh).height;
      h += block.mb || 8;
      continue;
    }

    if (block.type === "skills-cloud") {
      const fs = baseFontSize * 0.95;
      const lh = fs * lhMult;
      const font = `normal ${fs}px ${FONT}`;
      const prepared = prepareWithSegments(block.text, font);
      h += layoutWithLines(prepared, contentW, lh).height;
      h += block.mb || 8;
      continue;
    }

    const fs = baseFontSize * block.fontScale;
    const lh = fs * lhMult;
    const font = fontString(baseFontSize, block);
    const prepared = prepareWithSegments(block.text, font);
    h += layoutWithLines(prepared, contentW, lh).height;

    const next = blocks[idx + 1];
    if (next && (next.mt || next.type === "hr")) continue;
    h += block.mb || 0;
  }
  return h;
}

/* ── Layout blocks into positioned lines ─────────────────── */
function layoutBlocks(blocks, baseFontSize, contentW, pad, lhMult = LH_DEFAULT) {
  const positioned = [];
  let y = pad;

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];

    if (block.mt) {
      const isSection = block.fontScale === 0.85 && block.bold;
      const isItem = block.mt > 0 && !isSection;
      y += isSection ? SECTION_SPACING : isItem ? ITEM_SPACING : block.mt;
    }

    if (block.type === "hr") {
      y += SEPARATOR_SPACING;
      positioned.push({ type: "hr", y });
      y += 1 + SEPARATOR_SPACING;
      continue;
    }

    if (block.type === "core-strengths") {
      const fs = baseFontSize * 0.95;
      const lh = fs * lhMult;
      const font = `normal ${fs}px ${FONT}`;
      const prepared = prepareWithSegments(block.text, font);
      const result = layoutWithLines(prepared, contentW, lh);
      for (const line of result.lines) {
        positioned.push({
          type: "text", text: line.text, x: pad, y,
          font, fontSize: fs, fontWeight: "normal",
          lineHeight: lh, color: COLORS.secondary || "#4A5568",
        });
        y += lh;
      }
      y += block.mb || 8;
      continue;
    }

    if (block.type === "skills-cloud") {
      const fs = baseFontSize * 0.95;
      const lh = fs * lhMult;
      const font = `normal ${fs}px ${FONT}`;
      const prepared = prepareWithSegments(block.text, font);
      const result = layoutWithLines(prepared, contentW, lh);
      for (const line of result.lines) {
        positioned.push({
          type: "text", text: line.text, x: pad, y,
          font, fontSize: fs, fontWeight: "normal",
          lineHeight: lh, color: "#555",
        });
        y += lh;
      }
      y += block.mb || 8;
      continue;
    }

    // Regular text block
    const fs = baseFontSize * block.fontScale;
    const lh = fs * lhMult;
    const font = fontString(baseFontSize, block);
    const prepared = prepareWithSegments(block.text, font);
    const result = layoutWithLines(prepared, contentW, lh);

    for (const line of result.lines) {
      positioned.push({
        type: "text", text: line.text, x: pad, y,
        font, fontSize: fs, fontWeight: block.bold ? "bold" : "normal",
        lineHeight: lh, color: block.color,
      });
      y += lh;
    }

    const next = blocks[idx + 1];
    if (next && (next.mt || next.type === "hr")) continue;
    y += block.mb || 0;
  }

  return positioned;
}

/* ── Binary search for optimal font size + line height ────── */
function findOptimalFit(blocks, contentW, maxH, fsMin = FS_MIN, fsMax = FS_MAX_DEFAULT) {
  // Pass 1: max font size at tightest line spacing
  let lo = fsMin;
  let hi = fsMax;
  while (hi - lo > 0.01) {
    const mid = (lo + hi) / 2;
    if (measureBlocks(blocks, mid, contentW, LH_MIN) <= maxH) lo = mid;
    else hi = mid;
  }
  const fontSize = Math.floor(lo * 100) / 100;

  // Pass 2: expand line-height to fill remaining space
  let lhLo = LH_MIN;
  let lhHi = LH_MAX;
  while (lhHi - lhLo > 0.001) {
    const mid = (lhLo + lhHi) / 2;
    if (measureBlocks(blocks, fontSize, contentW, mid) <= maxH) lhLo = mid;
    else lhHi = mid;
  }
  const lineHeightMult = Math.floor(lhLo * 1000) / 1000;

  return { fontSize, lineHeightMult };
}

/* ── Resume Component ──────────────────────────────────────── */
function Resume({ markdown, config }) {
  const blocks = React.useMemo(() => parseMarkdown(markdown), [markdown]);
  const pad = config?.layout?.padding ?? DEFAULT_PAD;
  const contentW = PAGE_W - pad * 2;
  const maxH = PAGE_H - pad * 2;

  // Auto-fit: find optimal font size + line height
  const { fontSize, lineHeightMult } = React.useMemo(
    () => findOptimalFit(blocks, contentW, maxH),
    [blocks, contentW, maxH]
  );

  // 测量内容高度
  const measuredHeight = React.useMemo(
    () => measureBlocks(blocks, fontSize, contentW, lineHeightMult),
    [blocks, fontSize, contentW, lineHeightMult]
  );

  // 暴露排版信息到全局（用于调试和前端读取）
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__PRETEXT_FONT_SIZE__ = fontSize;
      window.__PRETEXT_LINE_HEIGHT__ = lineHeightMult;
      window.__PRETEXT_CONTENT_BLOCKS__ = blocks.length;
      window.__PRETEXT_MEASURED_HEIGHT__ = measuredHeight;
    }
  }, [fontSize, lineHeightMult, blocks.length, measuredHeight]);

  // Position all text
  const positioned = React.useMemo(
    () => layoutBlocks(blocks, fontSize, contentW, pad, lineHeightMult),
    [blocks, fontSize, contentW, pad, lineHeightMult]
  );

  return (
    <div
      style={{
        width: `${PAGE_W}px`,
        height: `${PAGE_H}px`,
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {positioned.map((item, i) => {
        if (item.type === "hr") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pad,
                right: pad,
                top: item.y,
                height: 1,
                backgroundColor: COLORS.border || "#E2E8F0",
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

  const root = createRoot(rootElement);
  root.render(React.createElement(Resume, { markdown, config }));

  // Signal that rendering is complete for Puppeteer
  window.resumeRendered = true;
};

export { Resume, parseMarkdown, findOptimalFit, layoutBlocks, measureBlocks };
