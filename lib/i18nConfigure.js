import { I18n } from "i18n";
import path from "node:path";

const i18n = new I18n({
  locales: ["en", "es"],
  directory: path.join(import.meta.dirname, "..", "locales"),
  defaultLocale: "en",
  autoReload: true, // watch for changes in JSON files to reload locale on updates - defaults to false
  syncFiles: true, // sync locale information across all files - defaults to false
  cookie: "nodepop-locale",
});

export default i18n;
