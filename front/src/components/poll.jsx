import { useState, useEffect } from "react";

function Poll() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [poll, setPoll] = useState(null);
    const [results, setResults] = useState([]);
    const [voted, setVoted] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3010/poll")
            .then((res) => res.json())
            .then((data) => {
                setPoll(data);
                const optionsWithVotes = (data.options || []).map((option) => ({
                    ...option,
                    votes: option.votes || 0,
                }));

                setResults(optionsWithVotes);
            })
            .catch((err) => console.log(err));
    }, []);

    async function vote() {
        if (!selectedOption) {
            alert("Please select an option");
            return;
        }

        try {
            const res = await fetch("http://localhost:3010/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    option_id: selectedOption,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setVoted(true);
                setResults(data.results || []);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const totalVotes = results.reduce((sum, option) => {
        return sum + Number(option.votes || 0);
    }, 0);

    return (
        <div className="col-lg-3">
            <aside className="sidebar-box">
                <div className="sidebar-header">Poll</div>

                <div className="p-3">
                    <p className="fw-semibold mb-3">
                        {poll?.poll?.question}
                    </p>

                    {results.map((option) => {
                        const percent =
                            totalVotes > 0
                                ? Math.round((Number(option.votes) / totalVotes) * 100)
                                : 0;

                        return (
                            <div key={option.id} className="mb-3">
                                <div className="form-check mb-1">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="poll"
                                        id={`poll-${option.id}`}
                                        disabled={voted}
                                        onChange={() => setSelectedOption(option.id)}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor={`poll-${option.id}`}
                                    >
                                        {option.option_text}
                                    </label>
                                </div>

                                {voted && (
                                    <>
                                        <div className="progress" style={{ height: "8px" }}>
                                            <div
                                                className="progress-bar bg-danger"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>

                                        <small className="text-muted">
                                            {option.votes} vote{Number(option.votes) !== 1 ? "s" : ""} · {percent}%
                                        </small>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <button
                        className="btn btn-danger w-100"
                        onClick={vote}
                        disabled={voted}
                    >
                        {voted ? "Voted" : "Vote"}
                    </button>
                </div>
            </aside>
        </div>
    );
}

export default Poll;