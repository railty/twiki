import moment from "moment";
import { useAppContext } from "./AppContext";
import Account from "./account";

function Content() {
  const [ state, dispatch ] = useAppContext();

  const generate = (index)=>{
    const account = Account.generateAccount();
    dispatch({
      type: "generate_account",
      value: {account: account, index: index} 
    });
  }

  const remove = (index)=>{
    dispatch({
      type: "remove_account",
      value: {index: index} 
    });
  }

  const signin = async (index)=>{
    const jwt = await Account.signIn(state.accounts[index]);
    dispatch({
      type: "signIn_account",
      value: {index: index, jwt: jwt.jwt, iat: jwt.iat} 
    });
     
  };

  const access = async (act) => {
    const frm = document.createElement("FORM");
    document.body.appendChild(frm);

    const ipt = document.createElement("INPUT");
    ipt.setAttribute("type","hidden");
    ipt.setAttribute("name","jwt");
    ipt.setAttribute("value",act.jwt);
    frm.appendChild(ipt);

    frm.method = "POST";
    frm.action = `/wiki/${act.addr}`;
    frm.submit();
  }

  const test = async ()=>{
  
    const functions = getFunctions();
    const addMessage = httpsCallable(functions, 'addMessage');
    try{
      const result = await addMessage({ text: messageText });
      console.log("result = ", result);
    }
    catch(ex){
      console.log("ex = ", ex.toString());
    }
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        
        <button className="btn btn-primary btn-sm" onClick={test}>Test</button>

        <table className="table table-compact table-zebra">
          <thead></thead>
          <tbody>
            {state.accounts.map((act, i)=>{
              return (
              <tr key={i}>
                <td>{act.name}</td>
                <td>
                  {act.addr ? (
                    <button className="btn btn-primary btn-sm" onClick={()=>signin(i)}>Signin</button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={()=>generate(i)}>Generate</button>
                  )}
                </td>

                <td>
                  {act.addr ? (
                    <button className="btn btn-primary btn-sm" onClick={()=>remove(i)}>Delete</button>
                  ) : null}
                </td>

                <td>
                  <button className="btn btn-primary btn-sm" onClick={()=>access(act)}>Open</button>
                </td>

                <td>
                  {moment(act.iat*1000).fromNow()}
                </td>

              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Content;