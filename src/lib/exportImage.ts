import { toJpeg } from "html-to-image";

interface ExportOptions {
  fileName: string;
  backgroundColor?: string;
  /** Multiplier for output resolution — higher = sharper, larger file. */
  pixelRatio?: number;
}

/**
 * Renders a DOM node to a high-resolution JPG and triggers a browser download.
 * Elements marked with the `no-print` class (buttons, nav, etc.) are skipped
 * so the exported image only contains the dashboard content.
 */
export async function exportNodeAsJpg(node: HTMLElement, options: ExportOptions): Promise<void> {
  const { fileName, backgroundColor = "#EEF1F6", pixelRatio = 3 } = options;

  // Run twice: html-to-image sometimes needs a warm-up pass to correctly
  // measure/embed web fonts and inline styles before the real capture.
  await toJpeg(node, {
    quality: 0.98,
    pixelRatio,
    backgroundColor,
    cacheBust: true,
    filter: (el) => !(el instanceof HTMLElement && el.classList.contains("no-print")),
  });

  const dataUrl = await toJpeg(node, {
    quality: 0.98,
    pixelRatio,
    backgroundColor,
    cacheBust: true,
    filter: (el) => !(el instanceof HTMLElement && el.classList.contains("no-print")),
  });

  const link = document.createElement("a");
  link.download = fileName.endsWith(".jpg") ? fileName : `${fileName}.jpg`;
  link.href = dataUrl;
  link.click();
}
