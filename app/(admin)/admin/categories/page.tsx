import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const categories = [
  { name: "Apparel", slug: "apparel" },
  { name: "Accessories", slug: "accessories" },
]

export default function AdminCategoriesPage() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.slug}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.slug}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
