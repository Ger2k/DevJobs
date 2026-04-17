import { useState, useEffect } from "react";
import { Pagination } from "../components/Pagination.jsx";
import { SearchFormSection } from "../components/SearchFormSection.jsx";
import { Joblistings } from "../components/JobListings.jsx";
import { useRouter } from "../hooks/useRouter.jsx";

const RESULTS_PER_PAGE = 4;

const useFilters = () => {
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      technology: params.get("technology") || "",
      location: params.get("type") || "",
      experienceLevel: params.get("level") || "",
    };
  });
  const [textToFilter, setTextToFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return  params.get("text") || ""
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const page = Number(params.get("page"))
    return Number.isNaN(page) ? Number(page) : 1
  });

  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { navigateTo } = useRouter()

  const hasActiveFilters =
    Boolean(textToFilter.trim()) ||
    Boolean(filters.technology) ||
    Boolean(filters.location) ||
    Boolean(filters.experienceLevel);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);

        const params = new URLSearchParams()
        if (textToFilter) params.append('text', textToFilter)
        if (filters.technology) params.append('technology', filters.technology)
        if (filters.location) params.append('type', filters.location)
        if (filters.experienceLevel) params.append('level', filters.experienceLevel)


        const offset = (currentPage - 1) * RESULTS_PER_PAGE;
        params.append('limit', RESULTS_PER_PAGE);
        params.append('offset', offset);

        const queryParams = params.toString()

        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${queryParams}`);
        const json = await response.json();
        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [filters, textToFilter, currentPage]);

  useEffect(() => {
    const params = new URLSearchParams()
    if (textToFilter) params.append('text', textToFilter)
    if (filters.technology) params.append('technology', filters.technology)
    if (filters.location) params.append('type', filters.location)
    if (filters.experienceLevel) params.append('level', filters.experienceLevel)
    
    if (currentPage > 1) params.append('page', currentPage)

      const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

      navigateTo(newUrl)
  }, [filters, textToFilter, currentPage, navigateTo])

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (filters) => {
    setFilters(filters);
    setCurrentPage(1);
  };

  const handleTextFilter = (newTextToFilter) => {
    setTextToFilter(newTextToFilter);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      technology: "",
      location: "",
      experienceLevel: "",
    });
    setTextToFilter("");
    setCurrentPage(1);
  };

  return {
    loading,
    currentPage,
    totalPages,
    textToFilter,
    jobs,
    total,
    handleChangePage,
    handleSearch,
    handleTextFilter,
    hasActiveFilters,
    handleClearFilters,
  };
};

export function SearchPage() {
  const {
    currentPage,
    totalPages,
    jobs,
    total,
    loading,
    textToFilter,
    handleChangePage,
    handleSearch,
    handleTextFilter,
    hasActiveFilters,
    handleClearFilters,
  } = useFilters();


  const title = `Resultados: ${total}, Página ${currentPage}`;

  return (
    <main>
      <title>{title}</title>
      <SearchFormSection
        onSearch={handleSearch}
        onTextFilter={handleTextFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        initialText={textToFilter}
      />
      <section>
        {loading ? (
          <div className="search-loading" role="status" aria-live="polite">
            <span className="loading-spinner" aria-hidden="true" />
            <p>Cargando empleos...</p>
          </div>
        ) : (
          <Joblistings jobs={jobs} />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      </section>
    </main>
  );
}
