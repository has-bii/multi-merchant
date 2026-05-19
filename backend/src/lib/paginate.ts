export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationMeta
}

export async function paginate<T>(
  fetchData: (limit: number, offset: number) => Promise<T[]>,
  fetchCount: () => Promise<number>,
  page: number,
  limit: number,
): Promise<PaginatedResult<T>> {
  const offset = (page - 1) * limit
  const [data, total] = await Promise.all([fetchData(limit, offset), fetchCount()])
  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  }
}
