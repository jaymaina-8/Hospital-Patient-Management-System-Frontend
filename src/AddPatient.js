import axios from "axios";
import { useState} from "react";

const AddPatient = () => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [blood, setBlood] = useState("");

    const handleCancelBtn = () => {
        setFirstName("");
        setLastName("");
        setBlood("");
    };

    const handleAddSubmit = async e => {
        e.preventDefault();
        console.log(first_name, last_name, blood)
        const res = await axios.post('http://127.0.0.1:8000/patients/', {
            first_name,
            last_name,
            blood
        })
        console.log(res.data)
        setFirstName("")
        setLastName("")
        setBlood("")
    }
    return(
        <>
        <form onSubmit={handleAddSubmit}>
            <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstName" value=
                    {first_name} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastName" value=
                    {last_name} onChange={e => setLastName(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="blood" className="form-label">Blood Group</label>
                <input type="text" className="form-control" id="blood" value=
                    {blood} onChange={e => setBlood(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-danger"
                    onClick={()=>{handleCancelBtn()}}>Cancel</button>
        </form>
        </>
    )

}
export default AddPatient;
