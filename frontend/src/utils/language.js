export const languageOptions = [
  { value: "python", label: "Python", extension: ".py", prism: "python" },
  { value: "c", label: "C", extension: ".c", prism: "c" },
  { value: "java", label: "Java", extension: ".java", prism: "java" },
  { value: "cpp", label: "C++", extension: ".cpp", prism: "cpp" },
];

export function getLanguageLabel(value) {
  return (
    languageOptions.find((option) => option.value === value)?.label || "Python"
  );
}

export function getPrismLanguage(value) {
  return (
    languageOptions.find((option) => option.value === value)?.prism || "python"
  );
}

export function inferLanguageFromFileName(fileName = "") {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith(".py")) {
    return "python";
  }

  if (lowerName.endsWith(".c") && !lowerName.endsWith(".cpp")) {
    return "c";
  }

  if (lowerName.endsWith(".java")) {
    return "java";
  }

  if (lowerName.endsWith(".cpp")) {
    return "cpp";
  }

  return "python";
}
