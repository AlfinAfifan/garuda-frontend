interface BaseParams {
  limit: number;
  page: number;
  search?: string;
}

interface ErrorResponse {
  message: string;
  code?: number;
}

interface BaseResponse {
  message: string;
  success: boolean;
}

type ApiResponse<T> =
  T extends PaginatedResponse<unknown>
    ? T
    : {
        data: T;
        meta?: PaginationMeta;
        error: ErrorResponse | null;
      };

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// {
//   "data": [
//     {
//       "id": "698173f0e8c5e71802257e24",
//       "name": "Mrs. Janis Rippin",
//       "email": "raina.feest@hotmail.com",
//       "role": "admin",
//       "level": "siaga",
//       "institution_id": "698173f0e8c5e71802257e14",
//       "district_id": "698173f0e8c5e71802257e15",
//       "institution_name": "SD NEGRI 1 KOTA BENGKULU",
//       "district_name": "BENGKULU SELATAN",
//       "isActive": true,
//       "createdAt": null,
//       "createdBy": null,
//       "updatedAt": null,
//       "updatedBy": null
//     }
//   ],
//   "meta": {
//     "total": 120,
//     "page": 1,
//     "limit": 10,
//     "totalPages": 12
//   }
// }
