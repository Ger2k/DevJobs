import { useId, useRef, useState } from "react";

const useSearchForm = ( { idTechnology, idExperienceLevel, idLocation, idText,  onSearch, onTextFilter }) => {
  const timeoutId = useRef(null);
  const [searchText, setSearchText] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (event.target.name === idText) {
      return
    }

    const filters = {
      technology: formData.get(idTechnology),
      location: formData.get(idLocation),
      experienceLevel: formData.get(idExperienceLevel),
    };

    onSearch(filters);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setSearchText(text)

    // Debounce

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      onTextFilter(text);
    }, 500);
  }
  
  return {
    searchText,
    handleSubmit,
    handleTextChange
  }
};

export function SearchFormSection({ initialText, onTextFilter, onSearch, hasActiveFilters, onClearFilters }) {
  const idText = useId();
  const idTechnology = useId();
  const idLocation = useId();
  const idExperienceLevel = useId();
  const formRef = useRef(null);
  const { handleSubmit, handleTextChange } = useSearchForm({ idTechnology, idLocation, idText, idExperienceLevel, onSearch, onTextFilter })

  const handleClear = () => {
    formRef.current?.reset();
    onClearFilters();
  }

  return (
    <section className="jobs-search">
      <h1>Encuentra tu próximo trabajo</h1>
      <p>Explora miles de oportunidades en el sector tecnológico.</p>

      <form ref={formRef} onChange={handleSubmit} id="empleos-search-form" role="search">
        <div className="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-search"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>

          <input
            name={idText}
            id="empleos-search-input"
            required
            type="text"
            placeholder="Buscar trabajos, empresas o habilidades"
            onChange={handleTextChange}
            defaultValue={initialText}
          />
        </div>

        <div className="search-filters">
          <select name={idTechnology} id="filter-technology">
            <option value="">Tecnología</option>
            <optgroup label="Tecnologías populares">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="react">React</option>
              <option value="nodejs">Node.js</option>
            </optgroup>
            <option value="java">Java</option>
            <hr />
            <option value="csharp">C#</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
            <hr />
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
          </select>

          <select name={idLocation} id="filter-location">
            <option value="">Ubicación</option>
            <option value="remoto">Remoto</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="barcelona">Barcelona</option>
          </select>

          <select name={idExperienceLevel} id="filter-experience-level">
            <option value="">Nivel de experiencia</option>
            <option value="junior">Junior</option>
            <option value="mid-level">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>

          {hasActiveFilters && (
            <button type="button" onClick={handleClear}>
              Limpiar filtros
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
