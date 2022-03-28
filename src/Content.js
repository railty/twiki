import moment from "moment";
import { useAppContext } from "./AppContext";
import Account from "./account";
import {QRCodeSVG} from 'qrcode.react';
import {Html5QrcodeScanner} from "html5-qrcode"
import {Html5Qrcode} from "html5-qrcode"
import QRScanner from "./QRScanner";
import { useState } from "react";
import EditBox from "./EditBox";

function Content() {
  const [ state, dispatch ] = useAppContext();

  const [bImport, setBImport] = useState(false);

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

  const setActName = async (index, name)=>{
    dispatch({
      type: "rename_account_name",
      value: {index: index, name: name} 
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

  const scan = ()=>{
    let html5QrcodeScanner = new Html5QrcodeScanner("reader", { 
      fps: 10, 
      qrbox: {width: 250, height: 250} 
    }, false); //verbose=false

    html5QrcodeScanner.render( (decodedText, decodedResult) => {
      console.log(`Code matched = ${decodedText}`, decodedResult);
      setBImport(false);
    }, (error) => {
      if (errpr != "Code scan error = QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code."){
        console.warn(`Code scan error = ${error}`);
      }
    });
    setBImport(true);
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        
        <table className="table table-compact table-zebra">
          <thead></thead>
          <tbody>
            {state.accounts.map((act, i)=>{
              return (
              <tr key={i}>
                <td>
                  <EditBox value={act.name} setValue={(v)=>{setActName(i, v)}} />
                </td>
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
                  <button className="btn btn-primary btn-sm" onClick={()=>scan()}>Scan</button>
                </td>

                <td>
                  <label htmlFor="my-modal" className="btn btn-primary btn-sm modal-button">QR</label>
                  <input type="checkbox" id="my-modal" className="modal-toggle" />
                  <div className="modal">
                    <div className="modal-box relative w-96 h-96">
                      <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                      <QRCodeSVG value={act.sk} size="300" />    
                    </div>
                  </div>

                </td>

                <td>
                  {moment(act.iat*1000).fromNow()}
                </td>

              </tr>)
            })}
          </tbody>
        </table>
        
        <input type="checkbox" id="qrscan" className="modal-toggle" checked={bImport} onChange={()=>{}}/>
        <div className="modal">
          <div className="modal-box relative w-96 h-96 p-8">
            <label htmlFor="qrscan" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={()=>{setBImport(false)}}>✕</label>
            <div id="reader" className="mt-4 w-80"></div>    
          </div>
        </div>

      </div>
    </div>
  );
}

export default Content;