const uniqId = (len = 15) => Math.random().toString(36).substring(2, len);

export default uniqId;
