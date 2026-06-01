import {Link} from "react-router";

function CardV3({slug,image, title,created_at}) {
    return (
        <Link to={`/post/${slug}`}  className="top-news-item d-flex gap-3 align-items-start">
            <img
                src={image}
                alt="news"/>
            <div>
                <div className="fw-bold small mb-1">{title}
                </div>
                <div className="text-secondary small">{created_at.slice(11, 16)}</div>
            </div>
        </Link>
    );
}

export default CardV3;