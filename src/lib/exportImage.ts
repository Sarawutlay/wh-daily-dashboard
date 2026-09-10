import html2canvas from "html2canvas";

interface ExportOptions {
  fileName: string;
  backgroundColor?: string;
  /** Multiplier for output resolution — higher = sharper, larger file. */
  scale?: number;
}

/**
 * Renders a DOM node to a high-resolution JPG and triggers a browser download.
 *
 * We use html2canvas (not html-to-image/SVG-foreignObject based tools) on
 * purpose: html2canvas walks the DOM that is already laid out on screen and
 * reads each element's real position/size, so text wrapping and box heights
 * match exactly what you see — no independent re-layout pass that can
 * mis-measure text and cause the overlapping/truncated text seen with
 * foreignObject-based capture on complex responsive grids.
 */
export async function exportNodeAsJpg(node: HTMLElement, options: ExportOptions): Promise<void> {
  const { fileName, backgroundColor = "#EEF1F6", scale = 2 } = options;

  if ("fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore — proceed with whatever fonts are available */
    }
  }

  const canvas = await html2canvas(node, {
    backgroundColor,
    scale,
    useCORS: true,
    logging: false,
    ignoreElements: (el) => el.classList?.contains("no-print"),
  });

  const dataUrl = canvas.toDataURL("image/jpeg", 0.98);

  const link = document.createElement("a");
  link.download = fileName.endsWith(".jpg") ? fileName : `${fileName}.jpg`;
  link.href = dataUrl;
  link.click();
}
