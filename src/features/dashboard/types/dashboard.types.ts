interface DashboardParams {
  level: string;
  year: number;
}

interface DashboardCards {
  total_institutions: number;
  total_members: number;
  total_tku: number;
  total_tkk: number;
  total_garuda: number;
  total_garuda_approved: number;
}

interface DashboardCharts {
  members_by_level: MembersByLevel;
  tku_by_level: TKUByLevel;
  tkk_by_level: TKKByLevel;
  monthly_new_members: MonthlyNewMember[];
}

interface MembersByLevel {
  siaga: number;
  penggalang: number;
  penegak: number;
}

interface TKUByLevel {
  mula: number;
  bantu: number;
  tata: number;
  ramu: number;
  rakit: number;
  terap: number;
  bantara: number;
  laksana: number;
}

interface TKKByLevel {
  siaga: number;
  purwa: number;
  madya: number;
  utama: number;
}

interface MonthlyNewMember {
  month: string;
  total: number;
}

interface DashboardResponse {
  cards: DashboardCards;
  charts: DashboardCharts;
}
