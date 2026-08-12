export interface Bill {
  id: string;
  estateId: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
}
