export default function DataFormatter(date) {
    
    const time = new Date(date);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
  
    return `${day < 10 ? `0${day}` : day}/${
      month < 10 ? `0${month}` : month
    }/${year}`;
  }
  