import React, {useEffect, useRef} from 'react';

function Form({edit, onOpen}) {
    const API_URL = import.meta.env.VITE_API_URL;

    const nameRef = useRef(null);
    const slugRef = useRef(null)
    const descRef = useRef(null)
    const statusRef = useRef(null)
    useEffect(() => {
        if (edit) {
            nameRef.current.value = edit.name
            slugRef.current.value = edit.slug
            descRef.current.value = edit.description
            statusRef.current.value = edit.status

        }
    }, [edit])

    async function updateCategory() {

        let data = {
            id: edit.id,
            name: nameRef.current.value,
            slug: slugRef.current.value,
            description: descRef.current.value,
            status: statusRef.current.value
        };

        try {

            const res = await fetch(
                `${API_URL}/categories/${edit.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        category: data
                    }),
                }
            );

            const result = await res.json();
            if (result.success) {

                onOpen(false);

            }
            console.log(result);

        } catch (err) {

            console.log(err);

        }
    }

    async function saveInfo() {
        try {
            const res = await fetch(
                `${API_URL}/categories`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",

                    body: JSON.stringify({
                        name: nameRef.current.value,
                        slug: slugRef.current.value,
                        description: descRef.current.value,
                        status: statusRef.current.value
                    })
                }
            );
            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>


            <input type="hidden" id="catId"/>

            <div className="mb-3">

                <label className="form-label" htmlFor="catName">
                    Category Name{" "}
                    <span className="text-danger">*</span>
                </label>

                <input type="text" id="catName" ref={nameRef} className="form-control" placeholder="e.g. Technology"
                       required/>

            </div>

            <div className="mb-3">

                <label className="form-label" htmlFor="catSlug">
                    Slug{" "}
                    <span className="text-danger">*</span>
                </label>

                <div className="input-group">

                <span className="input-group-text">
                  /category/
                </span>
                    <input type="text" id="catSlug" ref={slugRef} className="form-control" placeholder="technology"
                           required/>
                </div>

                <div className="form-text">
                    Used in URL — only lowercase letters,
                    numbers and dashes.
                </div>

            </div>

            <div className="mb-3">

                <label className="form-label" htmlFor="catDesc">
                    Description
                </label>

                <textarea id="catDesc" ref={descRef} className="form-control"
                          placeholder="What kind of articles belong here?"></textarea>

            </div>

            <div className="mb-1">

                <label className="form-label" htmlFor="catStatus">
                    Status
                </label>

                <select id="catStatus" ref={statusRef} className="form-select">
                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>
                </select>

            </div>

            <div className="modal-footer">

                <button type="button" className="btn btn-light" data-bs-dismiss="modal" onClick={() => onOpen(false)}>
                    Cancel
                </button>

                <button type="submit" className="btn btn-primary" onClick={edit ? updateCategory : saveInfo}>
                    Save Category
                </button>

            </div>

        </div>
    );
}

export default Form;