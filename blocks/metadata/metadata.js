/**
 * Metadata Block
 * Reads page metadata key-value pairs and applies them as meta tags.
 * Hides itself from the page.
 */
export default function decorate(block) {
  const metaBlock = block.closest('.metadata');
  if (metaBlock) {
    metaBlock.remove();
  }
}
