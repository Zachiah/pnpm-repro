import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Icon } from "@incmix/ui";
import { FunctionComponent } from "react";

const StaticDataSourceList: FunctionComponent<{
  caption: string;
  items: { name: string; id: string }[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}> = ({ caption, items, onSelect, onCreate, onDelete }) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th p={0} w="min-content" />
            <Th p={0} w="min-content" />
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td w="full">{item.name}</Td>
              <Td p={0} w="min-content">
                <Button
                  w="min-content"
                  aria-label={`Delete datasource ${item.name}`}
                  onClick={() => onDelete(item.id)}
                  colorScheme="red"
                >
                  <Icon icon="trash" />
                </Button>
              </Td>
              <Td p={0} w="min-content">
                <Button
                  w="min-content"
                  aria-label={`Select datasource ${item.name}`}
                  onClick={() => onSelect(item.id)}
                >
                  <Icon icon="pencil" />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Td p={0} w="min-content" />
            <Td p={0} w="min-content" />
            <Td>
              <Button
                w="min-content"
                aria-label="Create a new datasource"
                onClick={() => onCreate()}
              >
                <Icon icon="plus" />
              </Button>
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default StaticDataSourceList;
