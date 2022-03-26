import { useAppContext } from "./AppContext";

function Comp() {
  const [ state, dispatch ] = useAppContext();

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{state.number}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={()=>{dispatch({type: "add_number", value: 3});}}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default Comp;




