
import AdmZip from "adm-zip";

/**
 * Extracts and parses a ZIP file buffer into a flat array of file paths and contents.
 */
export async function importFromZip(buffer: Buffer) {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();
  
  const files = entries
    .filter(e => !e.isDirectory)
    .map(entry => {
      try {
        return {
          path: entry.entryName,
          content: entry.getData().toString("utf-8")
        };
      } catch (e) {
        console.error(`Failed to read zip entry: ${entry.entryName}`, e);
        return null;
      }
    });
  
  return files.filter(f => f !== null);
}
