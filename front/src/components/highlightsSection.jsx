import CardIndex from "./cards/cardIndex.jsx";
import Poll from "./poll.jsx";
import {useEffect, useState} from "react";

function HighlightsSection() {

    const [data, setData] = useState(null)

    useEffect(() => {
        fetch("http://localhost:3010/regionsAndInterviews")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err))
    }, [])

    const regions = data?.regions || []
    const interviews = data?.interviews || []
    if (!regions || !interviews) {
        return <p>Loading...</p>
    }

    return (
        <section className="mb-5">
            <div className="row g-4">
                <div className="col-lg-3">
                    <h2 className="section-title">Regions</h2>
                    <div className="row g-4">
                        {
                            regions.map((post) => {
                                return (
                                    <div key={post.id} className="col-12">
                                        <CardIndex value={post} variant="v2"/>
                                    </div>
                                );
                            })
                        }

                    </div>
                </div>
                <div className="col-lg-6">
                    <h2 className="section-title">Interviews</h2>
                    <div className="row g-4">
                        {
                            interviews.map((post) => {
                                return (
                                    <div className="col-md-6" key={post.id}>
                                        <article className="mini-card">
                                            <CardIndex value={post} variant="v2"/>
                                        </article>
                                    </div>
                                );
                            })
                        }


                    </div>
                </div>
               <Poll/>
            </div>
        </section>
    );
}

export default HighlightsSection;

