import type { ApiResponse, PaginatedList } from "@/types/api";

/**
 * Fetches every page from a paginated backend endpoint (for example when the
 * backend enforces a fixed/default pageSize such as 10), returning all items
 * in order without duplicates.
 */
export async function fetchAllPaginated<T extends { id?: string }>(
  fetchPage: (
    pageIndex: number,
    pageSize: number
  ) => Promise<ApiResponse<PaginatedList<T>>>,
  requestedPageSize: number = 100,
  maxPages: number = 100
): Promise<T[]> {
  const firstResponse = await fetchPage(1, requestedPageSize);
  const firstPage = firstResponse?.data;

  const firstItems = Array.isArray(firstPage?.data)
    ? firstPage.data
    : Array.isArray(firstPage)
      ? (firstPage as unknown as T[])
      : [];

  if (firstItems.length === 0) return [];

  const effectivePageSize =
    typeof firstPage?.pageSize === "number" && firstPage.pageSize > 0
      ? firstPage.pageSize
      : requestedPageSize;

  const inferredTotalPages =
    typeof firstPage?.totalCount === "number" && effectivePageSize > 0
      ? Math.ceil(firstPage.totalCount / effectivePageSize)
      : 1;

  const totalPages = Math.min(
    Math.max(
      typeof firstPage?.totalPages === "number" && firstPage.totalPages > 0
        ? firstPage.totalPages
        : 1,
      inferredTotalPages
    ),
    maxPages
  );

  if (!firstPage?.hasNextPage && totalPages <= 1) {
    return firstItems;
  }

  const collected: T[] = [...firstItems];

  if (totalPages > 1) {
    const batchSize = 5;
    for (let startPage = 2; startPage <= totalPages; startPage += batchSize) {
      const endPage = Math.min(startPage + batchSize - 1, totalPages);
      const pagePromises: Promise<ApiResponse<PaginatedList<T>>>[] = [];
      for (let p = startPage; p <= endPage; p++) {
        pagePromises.push(fetchPage(p, effectivePageSize));
      }
      const responses = await Promise.all(pagePromises);
      for (const res of responses) {
        const items = Array.isArray(res?.data?.data) ? res.data.data : [];
        collected.push(...items);
      }
    }
  } else {
    let currentPage = 2;
    let hasNext = true;
    while (hasNext && currentPage <= maxPages) {
      const res = await fetchPage(currentPage, effectivePageSize);
      const pageData = res?.data;
      const items = Array.isArray(pageData?.data) ? pageData.data : [];
      if (items.length === 0) break;
      collected.push(...items);
      hasNext = Boolean(pageData?.hasNextPage);
      currentPage++;
    }
  }

  const seenIds = new Set<string>();
  return collected.filter((item) => {
    if (!item?.id) return true;
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });
}
