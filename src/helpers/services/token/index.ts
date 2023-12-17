const temp = sessionStorage.getItem("userDetails");

export const Authorization = temp ? `Bearer ${JSON.parse(temp).token}` : null;
