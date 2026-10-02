import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <span className="not-found__code">404</span>
        <h1>This address doesn’t exist — yet.</h1>
        <p>The page you’re looking for may have moved. Explore our developments instead.</p>
        <div className="hero__actions">
          <Link className="btn btn--dark" href="/projects">
            Our Projects
          </Link>
          <Link className="text-link" href="/">
            Back to home →
          </Link>
        </div>
      </div>
    </section>
  );
}
