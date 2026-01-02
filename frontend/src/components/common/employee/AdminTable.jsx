import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminTable = ({ columns, data, renderActions }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id || index}>
            {columns.map((col) => (
              <TableCell key={col.key} className="max-w-xs truncate">
                {typeof col.render === "function"
                  ? col.render(item)
                  : item[col.key]}
              </TableCell>
            ))}

            <TableCell className="text-right">{renderActions && renderActions(item)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminTable;
