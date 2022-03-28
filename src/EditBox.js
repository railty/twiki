import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEllipsis} from "@fortawesome/free-solid-svg-icons";

function EditBox({value, setValue}) {
  const [v, setV] = useState(value);
  const [mode, setMode] = useState("readonly");  

  useEffect(() => {
    setV(value);
  }, [value]);

  if (mode=="readonly") return (
    <div className="flex">
      <input value={v} onChange={(e)=>setV(e.target.value)} className="input input-bordered input-sm" disabled></input>
      <button className="px-4" type="button" onClick={() => setMode("edit")}>
        <FontAwesomeIcon icon={faEllipsis} fontSize="16" color="blue" />
      </button>
    </div>
  );
  else return (
    <div className="flex">
      <input value={v} onChange={(e)=>setV(e.target.value)} className="input input-bordered input-sm"></input>

      <button className="px-4" type="button" onClick={() => {setValue(v); setMode("readonly");}}>
        <FontAwesomeIcon icon={faCheck} fontSize="16" color="blue" />
      </button>
    </div>
  )
}

export default EditBox;
