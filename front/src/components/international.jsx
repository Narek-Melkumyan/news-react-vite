import CardIndex from "./cards/cardIndex.jsx";
import {useEffect, useState} from "react";

function International() {

    const [data,setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3010/getInternational").then(res => res.json()).then((data) => {
            setData(data);
        }).catch(error => console.log(error));

    },[])

    return (
        <section>
            <h2 className="section-title">International</h2>
            <div className="row g-4">
                {data?.map((video) => (
                    <div className="col-sm-6 col-lg-3" key={video.id}>
                        <article className="mini-card">
                    <CardIndex value={video} variant="v2" />
                        </article>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default International;