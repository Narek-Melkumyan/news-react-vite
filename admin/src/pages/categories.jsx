import CategoriesHeader from "../components/categories/CategoriesHeader.jsx";
import CategoriesStats from "../components/categories/CategoriesStats.jsx";
import CategoriesTable from "../components/categories/CategoriesTable.jsx";
import Modal from "../components/Modal.jsx";
import {useEffect, useState} from "react";
import Form from "../components/categories/form.jsx";

function Categories() {
    const API_URL = import.meta.env.VITE_API_URL;

const [modal, setModal] = useState(false);
    const [data,setData]=useState([])
    const [edit,setEdit]=useState(null)

    useEffect(() => {
        async function fetchCategories() {
            try {
                const accessToken =
                    localStorage.getItem("accessToken") ||
                    sessionStorage.getItem("accessToken");

                const response = await fetch(
                    `${API_URL}/categories`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: accessToken
                            ? {
                                Authorization: `Bearer ${accessToken}`,
                            }
                            : {},
                    }
                );

                const result = await response
                    .json()
                    .catch(() => []);

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch categories"
                    );
                }

                setData(result);
            } catch (error) {
                console.error(error);
            }
        }

        fetchCategories();
    }, [API_URL]);

    return (
        <div className="page">

            <CategoriesHeader setModal={setModal} />

            <CategoriesStats data={data}/>

            <CategoriesTable data={data} setEdit={setEdit} onOpen={setModal}/>
            {modal&&<Modal close={()=>setModal(false)}>
                <Form edit={edit} setEdit={setEdit}  onOpen={setModal}/>
            </Modal>}

        </div>
    );
}

export default Categories;