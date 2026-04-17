import { JobCard } from "./JobCard";

export function Joblistings( { jobs }) {
  return (
    <>
      <h2 style={{ textAlign: "center" }}>Resultados de búsqueda</h2>
      <div className="jobs-listings">
        { jobs.length === 0 && <p style={{ textAlign: "center", padding: "1rem", textWrap: "balance" }}>No se han encontrado resultados</p> }
        { jobs.map((job) => (
          <JobCard job={job} key={job.id} />
        )) }
      </div>
    </>
  );
}
