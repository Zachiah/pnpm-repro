import { Button, Input, Td, Text, Tr } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";

export const SingleLanguageRow: FunctionComponent<{
  row: { key: string; text: string };

  onChange: (key: string, text: string) => void;
}> = ({ row, onChange }) => {
  const [inEdit, setInEdit] = useState(false);
  const [text, setText] = useState(row.text);

  const handleSave = () => {
    if (onChange) {
      onChange(row.key, text);
    }
    setInEdit(false);
  };
  return (
    <Tr key={row.key}>
      <Td>{row.key}</Td>
      <Td>
        {inEdit ? (
          <Input
            w="100%"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outline"
          />
        ) : (
          <Text>{text}</Text>
        )}
      </Td>
      <Td p={0} w="min-content">
        {inEdit ? (
          <Button onClick={handleSave} size="sm">
            Save
          </Button>
        ) : (
          <Button onClick={() => setInEdit(true)} size="sm">
            Edit
          </Button>
        )}
      </Td>
    </Tr>
  );
};
