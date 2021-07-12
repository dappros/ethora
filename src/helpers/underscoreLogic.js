//replace any caps in a string with "_" followed with respective small case

export const underscoreManipulation = (str)=>{
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export const reverseUnderScoreManipulation = (str) => {
    return str.replace(/_([a-z])/gm, (m1, m2)=>{
        return m2.toUpperCase();
    });
}