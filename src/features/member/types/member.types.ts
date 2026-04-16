interface MemberPaginatedParams extends BaseParams {
  institution_id?: string;
  level: string;
}

interface MemberPayload {
  name: string;
  phone: string;
  nta: string;
  nik: string;
  talent: string;
  address: string;

  father_name: string;
  mother_name: string;
  parent_phone: string;
  parent_address: string;

  entry_level: string;
  exit_reason: string;

  birthdate: string;
  father_birthdate: string;
  mother_birthdate: string;

  entry_date: string;
  exit_date: string;

  father_birthplace: string;
  mother_birthplace: string;
  birthplace: string;

  religion: string;
  institution_id: string;

  citizenship: 'wni' | 'wna';
  gender: 'male' | 'female';

  level: 'siaga' | 'penggalang' | 'penegak' | '';
}

interface MemberPaginatedResponse {
  id: string;

  name: string;
  phone: string;
  nta: string;
  nik: string;
  talent: string;
  address: string;

  father_name: string;
  mother_name: string;
  parent_phone: string;
  parent_address: string;

  entry_level: string;
  exit_reason: string;

  birthdate: string;
  father_birthdate: string;
  mother_birthdate: string;

  entry_date: string;
  exit_date: string;

  birthplace: string;
  father_birthplace: string;
  mother_birthplace: string;

  birthplace_name: string;
  father_birthplace_name: string;
  mother_birthplace_name: string;

  religion: string;
  religion_name: string;

  institution_id: string;
  institution_name: string;

  citizenship: 'wni' | 'wna';
  gender: 'male' | 'female';

  level: 'siaga' | 'penggalang' | 'penegak';

  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}
