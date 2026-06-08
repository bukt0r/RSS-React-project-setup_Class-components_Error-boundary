import { useAppSelector } from '../../store/hooks';
import { selectFormSubmissions } from '../../store/selectors';
import './SubmissionList.css';

function SubmissionList() {
  const submissions = useAppSelector(selectFormSubmissions);

  if (submissions.length === 0) {
    return (
      <section className="submission-list" aria-label="Submitted forms">
        <h2 className="submission-list__title">Submissions</h2>
        <p className="submission-list__empty" role="status">
          No submissions yet.
        </p>
      </section>
    );
  }

  return (
    <section className="submission-list" aria-label="Submitted forms">
      <h2 className="submission-list__title">Submissions</h2>
      <ul className="submission-list__grid">
        {submissions.map((submission) => (
          <li key={submission.id} className="submission-list__item">
            <article className="submission-card">
              {submission.imageBase64 ? (
                <img
                  className="submission-card__image"
                  src={submission.imageBase64}
                  alt={`${submission.name} profile`}
                />
              ) : null}
              <div className="submission-card__body">
                <p className="submission-card__source">{submission.source}</p>
                <h3 className="submission-card__name">{submission.name}</h3>
                <p className="submission-card__meta">
                  {submission.email} · {submission.age} · {submission.country}
                </p>
                <p className="submission-card__meta">{submission.gender}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SubmissionList;
