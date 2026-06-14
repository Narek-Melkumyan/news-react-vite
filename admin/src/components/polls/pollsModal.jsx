import { useEffect, useState } from "react";

function PollsModal({ close, poll, onSuccess }) {
    const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("active");
    const [loading, setLoading] = useState(false);

    const isEdit = Boolean(poll);

    useEffect(() => {
        if (poll) {
            setQuestion(poll.question || "");

            let pollOptions = poll.options;

            if (typeof pollOptions === "string") {
                try {
                    pollOptions = JSON.parse(pollOptions);
                } catch {
                    pollOptions = [];
                }
            }

            setOptions(
                Array.isArray(pollOptions) && pollOptions.length >= 2
                    ? pollOptions
                    : ["", ""]
            );

            setStartDate(
                poll.start_date
                    ? poll.start_date.slice(0, 10)
                    : ""
            );

            setEndDate(
                poll.end_date
                    ? poll.end_date.slice(0, 10)
                    : ""
            );

            setStatus(poll.status || "active");
        }
    }, [poll]);

    const addOption = () => {
        setOptions((prevOptions) => [
            ...prevOptions,
            "",
        ]);
    };

    const updateOption = (index, value) => {
        setOptions((prevOptions) =>
            prevOptions.map((option, optionIndex) =>
                optionIndex === index
                    ? value
                    : option
            )
        );
    };

    const removeOption = (index) => {
        if (options.length <= 2) {
            console.log("The poll must have at least 2 options.");
            return;
        }

        setOptions((prevOptions) =>
            prevOptions.filter(
                (_, optionIndex) => optionIndex !== index
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanOptions = options
            .map((option) => option.trim())
            .filter((option) => option !== "");

        if (!question.trim()) {
            console.log("Write poll question");
            return;
        }

        if (cleanOptions.length < 2) {
            console.log("Write at least 2 options");
            return;
        }

        const pollData = {
            question: question.trim(),
            options: cleanOptions,
            start_date: startDate || null,
            end_date: endDate || null,
            status,
        };

        const url = isEdit
            ? `http://localhost:3010/admin/polls/updatePoll/${poll.id}`
            : "http://localhost:3010/admin/polls/addPoll";

        const method = isEdit ? "PUT" : "POST";

        try {
            setLoading(true);

            const accessToken =
                localStorage.getItem("accessToken") ||
                sessionStorage.getItem("accessToken");

            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken && {
                        Authorization: `Bearer ${accessToken}`,
                    }),
                },
                body: JSON.stringify(pollData),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            await onSuccess();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div
                className="modal fade show"
                tabIndex="-1"
                style={{ display: "block" }}
                aria-modal="true"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <form
                        className="modal-content"
                        onSubmit={handleSubmit}
                    >
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {isEdit
                                    ? "Update Poll"
                                    : "Create New Poll"}
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={close}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">
                                    Poll Question{" "}
                                    <span className="text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="e.g. Who will win the election?"
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label mb-0">
                                        Options{" "}
                                        <span className="text-danger">
                                            *
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={addOption}
                                    >
                                        <i className="bi bi-plus-lg me-1"></i>
                                        Add option
                                    </button>
                                </div>

                                <div id="pollOptionsWrap">
                                    {options.map(
                                        (option, index) => (
                                            <div
                                                className="poll-option-row"
                                                key={index}
                                            >
                                                <input
                                                    type="text"
                                                    className="form-control poll-opt"
                                                    placeholder={`Option ${
                                                        index + 1
                                                    }`}
                                                    value={option}
                                                    onChange={(e) =>
                                                        updateOption(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                                <button
                                                    type="button"
                                                    className="btn-remove-opt"
                                                    title="Remove"
                                                    onClick={() =>
                                                        removeOption(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="form-text">
                                    A poll needs at least two options.
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Start date
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        End date
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Status
                                    </label>

                                    <select
                                        className="form-select"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                    >
                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={close}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : isEdit
                                        ? "Update Poll"
                                        : "Save Poll"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="modal-backdrop fade show"></div>
        </>
    );
}

export default PollsModal;

