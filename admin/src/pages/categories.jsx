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
        fetch(`${API_URL}/categories`,{credentials:"include"})
            .then(response => response.json())
            .then(result => {
                setData(result);
            })
            .catch(err => {
                console.log(err);
            });
    }, [data]);


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