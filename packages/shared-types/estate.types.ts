export interface Estate {
  id: string;
  name: string;
  estateId: string; // human-facing code, see api-utils/estate_id.py on BE
  units: number;
  createdAt: string;
}
