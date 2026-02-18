/**
 * Columns Block Parser
 * Converts product showcase items from LG article pages into AEM Columns blocks.
 * Source: Product showcase elements within .lg-article-content
 *
 * Expected source structure:
 * <div class="product-item">
 *   <div class="product-image"><img src="..." alt="..."></div>
 *   <div class="product-text">
 *     <h3>Product Name</h3>
 *     <p>Description text</p>
 *     <a href="...">CTA link</a>
 *   </div>
 * </div>
 *
 * Target: Columns block with image column + text/CTA column
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find image element
  const img = element.querySelector('img');
  const imgContainer = document.createElement('div');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imgContainer.appendChild(newImg);
  }

  // Find text content
  const textContainer = document.createElement('div');

  // Extract heading
  const heading = element.querySelector('h2, h3, h4');
  if (heading) {
    const strong = document.createElement('strong');
    strong.textContent = heading.textContent;
    textContainer.appendChild(strong);
    textContainer.appendChild(document.createTextNode(' '));
  }

  // Extract description paragraphs
  const paragraphs = element.querySelectorAll('p');
  paragraphs.forEach((p) => {
    if (p.textContent.trim()) {
      const newP = document.createElement('span');
      newP.innerHTML = p.innerHTML;
      textContainer.appendChild(newP);
      textContainer.appendChild(document.createTextNode(' '));
    }
  });

  // Extract CTA links
  const links = element.querySelectorAll('a');
  links.forEach((link) => {
    if (link.textContent.trim()) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = link.textContent;
      textContainer.appendChild(newLink);
    }
  });

  // Determine column order based on DOM position
  // If image comes first in DOM, use image|text; otherwise text|image
  const firstChild = element.firstElementChild;
  const imageFirst = firstChild && (firstChild.querySelector('img') || firstChild.tagName === 'IMG');

  if (imageFirst) {
    cells.push([imgContainer, textContainer]);
  } else {
    cells.push([textContainer, imgContainer]);
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Columns',
      cells,
    });
    element.replaceWith(block);
  }
}
