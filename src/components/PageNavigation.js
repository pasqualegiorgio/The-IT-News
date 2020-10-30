import React from "react";
// import di styles
import '../styles/PageNavigation.css';

export default (props) => {
  // definizione delle variabili accettate come props
  const {
    mostraLinkPrecedente,
    mostraLinkSuccessivo,
    gestisciClickPrecedente,
    gestisciClickSuccessivo,
    caricamento
  } = props;

  // restituisce i buttons Prev e Next
  return (
    <div className="nav-link-container">
      <a
        href="#"
        className={`nav-link
        ${mostraLinkPrecedente ? "show" : "hide"}
        ${caricamento ? "greyed-out" : ""}
        `}
        onClick={gestisciClickPrecedente}
      >
        Prev
      </a>
      <a
        href="#"
        className={`nav-link
        ${mostraLinkSuccessivo ? "show" : "hide"}
        ${caricamento ? "greyed-out" : ""}
        `}
        onClick={gestisciClickSuccessivo}
      >
        Next
      </a>
    </div>
  );
};
