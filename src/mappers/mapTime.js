// Funzione che calcola il tempo trascorso a partire da un numero fornito di secondi
export const mapTime = timestamp => {
    const secondi = Math.floor((new Date() - timestamp * 1000) / 1000);

    let intervallo = Math.floor(secondi / 31536000);

    if (intervallo > 1) {
        return `${intervallo} years`;
    }
    intervallo = Math.floor(secondi / 2592000);

    if (intervallo > 1) {
        return `${intervallo} months`;
    }
    intervallo = Math.floor(secondi / 86400);

    if (intervallo > 1) {
        return `${intervallo} days`;
    }
    intervallo = Math.floor(secondi / 3600);

    if (intervallo > 1) {
        return `${intervallo} hours`;
    }
    intervallo = Math.floor(secondi / 60);

    if (intervallo > 1) {
        return `${intervallo} minutes`;
    }

    return `${Math.floor(secondi)} seconds`;
}