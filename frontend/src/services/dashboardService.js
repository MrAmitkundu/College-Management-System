
const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch dashboard statistics and graph data from Django.
 *
 * Expected endpoint:
 * GET /api/dashboard/overview/?year=2026
 */
export async function getDashboardOverview(year = new Date().getFullYear()) {
  const data = await fetchJSON(
    `${API_BASE_URL}/dashboard/overview/?year=${year}`
  );

  return {
    totalStudents: Number(data.total_students || 0),
    totalFaculty: Number(data.total_faculty || 0),
    totalTransactions: Number(data.total_transactions || 0),

    monthlyData: Array.isArray(data.monthly_data)
      ? data.monthly_data.map((item) => ({
          month: item.month,
          students: Number(item.students || 0),
          transactions: Number(item.transactions || 0),
        }))
      : [],
  };
}

/**
 * Fetch latest notices.
 * Existing notice endpoint is preserved.
 */
export async function getDashboardNotices() {
  const data = await fetchJSON(`${API_BASE_URL}/notice/`);

  const noticeData = Array.isArray(data)
    ? data
    : data.results || data.notices || [];

  return [...noticeData]
    .sort((a, b) => {
      const dateA = new Date(
        a.published_on || a.date || a.created_at || 0
      ).getTime();

      const dateB = new Date(
        b.published_on || b.date || b.created_at || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 6);
}
