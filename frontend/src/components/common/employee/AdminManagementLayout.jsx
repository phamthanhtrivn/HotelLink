import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminManagementLayout = ({
  title,
  filters,
  actions,
  table,
  pagination,
}) => {
  return (
    <div className="p-6 space-y-4">
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 ">
          {/* ACTION BLOCK – 1 dòng riêng, bên phải */}
          {actions && (
            <div className="flex justify-end">
              {actions}
            </div>
          )}
          
           {/* FILTER BLOCK */}
          {filters && (
            <div>
              {filters}
            </div>
          )}

          

          {/* TABLE */}
          {table}

          {/* PAGINATION */}
          {pagination}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagementLayout;
