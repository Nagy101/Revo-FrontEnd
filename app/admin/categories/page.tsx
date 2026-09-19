import { CategoriesManager } from "@/features/admin/components/categories/categories-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories Management | Revo Admin",
  description: "Manage categories and their portfolio items",
};

export default function AdminCategoriesPage() {
  return <CategoriesManager />;
}
