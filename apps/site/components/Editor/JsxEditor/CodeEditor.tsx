import Editor from "@monaco-editor/react";

const CodeEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  return (
    <Editor
      value={value}
      onChange={(v) => onChange(v ?? "")}
      height="400px"
      language="typescript"
      onMount={(editor, monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          // jsx: 'react',
          jsx: monaco.languages.typescript.JsxEmit.React,
          jsxFactory: "React.createElement",
          reactNamespace: "React",
          allowNonTsExtensions: true,
          allowJs: true,
          target: monaco.languages.typescript.ScriptTarget.Latest,
        });
      }}
    />
  );
};

export default CodeEditor;
