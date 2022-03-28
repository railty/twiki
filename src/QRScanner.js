import { useEffect } from "react";

function QRScanner() {
  useEffect(() => {
    console.log("xxxxxxxxx");
  }, []);

  return (
    <>
      <label htmlFor="qrscan" className="btn btn-primary btn-sm modal-button">Scan</label>
      <input type="checkbox" id="qrscan" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative w-96 h-96">
          <div id="reader" className="bg-red-200"></div>
        </div>
      </div>
    </>    
  );
}

export default QRScanner;
