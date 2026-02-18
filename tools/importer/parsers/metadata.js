/**
 * Metadata Block Parser
 * Extracts page metadata from HTML head meta tags and page content
 * to create an AEM Metadata block.
 *
 * Source: <head> meta tags (og:title, og:description, og:image, etc.)
 *         and page content (publish date, tags, canonical URL)
 *
 * Target: Metadata block with key-value rows
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const metaTitle = document.querySelector('title');
  const title = ogTitle?.content || metaTitle?.textContent || '';
  if (title) {
    const keyEl = document.createElement('div');
    keyEl.textContent = 'title';
    const valEl = document.createElement('div');
    valEl.textContent = title;
    cells.push([keyEl, valEl]);
  }

  // Extract description
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const metaDesc = document.querySelector('meta[name="description"]');
  const description = ogDesc?.content || metaDesc?.content || '';
  if (description) {
    const keyEl = document.createElement('div');
    keyEl.textContent = 'description';
    const valEl = document.createElement('div');
    valEl.textContent = description;
    cells.push([keyEl, valEl]);
  }

  // Extract og:image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage?.content) {
    const keyEl = document.createElement('div');
    keyEl.textContent = 'image';
    const valEl = document.createElement('div');
    const img = document.createElement('img');
    img.src = ogImage.content;
    valEl.appendChild(img);
    cells.push([keyEl, valEl]);
  }

  // Extract tags/keywords from breadcrumb or meta keywords
  const breadcrumb = document.querySelector('.breadcrumb, .lg-breadcrumb, nav[aria-label="breadcrumb"]');
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (breadcrumb) {
    const tags = [];
    breadcrumb.querySelectorAll('a, span').forEach((item) => {
      const text = item.textContent.trim();
      if (text && text !== '>' && text !== '/') {
        tags.push(text);
      }
    });
    if (tags.length > 0) {
      const keyEl = document.createElement('div');
      keyEl.textContent = 'tags';
      const valEl = document.createElement('div');
      valEl.textContent = tags.join(', ');
      cells.push([keyEl, valEl]);
    }
  } else if (metaKeywords?.content) {
    const keyEl = document.createElement('div');
    keyEl.textContent = 'tags';
    const valEl = document.createElement('div');
    valEl.textContent = metaKeywords.content;
    cells.push([keyEl, valEl]);
  }

  // Extract publish date
  const publishDate = document.querySelector('time[datetime], .publish-date, .article-date, [data-publish-date]');
  if (publishDate) {
    const keyEl = document.createElement('div');
    keyEl.textContent = 'publish-date';
    const valEl = document.createElement('div');
    valEl.textContent = publishDate.getAttribute('datetime') || publishDate.textContent.trim();
    cells.push([keyEl, valEl]);
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Metadata',
      cells,
    });
    element.replaceWith(block);
  }
}
