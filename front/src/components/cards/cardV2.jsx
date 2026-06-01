import {Link} from "react-router";

const stripHtml = (html) => {
    if (!html) return "";

    const div = document.createElement("div");
    div.innerHTML = html;

    return (div.textContent || div.innerText || "")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

function CardV2({ slug,title, image, content, created_at }) {
    return (
        <article className="news-card h-100">
            <img src={image} alt={title} />

            <h5>
                <Link to={`/post/${slug}`} >{title}</Link>
            </h5>

            <div className="text-secondary small mb-2">
                {new Date(created_at).toLocaleDateString("en-GB").replaceAll("/", ".")}
            </div>

            {content && (
                <p>{stripHtml(content)}</p>
            )}
        </article>
    );
}

export default CardV2;