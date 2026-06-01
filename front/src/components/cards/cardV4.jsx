import { Link } from "react-router";

function CardV4({ id, image, title, created_at }) {
    return (
        <Link
            to={`/video/${id}`}
            className="top-news-item video-card-v3 d-flex gap-3 align-items-start"
        >
            <div className="video-thumb-small">
                <img src={image} alt={title} />
            </div>

            <div>
                <div className="fw-bold small mb-1">
                    {title}
                </div>

                <div className="text-secondary small">
                    {created_at?.slice(11, 16)}
                </div>
            </div>
        </Link>
    );
}

export default CardV4;