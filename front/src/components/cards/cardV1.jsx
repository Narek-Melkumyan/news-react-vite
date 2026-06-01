import {Link} from "react-router";

const stripHtml = (html) => {
    if (!html) return "";

    const div = document.createElement("div");
    div.innerHTML = html;

    return div.textContent || div.innerText || "";
};


function CardV1({ slug,created_at, image, title, short_description }) {
    return (
        <Link to={`/post/${slug}`} className="side-story d-block">
            <img src={image} alt="story" />

            <h6>{title}</h6>

            <div className="card-meta">
                {new Date(created_at).toLocaleDateString("en-GB").replaceAll("/", ".")}
            </div>

            {short_description && (
                <p>{stripHtml(short_description)}</p>
            )}
        </Link>
    );
}

export default CardV1;