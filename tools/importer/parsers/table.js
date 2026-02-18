/**
 * Table Block Parser
 * Converts HTML comparison tables from LG article pages into AEM Table blocks.
 * Source: .lg-article-content table elements
 *
 * Expected source structure:
 * <table>
 *   <thead><tr><th>Header1</th><th>Header2</th>...</tr></thead>
 *   <tbody><tr><td>Cell1</td><td>Cell2</td>...</tr>...</tbody>
 * </table>
 *
 * Target: Table block with header row + data rows
 */
export default function parse(element, { document }) {
  const table = element.querySelector('table') || element;
  const cells = [];

  // Extract header row
  const headerRow = table.querySelector('thead tr') || table.querySelector('tr:first-child');
  if (headerRow) {
    const headerCells = [];
    headerRow.querySelectorAll('th, td').forEach((cell) => {
      const clone = cell.cloneNode(true);
      headerCells.push(clone);
    });
    if (headerCells.length > 0) {
      cells.push(headerCells);
    }
  }

  // Extract body rows
  const bodyRows = table.querySelectorAll('tbody tr');
  const rows = bodyRows.length > 0 ? bodyRows : table.querySelectorAll('tr:not(:first-child)');

  rows.forEach((row) => {
    const rowCells = [];
    row.querySelectorAll('td, th').forEach((cell) => {
      const clone = cell.cloneNode(true);
      rowCells.push(clone);
    });
    if (rowCells.length > 0) {
      cells.push(rowCells);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Table',
      cells,
    });
    element.replaceWith(block);
  }
}
