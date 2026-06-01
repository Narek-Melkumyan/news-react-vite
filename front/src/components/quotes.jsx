import {useEffect, useState} from "react";

function Quotes() {



    const [data, setData] = useState(null)

    useEffect(() => {
        fetch("http://localhost:3010/quotes")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err))
    }, [])

    const quotes = data || []

    if (!quotes) {
        return <p>Loading...</p>
    }



    return (
        <section className="mb-5">
            <h2 className="section-title">Quote of the Day</h2>
            <div className="row g-4">
                {
                    quotes.map((quote, index) => {
                        return (<div className="col-lg-4" key={index}>
                            <div className="quote-card">
                                <p>
                                    {quote.quote}
                                </p>
                                <div className="author-box">
                                    <img
                                        src={quote.author_image}
                                        alt="author"
                                    />
                                    <div>
                                        <h6>{quote.author_name}</h6>
                                        <small>{quote.author_position}</small>
                                    </div>
                                </div>
                            </div>
                        </div>)

                    })
                }
            </div>
        </section>
    );
}

export default Quotes;

