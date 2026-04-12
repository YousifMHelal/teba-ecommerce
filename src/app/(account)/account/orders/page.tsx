import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const orders = [
  { id: "#1001", total: "$128.00", status: "Paid" },
  { id: "#1002", total: "$216.00", status: "Shipped" },
]

export default function OrdersPage() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
