module.exports = {
    dateToIso(date) {
        const day = date.getUTCDate();
        const month = date.getUTCMonth();
        const year = date.getFullYear();
        
        return `${day}/${month+1}/${year}`
    },
};