function buildMatrix(beforeLines, afterLines) {
  const rows = beforeLines.length;
  const cols = afterLines.length;
  const matrix = Array.from({ length: rows + 1 }, () =>
    Array(cols + 1).fill(0),
  );

  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let col = cols - 1; col >= 0; col -= 1) {
      if (beforeLines[row] === afterLines[col]) {
        matrix[row][col] = matrix[row + 1][col + 1] + 1;
      } else {
        matrix[row][col] = Math.max(matrix[row + 1][col], matrix[row][col + 1]);
      }
    }
  }

  return matrix;
}

export function buildLineDiff(before = "", after = "") {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const matrix = buildMatrix(beforeLines, afterLines);
  const diff = [];
  let row = 0;
  let col = 0;

  while (row < beforeLines.length && col < afterLines.length) {
    if (beforeLines[row] === afterLines[col]) {
      diff.push({ type: "unchanged", text: beforeLines[row] });
      row += 1;
      col += 1;
      continue;
    }

    if (matrix[row + 1][col] >= matrix[row][col + 1]) {
      diff.push({ type: "removed", text: beforeLines[row] });
      row += 1;
    } else {
      diff.push({ type: "added", text: afterLines[col] });
      col += 1;
    }
  }

  while (row < beforeLines.length) {
    diff.push({ type: "removed", text: beforeLines[row] });
    row += 1;
  }

  while (col < afterLines.length) {
    diff.push({ type: "added", text: afterLines[col] });
    col += 1;
  }

  return diff;
}
