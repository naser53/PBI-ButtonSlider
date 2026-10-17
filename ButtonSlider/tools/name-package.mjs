/**
 * Renames the packaged .pbiviz to the project's release convention:
 *   <name>.V.<major>.<minor>.pbiviz   (e.g. buttonSlider.V.1.6.pbiviz)
 *
 * pbiviz always emits "<guid>.<version>.pbiviz" and offers no output-name flag,
 * so this runs after `pbiviz package`. The GUID is intentionally left untouched
 * because Power BI identifies the visual by it inside existing reports.
 */
import { readFileSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(projectRoot, "pbiviz.json"), "utf8"));

const { name, guid, version } = config.visual;
const [major, minor] = version.split(".");

const builtFile = join(projectRoot, "dist", `${guid}.${version}.pbiviz`);
const targetName = `${name}.V.${major}.${minor}.pbiviz`;
const targetFile = join(projectRoot, "dist", targetName);

if (!existsSync(builtFile)) {
    console.error(`Packaged file not found: ${builtFile}`);
    process.exit(1);
}

copyFileSync(builtFile, targetFile);
console.log(`Release package: dist/${targetName}`);
