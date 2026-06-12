function CardV5({link, title, image, description, source, pubDate,}) {
    return (
        <article className="card-v5">
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="card-v5__link"
            >
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="card-v5__image"
                    />
                )}

                <div className="card-v5__content">
                    <span className="card-v5__source">
                        {source}
                    </span>

                    <h3 className="card-v5__title">
                        {title}
                    </h3>

                    <p className="card-v5__description">
                        {description}
                    </p>

                    <time className="card-v5__date">
                        {pubDate
                            ? new Date(pubDate).toLocaleDateString()
                            : ""}
                    </time>
                </div>
            </a>
        </article>
    );
}

export default CardV5;