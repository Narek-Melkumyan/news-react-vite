import {useState} from "react";
import {useEffect} from "react";

function Poll() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [poll, setPoll] = useState(null);
    const [voted, setVoted] = useState(false);


    useEffect(() => {
        fetch("http://localhost:3010/poll")
            .then(res => res.json())
            .then(data => setPoll(data))
            .catch(err => console.log(err));
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
                body: JSON.stringify({ option_id: selectedOption }),
            });

            const data = await res.json();

            if (data.success) {
                setVoted(true);
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="col-lg-3">
            <aside className="sidebar-box">
                <div className="sidebar-header">Poll</div>
                <div className="p-3">
                    <p className="fw-semibold mb-3">{poll?.poll?.question}</p>
                    {poll?.options?.map((option) => {
                        return (
                            <div key={option.id} className="form-check mb-2">
                                <input className="form-check-input" type="radio" name="poll" id={`poll-${option.id}`}
                                       onChange={() => setSelectedOption(option.id)}
                                />
                                <label className="form-check-label" htmlFor={`poll-${option.id}`}>
                                    {option.option_text}
                                </label>
                            </div>
                        );
                    })}

                    <button
                        className="btn btn-danger w-100"
                        onClick={vote}
                        disabled={voted}
                    >
                        {voted ? "Voted" : "Vote"}
                    </button>                </div>
            </aside>

        </div>
    );
}

export default Poll;