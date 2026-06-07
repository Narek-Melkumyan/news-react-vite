import PollsHeader from "../components/polls/pollsHeader.jsx";
import PollsStats from "../components/polls/pollsStats.jsx";
import PollsModal from "../components/polls/pollsModal.jsx";
import PollResultsModal from "../components/polls/pollResultsModal.jsx";
import PollCard from "../components/polls/pollCard.jsx";
import { useEffect, useState } from "react";

function Polls() {
    const [open, setOpen] = useState(false);
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);

    const [resultsOpen, setResultsOpen] = useState(false);
    const [pollResults, setPollResults] = useState(null);

    const getPolls = async () => {
        try {
            const res = await fetch(
                "http://localhost:3010/admin/polls/getPolls",
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Could not get polls"
                );
            }

            setPolls(data.polls || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getPolls();
    }, []);

    const openCreateModal = () => {
        setSelectedPoll(null);
        setOpen(true);
    };

    const openEditModal = async (pollId) => {
        try {
            const res = await fetch(
                `http://localhost:3010/admin/polls/getPoll/${pollId}`,
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to get poll"
                );
            }

            setSelectedPoll(data.poll);
            setOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const openResultsModal = async (pollId) => {
        try {
            const res = await fetch(
                `http://localhost:3010/admin/polls/getPollResults/${pollId}`,
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to get poll results"
                );
            }

            setPollResults(data);
            setResultsOpen(true);
        } catch (error) {
            console.error("Results error:", error);
        }
    };

    const closeModal = () => {
        setOpen(false);
        setSelectedPoll(null);
    };

    const closeResultsModal = () => {
        setResultsOpen(false);
        setPollResults(null);
    };

    const handleSuccess = async () => {
        await getPolls();
        closeModal();
    };

    const deletePoll = async (pollId) => {
        try {
            const res = await fetch(
                `http://localhost:3010/admin/polls/deletePoll/${pollId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete poll"
                );
            }

            setPolls((prevPolls) =>
                prevPolls.filter(
                    (poll) => poll.id !== pollId
                )
            );
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="page">
            <PollsHeader open={openCreateModal} />

            <PollsStats polls={polls} />

            <div className="card">
                <div className="table-toolbar">
                    <div className="search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            id="pollSearch"
                            placeholder="Search polls..."
                        />
                    </div>

                    <select
                        className="form-select"
                        id="pollStatusFilter"
                        style={{ width: "auto" }}
                    >
                        <option value="all">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Question</th>
                            <th>Total Votes</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>End Date</th>

                            <th style={{ width: "140px" }}>
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {polls.map((poll) => (
                            <PollCard
                                key={poll.id}
                                poll={poll}
                                onResults={() =>
                                    openResultsModal(
                                        poll.id
                                    )
                                }
                                onEdit={() =>
                                    openEditModal(
                                        poll.id
                                    )
                                }
                                onDelete={() =>
                                    deletePoll(
                                        poll.id
                                    )
                                }
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-foot">
                    <span>
                        Showing{" "}
                        <strong>{polls.length}</strong>{" "}
                        of{" "}
                        <strong>{polls.length}</strong>{" "}
                        polls
                    </span>

                    <ul className="pagination mb-0">
                        <li className="page-item active">
                            <button
                                className="page-link"
                                type="button"
                            >
                                1
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {open && (
                <PollsModal
                    close={closeModal}
                    poll={selectedPoll}
                    onSuccess={handleSuccess}
                />
            )}

            {resultsOpen && pollResults && (
                <PollResultsModal
                    data={pollResults}
                    close={closeResultsModal}
                />
            )}
        </div>
    );
}

export default Polls;