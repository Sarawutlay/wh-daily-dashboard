import { toJpeg } from "html-to-image";

interface ExportOptions {
  fileName: string;
  backgroundColor?: string;
  /** Multiplier for output resolution — higher = sharper, larger file. */
  pixelRatio?: number;
}

function isNoPrint(el: unknown): boolean {
  return el instanceof HTMLElement && el.classList.contains("no-print");
}

/**
 * Renders a DOM node to a high-resolution JPG and triggers a browser download.
 *
 * Two things commonly make html-to-image output look "shifted" or
 * misaligned compared to what's on screen:
 *  1. Web fonts (Google Fonts, loaded async) not finished loading yet —
 *     the capture falls back to a system font with different character
 *     widths/line-height, which throws off text position and wrapping.
 *  2. Capturing while the page is scrolled — the library measures the
 *     node's position relative to the viewport, so a non-zero scroll
 *     offset can shift where content ends up in the final image.
 *
 * Both are addressed below: we wait for `document.fonts.ready`, scroll to
 * the top before capturing (and restore the scroll position afterwards),
 * and pass explicit width/height so the output isn't affected by anything
 * being cut off mid-layout.
 */
export async function exportNodeAsJpg(node: HTMLElement, options: ExportOptions): Promise<void> {
  const { fileName, backgroundColor = "#EEF1F6", pixelRatio = 2 } = options;

  // 1) Make sure all web fonts are fully loaded before we measure/capture.
  if ("fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore — proceed with whatever fonts are available */
    }
  }

  // 2) Reset scroll to top so the capture isn't offset by the current
  //    scroll position, then restore it afterwards.
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  window.scrollTo(0, 0);
  // Give the browser a frame to settle after the scroll + font load.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const width = node.scrollWidth;
  const height = node.scrollHeight;

  try {
    const dataUrl = await toJpeg(node, {
      quality: 0.98,
      pixelRatio,
      backgroundColor,
      cacheBust: true,
      width,
      height,
      filter: (el) => !isNoPrint(el),
      style: {
        margin: "0",
      },
    });

    const link = document.createElement("a");
    link.download = fileName.endsWith(".jpg") ? fileName : `${fileName}.jpg`;
    link.href = dataUrl;
    link.click();
  } finally {
    window.scrollTo(scrollX, scrollY);
  }
}
