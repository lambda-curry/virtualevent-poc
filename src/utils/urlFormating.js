export const getSponsorURL = (id, name) => {  
  let formattedName = name.toLowerCase().replace(/\s/g, '-');
  return `${id}-${formattedName}`;
}